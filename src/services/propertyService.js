import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function addProperty(businessId, propertyData) {
    const propertiesRef = collection(db, 'businesses', businessId, 'properties');
    const docRef = await addDoc(propertiesRef, {
        ...propertyData,
        createdAt: serverTimestamp()
    });
    return docRef.id;
}

export async function getProperties(businessId) {
    const propertiesRef = collection(db, 'businesses', businessId, 'properties');
    const q = query(propertiesRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateProperty(businessId, propertyId, updates) {
    const propertyRef = doc(db, 'businesses', businessId, 'properties', propertyId);
    await updateDoc(propertyRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export async function deleteProperty(businessId, propertyId) {
    const propertyRef = doc(db, 'businesses', businessId, 'properties', propertyId);
    await deleteDoc(propertyRef);
}
