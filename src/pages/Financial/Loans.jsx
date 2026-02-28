import React from 'react';
import { useTrust } from '../../context/TrustContext';
import { Wallet, Calendar, Clock, AlertCircle, CheckCircle, IndianRupee, TrendingDown } from 'lucide-react';

const Loans = () => {
    const { loans, profile } = useTrust();

    const totalActiveEmi = loans
        .filter(l => l.status === 'Active')
        .reduce((acc, l) => acc + (l.emi || 0), 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Loans</h1>
                <p className="text-gray-500 mt-1 text-sm">A summary of your active and closed credit facilities.</p>
            </div>

            {/* Summary Strip */}
            {loans.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Accounts</p>
                        <p className="text-3xl font-bold text-gray-900">{loans.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Active Loans</p>
                        <p className="text-3xl font-bold text-blue-600">{loans.filter(l => l.status === 'Active').length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100 col-span-2 sm:col-span-1">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Monthly Outflow</p>
                        <p className="text-3xl font-bold text-rose-600">₹{totalActiveEmi.toLocaleString()}</p>
                    </div>
                </div>
            )}

            {/* Loan Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {loans.length === 0 ? (
                    <div className="col-span-2 border border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-gray-400 rounded-2xl">
                        <AlertCircle size={36} className="mb-3 text-slate-300" />
                        <p className="font-semibold text-gray-500">No loan accounts found</p>
                        <p className="text-sm text-gray-400 mt-1">Link a bank account to see associated credit facilities.</p>
                    </div>
                ) : (
                    loans.map((loan, index) => {
                        const isActive = loan.status === 'Active';
                        return (
                            <div key={index} className={`bg-white p-6 rounded-2xl shadow-sm border ${isActive ? 'border-gray-100' : 'border-gray-100 opacity-80'} relative overflow-hidden`}>

                                {/* Status Badge */}
                                <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full ${isActive ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'} flex items-center gap-1`}>
                                    {isActive ? null : <CheckCircle size={10} />}
                                    {loan.status}
                                </div>

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-5 pr-20">
                                    <div className={`p-3 rounded-xl ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <Wallet size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{loan.type}</h3>
                                        <p className="text-sm text-gray-500">{loan.lender || loan.bank}</p>
                                    </div>
                                </div>

                                {/* Key Metrics Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Loan Amount</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            ₹{loan.amount ? (loan.amount / 100000 >= 1 ? `${(loan.amount / 100000).toFixed(1)}L` : `${(loan.amount / 1000).toFixed(0)}K`) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className={`rounded-xl p-3 ${isActive ? 'bg-rose-50' : 'bg-slate-50'}`}>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Monthly EMI</p>
                                        <p className={`text-lg font-bold ${isActive ? 'text-rose-600' : 'text-gray-600'}`}>
                                            {loan.emi ? `₹${loan.emi.toLocaleString()}` : 'Closed'}
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline Details */}
                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                    {loan.tenure && (
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <Clock size={13} />
                                                <span>Tenure</span>
                                            </div>
                                            <span className="font-semibold text-gray-800">{loan.tenure}</span>
                                        </div>
                                    )}
                                    {loan.startDate && (
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <Calendar size={13} />
                                                <span>Period</span>
                                            </div>
                                            <span className="font-semibold text-gray-800">{loan.startDate} – {loan.endDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Disclaimer */}
            {loans.length > 0 && (
                <p className="text-center text-xs text-gray-400 mt-8">
                    Data sourced from Account Aggregator consent. Amounts are approximate and for display purposes only.
                </p>
            )}
        </div>
    );
};

export default Loans;
