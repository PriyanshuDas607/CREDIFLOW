import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notificationsOpen, setNotificationsOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState([
        { id: 1, title: "Score Increased", desc: "Your score went up by 12 points!", time: "2h ago", icon: "🚀", read: false },
        { id: 2, title: "Loan Approved", desc: "Your ₹50k loan request is approved.", time: "1d ago", icon: "✅", read: false },
        { id: 3, title: "Bill Reminder", desc: "Electricity bill due in 3 days.", time: "1d ago", icon: "⚡", read: false }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="print:hidden">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="ml-64 print:ml-0 min-h-screen">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-100 h-20 px-8 flex items-center justify-between sticky top-0 z-40 print:hidden">

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search transactions, loans, or reports..."
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6 pl-6">
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative text-gray-500 hover:text-emerald-600 transition"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                                        <h4 className="font-bold text-gray-800 text-sm">Notifications</h4>
                                        {unreadCount > 0 && (
                                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                                        )}
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-gray-400 text-xs">No notifications</div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 transition border-b border-gray-50 last:border-0 cursor-pointer flex gap-3 ${n.read ? 'opacity-60' : ''}`}>
                                                    <div className="text-xl">{n.icon}</div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{n.title}</p>
                                                        <p className="text-xs text-gray-500">{n.desc}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <div className="p-2 border-t border-gray-50 text-center">
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                                            >
                                                Mark all as read
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer group"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition">{user?.name || "User"}</p>
                                <p className="text-xs text-gray-500">Freelancer</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-600 overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={20} />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
