import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogOut, Calculator, User, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center text-white">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="bg-gradient-to-r from-secondary to-primary text-transparent bg-clip-text">
                        TrustFlow
                    </span>
                </Link>

                <div className="flex gap-6 items-center">
                    <Link to="/" className="text-gray-600 hover:text-primary font-medium transition hidden md:block">Home</Link>

                    {user && (
                        <>
                            <Link to="/simulator" className="text-gray-600 hover:text-primary font-medium transition flex items-center gap-1">
                                <Calculator size={16} /> Simulator
                            </Link>
                            <Link to="/loans" className="text-gray-600 hover:text-primary font-medium transition hidden md:block">My Loans</Link>
                        </>
                    )}

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 pl-4 border-l border-gray-200 focus:outline-none"
                            >
                                <div className="text-right hidden md:block">
                                    <span className="block text-sm font-semibold text-gray-800 leading-tight">{user.name}</span>
                                    <span className="block text-xs text-primary font-medium">Score: 745</span>
                                </div>
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-gray-600">
                                    <User size={18} />
                                </div>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 transition" onClick={() => setDropdownOpen(false)}>
                                        <User size={16} /> My Profile
                                    </Link>
                                    <Link to="/bank-details" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 transition" onClick={() => setDropdownOpen(false)}>
                                        <ShieldCheck size={16} /> Bank Accounts
                                    </Link>
                                    <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 transition" onClick={() => setDropdownOpen(false)}>
                                        <Settings size={16} /> Settings
                                    </Link>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/" className="bg-primary text-white px-5 py-2 rounded-lg font-semibold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
