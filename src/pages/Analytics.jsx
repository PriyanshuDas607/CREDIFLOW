import React from 'react';
import { useTrust } from '../context/TrustContext';
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import AnalyticsChart from '../components/Dashboard/AnalyticsChart';

const Analytics = () => {
    const { profile, transactions } = useTrust();

    const parsedSums = React.useMemo(() => {
        let inc = 0; let exp = 0;
        if (transactions && transactions.length > 0) {
            transactions.forEach(tx => {
                Object.keys(tx).forEach(k => {
                    const keyLower = k.toLowerCase();
                    const valStr = tx[k] ? tx[k].toString() : "0";
                    let num = parseFloat(valStr.replace(/[^0-9.-]+/g, ""));
                    if (isNaN(num)) num = 0;

                    if (keyLower.includes('credit') || keyLower.includes('deposit') || keyLower.includes('payout') || keyLower.includes('transfer') || keyLower.includes('earning')) {
                        inc += Math.abs(num);
                    } else if (keyLower.includes('debit') || keyLower.includes('withdrawal')) {
                        exp += Math.abs(num);
                    } else if (keyLower === 'amount') {
                        if (num < 0) exp += Math.abs(num);
                        else inc += num;
                    }
                });
            });
        }
        return { inc, exp };
    }, [transactions]);

    const totalRecentVolume = (parsedSums.inc + parsedSums.exp) || 84500;
    const baseIncome = parsedSums.inc > 0 ? Math.round(parsedSums.inc / 3 / 1000) : (profile?.primaryBank === 'SBI Bank' ? 30 : 50);
    const baseExpense = parsedSums.exp > 0 ? Math.round(parsedSums.exp / 3 / 1000) : (baseIncome - 12);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BarChart3 className="text-emerald-500" size={32} />
                Financial Analytics
            </h1>
            <p className="text-gray-500 mb-8">Deep dive into your cash flows, spending behavior, and earning trends over the last quarter.</p>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Cash Flow</p>
                        <h2 className="text-3xl font-bold text-gray-900">₹{(totalRecentVolume).toLocaleString()}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Avg. Monthly Income</p>
                        <h2 className="text-3xl font-bold text-gray-900">₹{(baseIncome * 1000).toLocaleString()}</h2>
                        <span className="text-sm text-emerald-600 font-bold flex items-center gap-1 mt-1">
                            <TrendingUp size={16} /> +4.2% Growth
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <BarChart3 size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Avg. Monthly Expense</p>
                        <h2 className="text-3xl font-bold text-gray-900">₹{((baseIncome - 12) * 1000).toLocaleString()}</h2>
                        <span className="text-sm text-gray-400 font-medium mt-1 inline-block">
                            Sustainable Burn Rate
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                        <TrendingDown size={24} />
                    </div>
                </div>
            </div>

            {/* Main Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visual Chart from Dashboard Component */}
                <div className="lg:col-span-2 bg-white p-6 flex flex-col items-stretch rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                    <AnalyticsChart />
                </div>

                {/* Breakdown Panel */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <h3 className="font-bold text-gray-800 mb-6">Expense Breakdown</h3>
                    <div className="space-y-6 flex-1">
                        {[
                            { cat: "EMI & Debt", val: profile?.activeLoans?.length > 0 ? "35%" : "0%", color: "bg-rose-500", amt: profile?.activeLoans?.length > 0 ? "₹15,400" : "₹0" },
                            { cat: "Fuel & Transit", val: "25%", color: "bg-blue-500", amt: "₹8,200" },
                            { cat: "Grocery & Subscriptions", val: "30%", color: "bg-amber-500", amt: "₹12,000" },
                            { cat: "Savings Deposit", val: "10%", color: "bg-emerald-500", amt: "₹4,000" },
                        ].map((item) => (
                            <div key={item.cat}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-700 font-semibold">{item.cat}</span>
                                    <span className="font-bold text-gray-900">{item.amt} <span className="text-gray-400 font-normal ml-1">({item.val})</span></span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.val }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-sm text-gray-600">
                            <strong>AI Insight:</strong> Your fuel expenditure has dropped by 4% compared to {profile?.primaryBank || "last month"}. Keeping EMIs low stabilizes the Trust Score.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
