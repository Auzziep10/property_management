import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function addExpense(businessId, expenseData) {
    const expensesRef = collection(db, 'businesses', businessId, 'expenses');
    const docRef = await addDoc(expensesRef, {
        ...expenseData,
        date: expenseData.date || serverTimestamp(),
        createdAt: serverTimestamp()
    });
    return docRef.id;
}

export async function getExpenses(businessId) {
    const expensesRef = collection(db, 'businesses', businessId, 'expenses');
    // Order by date descending if stored as timestamp, or client-side sort
    const q = query(expensesRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteExpense(businessId, expenseId) {
    const expenseRef = doc(db, 'businesses', businessId, 'expenses', expenseId);
    await deleteDoc(expenseRef);
}
