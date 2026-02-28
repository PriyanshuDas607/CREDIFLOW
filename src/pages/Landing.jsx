import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowRight, Lock } from 'lucide-react';

const Landing = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [idType, setIdType] = useState('PAN');
    const [idNumber, setIdNumber] = useState('');
    const [pincode, setPincode] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isSignUp) {
                await signup(email, password, name, idType, idNumber, pincode);
            } else {
                await login(email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.message.replace("Firebase: ", ""));
        }
    };

    const scrollToLogin = () => {
        document.getElementById('auth-card').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl w-full">

                {/* Hero Content */}
                <div className="space-y-6">
                    <h1 className="text-5xl font-extrabold leading-tight text-dark">
                        Build Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                            Financial Identity
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-md">
                        The ecosystem that respects your financial reliability. Aggregate data, verify with AI, and grow your Trust Score.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={scrollToLogin}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Get Started <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/how-it-works')}
                            className="px-6 py-3 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors"
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Login/Signup Card */}
                <div id="auth-card" className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full mx-auto transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-50 rounded-full text-primary">
                            <Lock size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isSignUp ? "Create Account" : "Secure Login"}
                        </h2>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Ex: Rajesh Sharma"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {isSignUp && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ID Type</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white"
                                            value={idType}
                                            onChange={(e) => setIdType(e.target.value)}
                                        >
                                            <option value="PAN">PAN Card</option>
                                            <option value="Voter ID">Voter ID</option>
                                            <option value="Ration Card">Ration Card</option>
                                            <option value="Passport">Passport</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
                                        <input
                                            type="text"
                                            placeholder="ABCDE1234F"
                                            maxLength="10"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition uppercase"
                                            value={idNumber}
                                            onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="tel"
                                        placeholder="Ex: 400001"
                                        maxLength="6"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@company.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                    required
                                />
                            </div>
                        )}

                        <button type="submit" className="w-full py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5">
                            {isSignUp ? "Create Account" : "Access Dashboard"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        {isSignUp ? "Already have an account?" : "New here?"}
                        <span
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-primary font-semibold cursor-pointer hover:underline ml-1 select-none"
                        >
                            {isSignUp ? "Login" : "Create an account"}
                        </span>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Landing;
