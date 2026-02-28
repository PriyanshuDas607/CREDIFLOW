import React from 'react';
import { Sparkles, Check, Zap } from 'lucide-react';

const ProUpgradeCard = () => {
    return (
        <div className="relative p-5 rounded-3xl overflow-hidden group shadow-sm border border-emerald-100/50 cursor-pointer transition-all duration-300 hover:shadow-emerald-500/10">
            {/* Soft Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 opacity-90"></div>

            {/* Glossy Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-gray-800 text-[15px] tracking-wide leading-tight">
                            CrediFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">PRO</span>
                        </h4>
                        <span className="text-[10px] text-emerald-600/80 font-bold uppercase tracking-widest block">India Exclusive</span>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5 mb-5">
                    <div className="flex justify-start items-center gap-2 text-xs text-gray-600 font-medium">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Check size={10} className="text-emerald-600" />
                        </div>
                        <span>Instant <strong className="text-gray-800">CIBIL</strong> Sync</span>
                    </div>
                    <div className="flex justify-start items-center gap-2 text-xs text-gray-600 font-medium">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Check size={10} className="text-emerald-600" />
                        </div>
                        <span><strong className="text-gray-800">₹0</strong> Processing Fees</span>
                    </div>
                    <div className="flex justify-start items-center gap-2 text-xs text-gray-600 font-medium">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Check size={10} className="text-emerald-600" />
                        </div>
                        <span><strong className="text-gray-800">AI</strong> Priority Approvals</span>
                    </div>
                </div>

                {/* Button */}
                <button className="w-full relative overflow-hidden group/btn rounded-xl">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 group-hover/btn:from-emerald-600 group-hover/btn:to-teal-700 transition-colors duration-300 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-emerald-200">
                        <span className="text-white font-bold text-xs tracking-wider uppercase">Upgrade • ₹99/mo</span>
                        <Zap size={14} className="text-emerald-100 group-hover/btn:animate-pulse transition-colors" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ProUpgradeCard;
