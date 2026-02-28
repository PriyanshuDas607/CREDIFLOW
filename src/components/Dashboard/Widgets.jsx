import React from 'react';
import { CreditCard, Building, Wallet, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BankCard = ({ user }) => {
    const noData = !user || !user.primaryBank;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-secondary rounded-lg">
                    <Building size={20} />
                </div>
                <h3 className="font-semibold text-gray-700">Bank Details</h3>
            </div>

            {!user.primaryBank ? (
                <div className="flex flex-col items-center justify-center py-4 text-gray-400 gap-2">
                    <AlertCircle size={24} className="text-red-400" />
                    <p className="text-sm font-medium">Bank details not fetched</p>
                </div>
            ) : (
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between pb-2 border-b border-gray-50">
                        <span className="text-gray-500">Account Holder</span>
                        <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-50">
                        <span className="text-gray-500">Primary Bank</span>
                        <span className="font-medium text-gray-800">{user.primaryBank}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Account No.</span>
                        <span className="font-medium text-gray-800">•••• {user.accountLast4}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export const LoanCard = ({ user }) => {

    if (!user) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-4 text-gray-400 gap-2">
                <AlertCircle size={24} className="text-red-400" />
                <p className="text-sm font-medium">Loan details not fetched</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 text-primary rounded-lg">
                    <Wallet size={20} />
                </div>
                <h3 className="font-semibold text-gray-700">Active Loans</h3>
            </div>

            {(!user.activeLoans || user.activeLoans.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-4 text-gray-400 gap-2">
                    <AlertCircle size={24} className="text-red-400" />
                    <p className="text-sm font-medium">No Active Loans found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {user.activeLoans.map((loan, idx) => {
                        const bColor = loan.badgeColor || (loan.status === 'Paid' ? 'green' : 'blue');
                        return (
                            <div key={idx} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{loan.type}</p>
                                    <p className="text-xs text-gray-400">{loan.bank}</p>
                                </div>
                                <span className={`px-2 py-1 bg-${bColor}-50 text-${bColor}-700 text-xs font-bold rounded-full`}>{loan.status}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};
