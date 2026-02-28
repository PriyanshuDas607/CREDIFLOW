import React, { useState, useMemo } from 'react';
import { useTrust } from '../context/TrustContext';
import TrustCard from '../components/Dashboard/TrustCard';
import AnalyticsChart from '../components/Dashboard/AnalyticsChart';
import { BankCard, LoanCard } from '../components/Dashboard/Widgets';
import { Download, Shield, Zap, X, CheckCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { profile, transactions } = useTrust();
    const [showTips, setShowTips] = useState(false);

    const parsedSums = useMemo(() => {
        let exp = 0;
        if (transactions && transactions.length > 0) {
            transactions.forEach(tx => {
                Object.keys(tx).forEach(k => {
                    const keyLower = k.toLowerCase();
                    const valStr = tx[k] ? tx[k].toString() : "0";
                    let num = parseFloat(valStr.replace(/[^0-9.-]+/g, ""));
                    if (isNaN(num)) num = 0;

                    if (keyLower.includes('debit') || keyLower.includes('withdrawal')) {
                        exp += Math.abs(num);
                    } else if (keyLower === 'amount' && num < 0) {
                        exp += Math.abs(num);
                    }
                });
            });
        }
        return exp;
    }, [transactions]);

    const totalOutflow = parsedSums > 0 ? parsedSums : 32450;

    const handleDownloadReport = () => {
        // Basic Print Trigger - In production, this would generate a PDF Blob
        window.print();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">{profile?.name || 'User'}</span>
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Your Trust Profile is active.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm"
                    >
                        <Download size={18} /> Report
                    </button>
                    <button
                        onClick={() => setShowTips(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary to-primary text-white rounded-lg font-semibold shadow hover:shadow-lg transition hover:-translate-y-0.5"
                    >
                        <Zap size={18} /> Boost Score
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">

                {/* Trust Score Area */}
                <div className="md:row-span-2 relative group">
                    <TrustCard score={profile?.trustScore || 0} />
                </div>

                {/* Bank & Loan Widgets */}
                <BankCard user={profile} />
                <LoanCard user={profile} />

                {/* Updated Analytics & Stats Row */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Income Consistency</h3>
                            <button className="text-xs text-primary font-bold hover:underline">View Report</button>
                        </div>
                        <div className="h-64">
                            <AnalyticsChart />
                        </div>
                    </div>

                    {/* Spend Analysis */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <h3 className="font-bold text-gray-800 mb-4">Spend Analysis</h3>
                        <div className="space-y-4">
                            {[
                                { cat: "EMI & Repayments", val: "45%", color: "bg-blue-500" },
                                { cat: "Food & Grocery", val: "30%", color: "bg-emerald-500" },
                                { cat: "Utilities", val: "15%", color: "bg-orange-500" },
                                { cat: "Savings", val: "10%", color: "bg-purple-500" },
                            ].map((item) => (
                                <div key={item.cat}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-600 font-medium">{item.cat}</span>
                                        <span className="font-bold text-gray-900">{item.val}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: item.val }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <span className="text-xs text-gray-400">Total Outflow</span>
                            <span className="text-sm font-bold text-gray-900">₹{totalOutflow.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Verified Badges Widget */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-emerald-500" /> Trust Factors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {(profile?.badges || []).map(badge => (
                            <div key={badge.id} className="p-2 bg-slate-50 border border-gray-100 rounded-lg flex items-center gap-2" title={badge.name}>
                                <span className="text-xl">{badge.icon}</span>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-bold text-gray-800">{badge.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            Your score is in the <span className="text-green-600 font-bold">Top 15%</span> of gig workers in Mumbai.
                        </p>
                    </div>
                </div>
            </div>

            {/* Boost Tips Modal */}
            {showTips && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative">
                        <button
                            onClick={() => setShowTips(false)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 text-yellow-600">
                                <TrendingUp size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Boost Your Trust Score</h2>
                            <p className="text-gray-500">AI-generated tips to reach 800+.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    id: 1,
                                    title: profile?.activeLoans?.length > 0 ? 'Manage Active Liabilities' : 'Maintain Zero Debt',
                                    desc: profile?.activeLoans?.length > 0 ? `Consistent payments on your ${profile.activeLoans[0]?.bank || 'loan'} account improve credit utilization.` : 'You have no active loans! Keep it up to ensure a clean borrowing record.',
                                    points: '+15 pts'
                                },
                                {
                                    id: 2,
                                    title: 'Verify Primary Bank',
                                    desc: `Ensure your ${profile?.primaryBank || 'primary'} account stays active to log your gig income consistently.`,
                                    points: '+20 pts'
                                },
                                {
                                    id: 3,
                                    title: 'Consistency Streak',
                                    desc: 'Maintain steady transaction inflows for 2 more months to unlock higher trust tiering.',
                                    points: '+35 pts'
                                }
                            ].map(tip => (
                                <div key={tip.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition">
                                    <div className="mt-1">
                                        <CheckCircle size={20} className="text-gray-300" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{tip.title}</h4>
                                        <p className="text-sm text-gray-500">{tip.desc}</p>
                                    </div>
                                    <span className="text-emerald-600 font-bold text-sm whitespace-nowrap">{tip.points}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowTips(false)}
                            className="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
                        >
                            Got it, thanks!
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
