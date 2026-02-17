import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Search, 
  LogOut, 
  TrendingUp,
  AlertTriangle,
  Eye,
  MoreVertical
} from 'lucide-react';

interface Request {
  id: string;
  user: string;
  phone: string;
  amount: number;
  tid: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'banned';
  plan: 'free' | 'pro';
  joined: string;
}

// Mock Data
const INITIAL_REQUESTS: Request[] = [
  { id: 'REQ-001', user: 'Ahmed Ali', phone: '01012345678', amount: 500, tid: 'TRX-998877', date: '2024-02-20', status: 'pending' },
  { id: 'REQ-002', user: 'Sara Hassan', phone: '01298765432', amount: 500, tid: 'TRX-112233', date: '2024-02-21', status: 'pending' },
  { id: 'REQ-003', user: 'Mohamed Salah', phone: '01122334455', amount: 500, tid: 'TRX-554433', date: '2024-02-19', status: 'rejected' },
  { id: 'REQ-004', user: 'Gamal Ezz', phone: '01555667788', amount: 500, tid: 'TRX-776655', date: '2024-02-18', status: 'approved' },
];

const INITIAL_USERS: UserData[] = [
  { id: 'USR-001', name: 'Ahmed Ali', email: 'ahmed@gmail.com', status: 'active', plan: 'free', joined: '2024-01-10' },
  { id: 'USR-002', name: 'Sara Hassan', email: 'sara@yahoo.com', status: 'active', plan: 'free', joined: '2024-01-15' },
  { id: 'USR-003', name: 'Scammer Guy', email: 'hack@fraud.com', status: 'banned', plan: 'free', joined: '2024-02-01' },
  { id: 'USR-004', name: 'Gamal Ezz', email: 'gamal@work.com', status: 'active', plan: 'pro', joined: '2023-12-05' },
];

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'users'>('overview');
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const revenue = requests.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  // Handlers
  const handleApprove = (id: string, userName: string) => {
    // 1. Update Request Status
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    // 2. Upgrade User (Mock logic: find user by name fuzzy match or just simulate)
    setUsers(prev => prev.map(u => u.name === userName ? { ...u, plan: 'pro' } : u));
    alert(`Transaction ${id} Approved. ${userName} is now PRO.`);
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const handleBanUser = (id: string) => {
    if(window.confirm("Are you sure you want to BAN this user? They will lose access immediately.")) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'banned' } : u));
    }
  };

  const handleUnbanUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                ADMIN <span className="text-slate-500">PANEL</span>
            </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <SidebarItem 
                icon={<LayoutDashboard size={18} />} 
                label="Overview" 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')} 
            />
            <SidebarItem 
                icon={<CreditCard size={18} />} 
                label="Payment Requests" 
                active={activeTab === 'payments'} 
                onClick={() => setActiveTab('payments')} 
                badge={pendingCount > 0 ? pendingCount : undefined}
            />
            <SidebarItem 
                icon={<Users size={18} />} 
                label="User Management" 
                active={activeTab === 'users'} 
                onClick={() => setActiveTab('users')} 
            />
        </nav>

        <div className="p-4 border-t border-slate-800">
            <button 
                onClick={onLogout}
                className="flex items-center gap-3 text-slate-400 hover:text-white w-full px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors"
            >
                <LogOut size={18} />
                <span>Logout Securely</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
                {activeTab === 'overview' && 'System Overview'}
                {activeTab === 'payments' && 'Payment Verification'}
                {activeTab === 'users' && 'User Database'}
            </h1>
            <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-mono">SERVER: ONLINE • LATENCY: 24ms</span>
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white border-2 border-slate-800">
                    AD
                </div>
            </div>
        </div>

        {/* Content Views */}
        {activeTab === 'overview' && (
            <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title="Total Revenue (EGP)" 
                        value={`${revenue.toLocaleString()} EGP`} 
                        icon={<TrendingUp className="text-green-400" />} 
                        trend="+12% this week"
                    />
                    <StatCard 
                        title="Pending Requests" 
                        value={pendingCount.toString()} 
                        icon={<AlertTriangle className="text-yellow-400" />} 
                        highlight={pendingCount > 0}
                    />
                    <StatCard 
                        title="Active Users" 
                        value={activeUsers.toString()} 
                        icon={<Users className="text-indigo-400" />} 
                    />
                </div>

                {/* Recent Activity Mini Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Recent System Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg"><CheckCircle size={16} /></div>
                                <span className="text-sm text-slate-300">System generated backup successfully</span>
                            </div>
                            <span className="text-xs text-slate-500">2 mins ago</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><Users size={16} /></div>
                                <span className="text-sm text-slate-300">New user registration: Mostafa123</span>
                            </div>
                            <span className="text-xs text-slate-500">15 mins ago</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'payments' && (
            <div className="space-y-6 animate-[fadeIn_0.3s]">
                {/* Pending Requests */}
                {requests.filter(r => r.status === 'pending').length === 0 ? (
                    <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4 opacity-50" />
                        <h3 className="text-xl text-white font-medium">All Clear!</h3>
                        <p className="text-slate-500">No pending payment verifications.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {requests.filter(r => r.status === 'pending').map(req => (
                            <div key={req.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <CreditCard size={100} />
                                </div>
                                
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-white">{req.user}</h3>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 uppercase">Pending</span>
                                        </div>
                                        <p className="text-sm text-slate-400">{req.phone}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{req.amount} <span className="text-sm text-slate-500">EGP</span></div>
                                        <div className="text-xs text-slate-500 font-mono">{req.date}</div>
                                    </div>
                                </div>

                                <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-slate-800">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-slate-500">Transaction ID:</span>
                                        <span className="font-mono text-indigo-300 font-bold bg-indigo-500/10 px-2 py-1 rounded">{req.tid}</span>
                                    </div>
                                    <button className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                                        <Eye size={14} /> View Receipt Screenshot
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 relative z-10">
                                    <button 
                                        onClick={() => handleReject(req.id)}
                                        className="py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={18} /> Reject
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(req.id, req.user)}
                                        className="py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Approve & Upgrade
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* History */}
                <div className="mt-12">
                    <h3 className="text-lg font-bold text-white mb-4">Transaction History</h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {requests.filter(r => r.status !== 'pending').map(req => (
                                    <tr key={req.id} className="hover:bg-slate-800/50">
                                        <td className="p-4 font-mono text-xs text-slate-500">{req.id}</td>
                                        <td className="p-4 text-white">{req.user}</td>
                                        <td className="p-4 text-slate-300">{req.amount} EGP</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                req.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm">{req.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'users' && (
            <div className="space-y-6 animate-[fadeIn_0.3s]">
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users by name, email or ID..." 
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                        Filter
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="p-5">User Info</th>
                                <th className="p-5">Plan Status</th>
                                <th className="p-5">Account Status</th>
                                <th className="p-5">Joined</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {users.filter(u => 
                                u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                u.email.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map(user => (
                                <tr key={user.id} className={`group transition-colors ${user.status === 'banned' ? 'bg-red-950/10' : 'hover:bg-slate-800/30'}`}>
                                    <td className="p-5">
                                        <div>
                                            <div className="font-bold text-white text-base">{user.name}</div>
                                            <div className="text-slate-500">{user.email}</div>
                                            <div className="text-[10px] text-slate-600 font-mono mt-1">{user.id}</div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        {user.plan === 'pro' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                                                PRO CREATOR
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                                                Free Tier
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        {user.status === 'active' ? (
                                            <span className="text-green-400 flex items-center gap-1.5 font-medium">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div> Active
                                            </span>
                                        ) : (
                                            <span className="text-red-500 flex items-center gap-1.5 font-bold">
                                                <Ban size={14} /> BANNED
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-5 text-slate-500">
                                        {user.joined}
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            {user.status === 'active' ? (
                                                <button 
                                                    onClick={() => handleBanUser(user.id)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-colors" 
                                                    title="Ban User"
                                                >
                                                    <Ban size={16} />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleUnbanUser(user.id)}
                                                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg border border-green-500/20 transition-colors" 
                                                    title="Unban User"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick, badge }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
            active 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-medium' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
    >
        <div className="flex items-center gap-3">
            {icon}
            <span>{label}</span>
        </div>
        {badge && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {badge}
            </span>
        )}
    </button>
);

const StatCard = ({ title, value, icon, trend, highlight }: any) => (
    <div className={`p-6 rounded-2xl border ${highlight ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900 border-slate-800'}`}>
        <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 font-medium text-sm">{title}</div>
            <div className={`p-2 rounded-lg ${highlight ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                {icon}
            </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        {trend && <div className="text-xs text-green-400 font-medium">{trend}</div>}
    </div>
);

export default AdminDashboard;