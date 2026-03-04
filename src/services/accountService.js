import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function addAccount(businessId, accountData) {
    const accountsRef = collection(db, 'businesses', businessId, 'accounts');
    const docRef = await addDoc(accountsRef, {
        ...accountData,
        createdAt: serverTimestamp()
    });
    return docRef.id;
}

export async function getAccounts(businessId) {
    const accountsRef = collection(db, 'businesses', businessId, 'accounts');
    const q = query(accountsRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteAccount(businessId, accountId) {
    const accountRef = doc(db, 'businesses', businessId, 'accounts', accountId);
    await deleteDoc(accountRef);
}
