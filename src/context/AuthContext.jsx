import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db, isConfigValid } from '../lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isConfigValid) {
            throw new Error("Missing Firebase Configuration. Please check your .env file and ensure VITE_FIREBASE_API_KEY is set.");
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Read user's Firestore document to get idNumber (PAN) and other stored fields
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        // Attach PAN (idNumber) directly to the user object so TrustContext can pass it to the API
                        currentUser.idNumber = userData.idNumber || null;
                        currentUser.idType = userData.idType || null;
                    }
                } catch (e) {
                    console.warn("Could not read Firestore user doc on auth change:", e.message);
                }
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (email, password, name, idType, idNumber, pincode) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile
        await updateProfile(user, { displayName: name });

        // Create User Document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            idType: idType || 'Not Provided',
            idNumber: idNumber || 'Not Provided',
            pincode: pincode || 'Not Provided',
            createdAt: new Date().toISOString(),
            trustScore: 650, // Default starting score
            onboardingCompleted: false
        });

        return user;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

