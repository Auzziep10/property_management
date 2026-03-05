import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function register(email, password, displayName, businessName) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create business and user in Firestore
        const businessId = `biz_${user.uid}`; // Simple 1:1 business mapping for now
        await setDoc(doc(db, 'businesses', businessId), {
            name: businessName,
            createdAt: new Date()
        });

        await setDoc(doc(db, 'users', user.uid), {
            email,
            displayName,
            businessId,
            role: 'owner'
        });

        return userCredential;
    }

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // First time login via Google, create business and user config
            const businessId = `biz_${user.uid}`;
            await setDoc(doc(db, 'businesses', businessId), {
                name: `${user.displayName || 'My'} Business`,
                createdAt: new Date()
            });

            await setDoc(userDocRef, {
                email: user.email,
                displayName: user.displayName || 'User',
                businessId,
                role: 'owner'
            });

            setUserProfile({
                email: user.email,
                displayName: user.displayName || 'User',
                businessId,
                role: 'owner'
            });
        }
        return result;
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    // Fetch user profile to get businessId
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        login,
        register,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
