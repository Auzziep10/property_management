import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function addReminder(businessId, reminderData) {
    const remindersRef = collection(db, 'businesses', businessId, 'reminders');
    const docRef = await addDoc(remindersRef, {
        ...reminderData,
        createdAt: serverTimestamp()
    });
    return docRef.id;
}

export async function getReminders(businessId) {
    const remindersRef = collection(db, 'businesses', businessId, 'reminders');
    const q = query(remindersRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateReminderStatus(businessId, reminderId, isCompleted) {
    const reminderRef = doc(db, 'businesses', businessId, 'reminders', reminderId);
    await updateDoc(reminderRef, {
        completed: isCompleted,
        updatedAt: serverTimestamp()
    });
}

export async function deleteReminder(businessId, reminderId) {
    const reminderRef = doc(db, 'businesses', businessId, 'reminders', reminderId);
    await deleteDoc(reminderRef);
}
