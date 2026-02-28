import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MOCK_USER, BANK_ACCOUNTS, ACTIVE_LOANS, RECENT_TRANSACTIONS } from '../data/mockData';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const TrustContext = createContext(null);

export const TrustProvider = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(MOCK_USER); // Fallback to mock for initial structure
    const [accounts, setAccounts] = useState([]);
    const [loans, setLoans] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    // Track whether we've loaded fresh data from the API (prevents Firestore from overwriting it)
    const apiDataLoaded = useRef(false);

    // Sync Auth User with Trust Profile via Firestore and API
    useEffect(() => {
        if (user) {
            // Immediate update: clear mock identity AND reset financial score to null
            // so no stale Firestore cached value (e.g. 823) can flash before the API responds.
            setProfile(prev => ({
                ...prev,
                name: user.displayName || prev.name,
                email: user.email || prev.email,
                avatar: user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user.displayName || "User"),
                trustScore: null,      // always cleared – API provides the real score
                primaryBank: null,
                accountLast4: null,
                idNumber: null,
                activeLoans: [],
            }));

            const fetchUserData = async () => {
                try {
                    // Pass PAN as query param so backend can discover CSVs automatically
                    const pan = user.idNumber || '';
                    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    const url = `${apiBase}/api/user-data/${encodeURIComponent(user.email)}${pan ? `?pan=${encodeURIComponent(pan)}` : ''}`;
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();

                        // Mark API data as loaded so Firestore won't overwrite financial fields
                        apiDataLoaded.current = true;

                        // First update local state for immediate UI reaction
                        setProfile(prev => ({
                            ...prev,
                            ...data.profile,
                            badges: data.profile.badges || prev.badges,
                            // IMPORTANT: Override activeLoans from backend, not Firestore/mock
                            activeLoans: data.loans || []
                        }));
                        if (data.loans) setLoans(data.loans);
                        if (data.recentTransactions) setTransactions(data.recentTransactions);
                        if (data.profile.primaryBank) {
                            setAccounts([{
                                id: 1,
                                bankName: data.profile.primaryBank,
                                type: "Savings",
                                accountNo: `•••• ${data.profile.accountLast4}`,
                                balance: 'XXX', // Hidden or not provided by backend
                                isPrimary: true,
                                linked: true
                            }]);
                        }

                        // Permanently DELETE trustScore from Firestore so stale values
                        // (e.g. 823) can never be read again. Score is always recalculated by API.
                        if (user.uid) {
                            import('firebase/firestore').then(({ updateDoc, deleteField }) => {
                                updateDoc(doc(db, "users", user.uid), {
                                    trustScore: deleteField(),         // REMOVE stale cached score permanently
                                    aiAnalysis: deleteField(),         // Remove cached AI analysis
                                    recentTransactions: deleteField(), // Remove cached transactions (large data)
                                    primaryBank: data.profile.primaryBank || null,
                                    accountLast4: data.profile.accountLast4 || null,
                                    idNumber: data.profile.idNumber || null,
                                    activeLoans: data.loans || [],
                                }).catch(e => console.error("Error updating firestore with backend data", e));
                            });
                        }

                    } else {
                        console.warn("Could not fetch extended data from node API for", user.email);
                    }
                } catch (error) {
                    console.error("Failed to fetch user data from API:", error);
                }
            };

            fetchUserData();

            if (user.uid) {
                const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        setProfile(prev => ({
                            ...prev,
                            // Only sync display identity fields from Firestore.
                            // Financial fields (trustScore, loans, idNumber) come ONLY from the
                            // backend API to avoid showing stale cached data.
                            name: docSnapshot.data().name || user.displayName || prev.name,
                            email: docSnapshot.data().email || user.email || prev.email,
                        }));
                    }
                });
                return () => unsubscribe();
            }
        }
    }, [user]);

    // Simulator Logic
    const calculateEligibility = (savings, existingEmi) => {
        // Simple logic: Max EMI capacity = (Savings - Existing EMI) * 0.6
        // Max Loan = EMI Capacity * 36 (3 years)
        const emiCapacity = Math.max(0, (savings - existingEmi) * 0.6);
        const maxLoan = Math.round(emiCapacity * 36);
        return { maxLoan, recommendedEmi: Math.round(emiCapacity) };
    };

    const linkNewAccount = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newAcc = {
                    id: Date.now(),
                    bankName: "SBI Savings",
                    type: "Savings",
                    accountNo: "XXXX-1122",
                    balance: 5600,
                    isPrimary: false,
                    linked: true
                };
                setAccounts(prev => [...prev, newAcc]);
                resolve(newAcc);
            }, 2500); // 2.5s mock delay
        });
    };

    const updateProfile = (newDetails) => {
        setProfile(prev => ({ ...prev, ...newDetails }));
    };

    return (
        <TrustContext.Provider value={{
            profile,
            updateProfile,
            accounts,
            loans,
            transactions,
            calculateEligibility,
            linkNewAccount,
            isSimulationMode,
            setIsSimulationMode
        }}>
            {children}
        </TrustContext.Provider>
    );
};

export const useTrust = () => useContext(TrustContext);
