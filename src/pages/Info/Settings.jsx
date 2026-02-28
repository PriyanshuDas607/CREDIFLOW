import React, { useState } from 'react';
import { Lock, Smartphone, Database, Trash2, ShieldCheck, Bell, Eye, FileText, UserX, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ToggleRow = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
            <h4 className="font-semibold text-gray-800 text-sm">{label}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
            <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
    </div>
);

const Settings = () => {
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);

    const [privacy, setPrivacy] = useState({
        shareZomato: true,
        shareUber: false,
        shareBank: true,
        shareLocation: false,
        marketing: false
    });

    const [security, setSecurity] = useState({
        twoFactor: false,
        loginAlerts: true,
        deviceTracking: true
    });

    const [alerts, setAlerts] = useState({
        scoreChange: true,
        loanEmi: true,
        newEnquiry: true,
        weeklyReport: false
    });

    const togglePrivacy = (key) => setPrivacy(p => ({ ...p, [key]: !p[key] }));
    const toggleSecurity = (key) => setSecurity(s => ({ ...s, [key]: !s[key] }));
    const toggleAlert = (key) => setAlerts(a => ({ ...a, [key]: !a[key] }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings & Privacy</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage your account preferences and data controls.</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${saved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'}`}
                >
                    {saved ? <><CheckCircle size={15} /> Saved!</> : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-6">

                {/* KYC & Identity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <FileText className="text-blue-500" size={18} /> KYC & Identity
                    </h2>
                    <p className="text-gray-500 mb-5 text-sm">Documents used to verify your identity for credit scoring.</p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className="text-emerald-600" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">PAN Card</p>
                                    <p className="text-xs text-gray-500">Primary KYC Document · Verified</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">✓ Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-gray-400" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Aadhaar Linkage</p>
                                    <p className="text-xs text-gray-500">Optional — for enhanced trust signals</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">Link</button>
                        </div>
                    </div>
                </div>

                {/* Data Permissions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <Database className="text-primary" size={18} /> Data Permissions
                    </h2>
                    <p className="text-gray-500 mb-5 text-sm">Control which platforms share data with CrediFlow for your score.</p>
                    <div className="space-y-3">
                        <ToggleRow label="Sync Zomato/Swiggy Payouts" desc="Weekly income consistency tracking." checked={privacy.shareZomato} onChange={() => togglePrivacy('shareZomato')} />
                        <ToggleRow label="Sync Uber/Ola Trip Data" desc="Verifies active working hours and income." checked={privacy.shareUber} onChange={() => togglePrivacy('shareUber')} />
                        <ToggleRow label="Account Aggregator (Bank)" desc="Read-only access — verifies savings & EMI history." checked={privacy.shareBank} onChange={() => togglePrivacy('shareBank')} />
                        <ToggleRow label="Location-Based Verification" desc="Validates delivery zone and operational region." checked={privacy.shareLocation} onChange={() => togglePrivacy('shareLocation')} />
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <Lock className="text-rose-500" size={18} /> Security
                    </h2>
                    <p className="text-gray-500 mb-5 text-sm">Protect your account and control access.</p>
                    <div className="space-y-3">
                        <ToggleRow label="Two-Factor Authentication" desc="Get an OTP on your phone at every login." checked={security.twoFactor} onChange={() => toggleSecurity('twoFactor')} />
                        <ToggleRow label="Login Alerts (Email)" desc="Notify me whenever a new login is detected." checked={security.loginAlerts} onChange={() => toggleSecurity('loginAlerts')} />
                        <ToggleRow label="Trusted Device Tracking" desc="Allow remembered devices to skip OTP." checked={security.deviceTracking} onChange={() => toggleSecurity('deviceTracking')} />
                    </div>
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Change Password</p>
                            <p className="text-xs text-gray-400">Logged in as {user?.email}</p>
                        </div>
                        <button className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">Update</button>
                    </div>
                </div>

                {/* Notifications & Alerts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <Bell className="text-amber-500" size={18} /> Notifications & Alerts
                    </h2>
                    <p className="text-gray-500 mb-5 text-sm">Choose which events send you a notification.</p>
                    <div className="space-y-3">
                        <ToggleRow label="Trust Score Change" desc="Notify me when my score goes up or down." checked={alerts.scoreChange} onChange={() => toggleAlert('scoreChange')} />
                        <ToggleRow label="EMI Due Reminder" desc="Get reminders 3 days before EMI due date." checked={alerts.loanEmi} onChange={() => toggleAlert('loanEmi')} />
                        <ToggleRow label="New Credit Enquiry" desc="Alert me when a lender pulls my credit report." checked={alerts.newEnquiry} onChange={() => toggleAlert('newEnquiry')} />
                        <ToggleRow label="Weekly Analytics Report" desc="Receive a weekly email summary of spending." checked={alerts.weeklyReport} onChange={() => toggleAlert('weeklyReport')} />
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
                    <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                        <UserX size={18} /> Danger Zone
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Delete Account</p>
                            <p className="text-xs text-gray-400 mt-0.5">Permanently removes your profile and Trust Score data. Cannot be undone.</p>
                        </div>
                        <button className="px-5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold text-sm hover:bg-red-100 transition whitespace-nowrap">
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
