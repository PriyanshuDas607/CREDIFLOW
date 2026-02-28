import React, { useState } from 'react';
import { useTrust } from '../../context/TrustContext';
import { Building, CreditCard, Plus, CheckCircle, Shield, X } from 'lucide-react';

const BankDetails = () => {
    const { profile, accounts, linkNewAccount } = useTrust();
    const [linking, setLinking] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Bank Form State
    const [bankForm, setBankForm] = useState({
        bankName: 'HDFC Bank',
        accountNo: '',
        ifsc: '',
        branch: ''
    });

    const handleLink = async (e) => {
        e.preventDefault();
        setLinking(true);
        // Pass details to context (mock simulation uses timing, but we can log these)
        await linkNewAccount(bankForm);
        setLinking(false);
        setShowModal(false);
        setBankForm({ bankName: 'HDFC Bank', accountNo: '', ifsc: '', branch: '' });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Aggregator</h1>
            <p className="text-gray-500 mb-8"> securely link your bank accounts to boost your Trust Score.</p>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Add New Account Card */}
                <button
                    onClick={() => setShowModal(true)}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition group h-64"
                >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Link Bank Account</h3>
                    <p className="text-sm text-gray-500 text-center mt-2 px-4">Connect via API (Finvu/Onemoney)</p>
                </button>

                {/* Existing Accounts */}
                {profile?.primaryBank && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-500 relative overflow-hidden h-64 flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                                    <Building size={24} className="text-indigo-600" />
                                </div>
                                <span className="px-2 py-1 text-xs font-bold uppercase rounded-full bg-green-100 text-green-600">
                                    Verified Link
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900">{profile.primaryBank}</h3>
                            <p className="text-gray-500 text-sm mb-1">Savings Account</p>
                            <p className="font-mono text-gray-400 tracking-wider">•••• {profile.accountLast4}</p>
                        </div>

                        <div className="relative z-10 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
                            <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
                                <CheckCircle size={16} className="text-emerald-500" /> Trust Profile Active
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Security Note */}
            <div className="mt-12 bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 items-start">
                <Shield className="text-emerald-600 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-gray-800">Bank-Grade Security</h4>
                    <p className="text-sm text-gray-600 mt-1">
                        We use RBI-regulated Account Aggregators. Your credentials are never stored. Read-only access is used strictly for credit scoring.
                    </p>
                </div>
            </div>

            {/* Link Account Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Building size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Connect Bank</h2>
                            <p className="text-sm text-gray-500">Enter details to fetch financial history.</p>
                        </div>

                        <form onSubmit={handleLink} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bank Name</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:border-blue-500 outline-none"
                                    value={bankForm.bankName}
                                    onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })}
                                >
                                    <option>HDFC Bank</option>
                                    <option>SBI</option>
                                    <option>ICICI Bank</option>
                                    <option>Axis Bank</option>
                                    <option>Kotak Mahindra</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Account Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter 12-16 digit Account No"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                    value={bankForm.accountNo}
                                    onChange={e => setBankForm({ ...bankForm, accountNo: e.target.value })}
                                    required
                                    pattern="[0-9]{9,18}"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">IFSC Code</label>
                                    <input
                                        type="text"
                                        placeholder="HDFC000123"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none uppercase"
                                        value={bankForm.ifsc}
                                        onChange={e => setBankForm({ ...bankForm, ifsc: e.target.value })}
                                        required
                                        maxLength={11}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Branch</label>
                                    <input
                                        type="text"
                                        placeholder="Mumbai Main"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                        value={bankForm.branch}
                                        onChange={e => setBankForm({ ...bankForm, branch: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={linking}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2 mt-4"
                            >
                                {linking ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>Link Account</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankDetails;
