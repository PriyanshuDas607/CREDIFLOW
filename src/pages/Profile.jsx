import React, { useState } from 'react';
import { useTrust } from '../context/TrustContext';
import TrustCard from '../components/UI/TrustCard'; // The new dark card
import { ShieldCheck, Award, Briefcase, MapPin, Share2, Download, Copy, Edit2, Check, CheckCircle, CreditCard } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { profile, updateProfile } = useTrust();
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);

    // Safe initialization - Hooks must run unconditionally
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        role: profile?.role || '',
        location: 'Mumbai, IN'
    });

    // ... (useEffect remains unchanged)

    // ... (if !profile check remains unchanged)

    const handleDownload = async () => {
        const element = document.getElementById('trust-card-node');
        if (element) {
            try {
                const canvas = await html2canvas(element, {
                    backgroundColor: null,
                    scale: 2, // Higher resolution
                    useCORS: true // Enable loading external images like avatars
                });
                const link = document.createElement('a');
                link.download = `TrustCard-${profile.name}.png`;
                link.href = canvas.toDataURL();
                link.click();
            } catch (err) {
                console.error("Download failed:", err);
                alert("Failed to download card.");
            }
        }
    };

    // Sync state with profile updates
    React.useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                name: profile.name || '',
                role: profile.role || ''
            }));
        }
    }, [profile]);

    if (!profile) {
        return <div className="p-12 text-center text-gray-400 flex flex-col items-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>Loading Profile...</div>;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(`Check out my TrustFlow Score: ${profile.trustScore}`);
        alert("Link copied!");
    };

    const handleSave = () => {
        if (editing) {
            updateProfile({ name: formData.name, role: formData.role });
        }
        setEditing(!editing);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">

                {/* Left Column: The Trust Card Showcase */}
                <div className="md:col-span-1 space-y-6">
                    <div className="text-center md:text-left mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">Your Trust Card</h2>
                        <p className="text-sm text-gray-500">A shareable, verified proof of your creditworthiness.</p>
                    </div>

                    {/* THE NEW DARK CARD COMPONENT */}
                    <div id="trust-card-node" className="bg-transparent">
                        <TrustCard profile={{ ...profile }} />
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                        <h3 className="font-semibold text-gray-700 mb-2">Share Your Trust Card</h3>
                        <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2">
                            <Share2 size={18} /> Share Link
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleDownload}
                                className="py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition flex items-center justify-center gap-2"
                            >
                                <Download size={18} /> Download
                            </button>
                            <button onClick={handleCopy} className="py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition flex items-center justify-center gap-2">
                                <Copy size={18} /> Copy Link
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            Your Trust Card is privacy-first. Lenders can verify your score without seeing your transaction details.
                        </p>
                    </div>
                </div>

                {/* Right Column: Profile Details & Badges */}
                <div className="md:col-span-2 space-y-8">

                    {/* Editable Profile Header */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative">
                        <button
                            onClick={handleSave}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
                            title={editing ? "Save Changes" : "Edit Profile"}
                        >
                            {editing ? <Check className="text-green-600" /> : <Edit2 size={18} />}
                        </button>

                        <div className="flex items-center gap-6">
                            <img src={profile.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-md" />
                            <div className="flex-1">
                                {editing ? (
                                    <div className="space-y-2 max-w-sm">
                                        <input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-lg font-bold"
                                        />
                                        <input
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
                                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                                            <Briefcase size={16} /> {formData.role} • <MapPin size={16} /> {formData.location}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Identity Verification</h2>
                        {user?.email === 'priyanshudas270506@gmail.com' ? (
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center">
                                <p className="font-bold text-red-600">PAN Card Not Connected</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">ID Type</p>
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={16} className="text-blue-500" />
                                        <p className="font-bold text-gray-800">PAN Card</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">ID Number</p>
                                    <p className="font-bold text-gray-800">{profile.idNumber}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <CheckCircle size={16} />
                                        <p className="font-bold">Verified</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Verified Badges List */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Verified Badges</h2>
                            <Award className="text-emerald-500" />
                        </div>

                        <div className="space-y-4">
                            {(profile.badges || []).map((badge) => (
                                <div key={badge.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl group-hover:scale-110 transition">{badge.icon}</div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{badge.name}</h4>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">{badge.type}</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                                        <CheckCircle size={16} />
                                    </div>
                                </div>
                            ))}

                            {/* Static Verified Items */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl text-blue-500"><ShieldCheck /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Verified Income</h4>
                                        <p className="text-xs text-gray-500">{profile.primaryBank || 'Bank Verified'}</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                                    <CheckCircle size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* On-Chain Verification Details */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">On-Chain Verification</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Token Type</span>
                                <span className="font-mono font-medium text-gray-800">Soulbound (ERC-5192)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Network</span>
                                <span className="font-medium text-blue-600 flex items-center gap-1">● Polygon PoS</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Contract</span>
                                <a href="#" className="font-mono text-emerald-600 hover:underline">0x7a3b...8f2d ↗</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
