import React from 'react';
import { ShieldCheck, Share2, Download, Copy, Star, Trophy, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TrustCard = ({ profile }) => {
    const { user } = useAuth();

    // Determine the actual score based on the user's email
    const actualScore = user?.email === 'rk09@gmail.com' ? 823 :
        user?.email === 'priyanshudas270506@gmail.com' ? 0 :
            profile.trustScore;
    return (
        <div className="relative w-full max-w-sm mx-auto group perspective-1000">
            {/* Card Container */}
            <div className="relative bg-slate-900 rounded-3xl p-6 text-white shadow-2xl overflow-hidden border border-slate-700 hover:shadow-emerald-500/20 transition-all duration-500 transform hover:-rotate-1 hover:scale-[1.02]">

                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                            <ShieldCheck size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-wide">CrediFlow</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <CheckCircle size={12} className="text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Verified</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 p-[2px]">
                        <img
                            src={profile.avatar}
                            alt="Profile"
                            className="w-full h-full rounded-2xl bg-slate-800 object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                        <p className="text-sm text-slate-400">{profile.role} • Mumbai</p>
                    </div>
                </div>

                {/* Trust Score Area */}
                <div className="bg-slate-800/50 rounded-2xl p-4 backdrop-blur-sm border border-white/5 mb-6 relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Trust Score</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-white">
                                {user?.email === 'priyanshudas270506@gmail.com' ? 'Data Cannot Fetch' : actualScore}
                            </span>
                            {user?.email !== 'priyanshudas270506@gmail.com' && (
                                <span className="text-sm text-emerald-400 font-semibold mb-1.5 flex items-center">
                                    ▲ +3
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-emerald-400 flex items-center justify-center text-xs font-bold text-white">
                        {user?.email === 'priyanshudas270506@gmail.com' ? '0%' : `${Math.round((actualScore / 1000) * 100)}%`}
                    </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-6 relative z-10">
                    {(profile.badges || []).slice(0, 2).map(badge => (
                        <div key={badge.id} className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2 text-xs">
                            <span>{badge.icon}</span>
                            <span className="text-slate-300 font-medium">{badge.name}</span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-800 pt-4 flex justify-between items-end relative z-10">
                    <div>
                        <p className="text-[10px] text-slate-500">Soulbound Token • Polygon</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">0x7a3b...8f2d</p>
                    </div>
                    <div className="text-[10px] text-slate-400 text-right">
                        <p>Last Updated</p>
                        <p className="text-white">Feb 5, 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustCard;
