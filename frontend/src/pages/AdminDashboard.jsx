import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Home, Activity, DollarSign, ArrowLeft } from 'lucide-react';
import { adminService } from '../services/api';
import { useNavigation } from '../context/NavigationContext';

const AdminDashboard = () => {
  const { setCurrentView } = useNavigation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#FAFBFF] pt-28 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <button 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back to Listings
          </button>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Admin <span className="text-blue-600">Dashboard</span></h1>
          <p className="text-slate-500 font-medium mt-2">Platform Overview & Live CRM Statistics</p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={80}/></div>
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Real Profit</h3>
             <p className="text-3xl font-black text-slate-900">₹{stats.total_profit.toLocaleString()}</p>
             <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                <TrendingUp size={14} /> +12.5% from last month
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Home size={80}/></div>
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Properties</h3>
             <p className="text-3xl font-black text-slate-900">{stats.total_pgs}</p>
             <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                <TrendingUp size={14} /> +3 this week
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={80}/></div>
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Users</h3>
             <p className="text-3xl font-black text-slate-900">{stats.total_users}</p>
             <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                <TrendingUp size={14} /> +24 this week
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80}/></div>
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Reviews</h3>
             <p className="text-3xl font-black text-slate-900">{stats.total_reviews}</p>
             <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-500">
                Across all listings
             </div>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent PGs */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Recent Listings</h3>
                <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">View All</button>
             </div>
             <div className="space-y-4">
                {stats.recent_pgs.map(pg => (
                   <div key={pg.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black">
                            {pg.name[0]}
                         </div>
                         <div>
                            <h4 className="text-xs font-black text-slate-900">{pg.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{pg.area}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Active</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">New Users</h3>
                <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">View All</button>
             </div>
             <div className="space-y-4">
                {stats.recent_users.map(user => (
                   <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black">
                            {user.name[0]}
                         </div>
                         <div>
                            <h4 className="text-xs font-black text-slate-900">{user.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{user.email}</p>
                         </div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                         {new Date(user.created_at).toLocaleDateString()}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AdminDashboard;
