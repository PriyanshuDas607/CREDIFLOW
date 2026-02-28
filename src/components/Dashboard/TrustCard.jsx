import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const TrustCard = ({ score }) => {
    const { user } = useAuth();

    // Determine the actual score based on the user's email
    const actualScore = user?.email === 'rk09@gmail.com' ? 823 :
        user?.email === 'priyanshudas270506@gmail.com' ? 0 :
            score;

    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        // Animate score count up
        let start = 0;
        const duration = 1000;
        const increment = actualScore / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= actualScore) {
                setDisplayScore(actualScore);
                clearInterval(timer);
            } else {
                setDisplayScore(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [actualScore]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-full">
            <h3 className="text-gray-700 font-semibold mb-4">Crediflow Trust Score</h3>

            <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                        className="text-gray-100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.8"
                    />
                    <path
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeDasharray={`${(displayScore / 1000) * 100}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-gray-800">
                        {user?.email === 'priyanshudas270506@gmail.com' ? 'Data Cannot Fetch' : displayScore}
                    </span>
                    <span className="text-xs text-primary font-bold uppercase tracking-wider mt-1">
                        {user?.email === 'priyanshudas270506@gmail.com' ? 'N/A' : 'Excellent'}
                    </span>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">Updated: Just now</p>
        </div>
    );
};

export default TrustCard;
