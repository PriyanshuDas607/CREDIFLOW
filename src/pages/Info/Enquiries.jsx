import React from 'react';
import { useTrust } from '../../context/TrustContext';
import { Search, AlertCircle, FileSearch } from 'lucide-react';

const Enquiries = () => {
    const { profile, transactions } = useTrust();

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Enquiries & Checks</h1>
                    <p className="text-gray-500 mt-1">Recent soft/hard data pulls affecting your Trust Score.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-semibold flex items-center gap-2 border border-emerald-100">
                    <Search size={18} /> 0 Hard Enquiries
                </div>
            </div>

            {(!transactions || transactions.length === 0) ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                        <FileSearch size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Enquiries Found</h3>
                    <p className="text-gray-500 max-w-md">
                        There are no recent credit pulls or data verification requests on your profile in the last 6 months.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Institution</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Purpose</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Impact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {/* Simulate an enquiry if they have active loans */}
                                {profile?.activeLoans?.length > 0 ? (
                                    <>
                                        <tr className="hover:bg-slate-50/50 transition">
                                            <td className="p-4 text-sm font-medium text-gray-900">14 Jan 2026</td>
                                            <td className="p-4 text-sm text-gray-600 font-semibold">{profile.activeLoans[0]?.bank.split('•')[0].trim()}</td>
                                            <td className="p-4 text-sm text-gray-500">Loan Origination Review</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">Hard Pull</span>
                                            </td>
                                            <td className="p-4 text-sm text-rose-500 font-semibold">-5 pts</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 transition">
                                            <td className="p-4 text-sm font-medium text-gray-900">02 Nov 2025</td>
                                            <td className="p-4 text-sm text-gray-600 font-semibold">Crediflow Analytics AI</td>
                                            <td className="p-4 text-sm text-gray-500">Profile Health Check</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">Soft Pull</span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400 font-semibold">None</td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr className="hover:bg-slate-50/50 transition">
                                        <td className="p-4 text-sm font-medium text-gray-900">15 Feb 2026</td>
                                        <td className="p-4 text-sm text-gray-600 font-semibold">Crediflow Analytics AI</td>
                                        <td className="p-4 text-sm text-gray-500">Routine Profile Review</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">Soft Pull</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400 font-semibold">None</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Enquiries;
