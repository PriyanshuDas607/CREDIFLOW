import React from 'react';
import { Database, ShieldCheck, Award } from 'lucide-react';

const HowItWorks = () => {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Crediflow</span> Process
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto mb-16">
                We turn your financial behavior into a verifiable digital identity in three simple steps.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                    { icon: Database, title: "Data Aggregation", desc: "Securely link your bank accounts. We fetch your transaction history with read-only access (Account Aggregator)." },
                    { icon: ShieldCheck, title: "AI Verification", desc: "Our advanced Gemini-powered AI analyzes your income consistency, repayment habits, and financial discipline." },
                    { icon: Award, title: "Score Generation", desc: "Receive your Trust Score and mint it as a Soulbound Token (SBT) for portable, tamper-proof financial reputation." }
                ].map((step, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition duration-300">
                        <div className="w-16 h-16 bg-slate-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                            <step.icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;
