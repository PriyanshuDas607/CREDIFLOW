import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, FileText, BarChart2, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProUpgradeCard from '../UI/ProUpgradeCard';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
        { icon: <CreditCard size={20} />, label: "Bank Loans", path: "/loans" },
        { icon: <FileText size={20} />, label: "Enquiries", path: "/enquiries" }, // Placeholder for now
        { icon: <BarChart2 size={20} />, label: "Analytics", path: "/analytics" },
        { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Crediflow</h1>
                    <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Gig Credit Expert</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                ? "bg-emerald-50 text-emerald-600 shadow-sm"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Pro Feature / Logout */}
            <div className="p-4 mt-auto">
                <ProUpgradeCard />

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all w-full font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
