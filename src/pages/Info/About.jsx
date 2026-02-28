import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    Bringing <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Financial Respect</span> to Everyone
                </h1>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                    In the traditional banking world, freelancers, gig workers, and creators are often overlooked.
                    Standard credit scores don't account for the dynamic nature of modern income.
                </p>
                <p>
                    <strong>Crediflow</strong> changes that. We use advanced AI to analyze your entire financial picture—not just your salary slip.
                    We believe consistency deserves credit, and financial discipline should be rewarded with digital trust.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-100">
                    <div>
                        <h3 className="text-primary font-bold text-xl mb-2">Trust</h3>
                        <p className="text-sm">Built on transparent algorithms and secure data partnerships.</p>
                    </div>
                    <div>
                        <h3 className="text-secondary font-bold text-xl mb-2">Growth</h3>
                        <p className="text-sm">Empowering you to access better loans and financial products.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
