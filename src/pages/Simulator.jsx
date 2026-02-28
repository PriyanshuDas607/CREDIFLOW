import React, { useState, useEffect } from 'react';
import { useTrust } from '../context/TrustContext';
import { Calculator, CheckCircle, AlertCircle } from 'lucide-react';

const Simulator = () => {
    const { calculateEligibility, profile } = useTrust();

    // State for sliders
    const [savings, setSavings] = useState(5000);
    const [existingEmi, setExistingEmi] = useState(0);

    const [result, setResult] = useState({ maxLoan: 0, recommendedEmi: 0 });

    useEffect(() => {
        setResult(calculateEligibility(savings, existingEmi));
    }, [savings, existingEmi, calculateEligibility]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Calculator className="text-primary" /> Credit Simulator
                </h1>
                <p className="text-gray-500 mt-2">
                    Use AI to predict your loan eligibility based on your monthly cash flow.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">

                    {/* Savings Slider */}
                    <div>
                        <div className="flex justify-between mb-4">
                            <label className="font-semibold text-gray-700">Monthly Savings</label>
                            <span className="text-primary font-bold text-lg">₹{savings.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="50000"
                            step="500"
                            value={savings}
                            onChange={(e) => setSavings(Number(e.target.value))}
                            className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-xs text-gray-400 mt-2">Higher savings indicates better repayment capacity.</p>
                    </div>

                    {/* Existing EMI Slider */}
                    <div>
                        <div className="flex justify-between mb-4">
                            <label className="font-semibold text-gray-700">Existing EMI</label>
                            <span className="text-red-500 font-bold text-lg">₹{existingEmi.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="20000"
                            step="500"
                            value={existingEmi}
                            onChange={(e) => setExistingEmi(Number(e.target.value))}
                            className="w-full accent-red-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-xs text-gray-400 mt-2">Existing debt reduces your eligibility.</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                        <AlertCircle className="text-secondary shrink-0 mt-1" size={20} />
                        <p className="text-sm text-blue-800">
                            <strong>Pro Tip:</strong> Increasing your savings by just ₹2,000 can boost your loan limit by approx ₹70,000.
                        </p>
                    </div>
                </div>

                {/* Results Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl text-white flex flex-col justify-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Calculator size={200} />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-6">Estimated Eligibility</h3>

                        <div className="mb-8">
                            <p className="text-4xl font-bold text-primary mb-1">₹{result.maxLoan.toLocaleString()}</p>
                            <p className="text-gray-400">Max Loan Amount</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8 border-t border-gray-700 pt-6">
                            <div>
                                <p className="text-2xl font-bold">₹{result.recommendedEmi.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">Safe Monthly EMI</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-secondary">36 Mo</p>
                                <p className="text-xs text-gray-400">Recommended Tenure</p>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-primary hover:bg-green-500 text-white rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2">
                            <CheckCircle size={20} /> Apply Now with TrustScore
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            *Estimates based on your Trust Score of {profile.trustScore}. Final offer my vary.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Simulator;
