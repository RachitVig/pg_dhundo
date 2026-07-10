import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, Home, Activity, DollarSign, ArrowLeft,
  Shield, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  MapPin, Phone, Tag, Star, User, Building2, Eye
} from 'lucide-react';
import { adminService, pgService } from '../services/api';
import { useNavigation } from '../context/NavigationContext';
import { useToast } from '../context/ToastContext';

const ADMIN_TABS = ['Overview', 'Pending Approvals', 'All Properties', 'All Users'];

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-4 opacity-5`}><Icon size={90} /></div>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${color}`}>{label}</p>
    <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
    {sub && <p className="text-[10px] font-bold text-slate-400 mt-3">{sub}</p>}
  </div>
);

const PropertyDetailCard = ({ pg, onApprove, onReject, isPending }) => {
  const [expanded, setExpanded] = useState(false);
  const rooms = pg.rooms || [];
  const minPrice = rooms.length ? Math.min(...rooms.map(r => r.price)) : 'N/A';

  return (
    <motion.div
      layout
      className={`rounded-3xl border-2 overflow-hidden transition-all ${
        isPending ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 bg-white'
      }`}
    >
      {/* Header row */}
      <div className="p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
            isPending ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {pg.name[0]}
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm">{pg.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <MapPin size={11}/> {pg.area}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                pg.gender_category === 'BOYS' ? 'bg-blue-50 text-blue-600' :
                pg.gender_category === 'GIRLS' ? 'bg-pink-50 text-pink-600' :
                'bg-purple-50 text-purple-600'
              }`}>{pg.gender_category}</span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                pg.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                pg.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                'bg-amber-50 text-amber-600'
              }`}>{pg.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isPending && (
            <>
              <button
                onClick={() => onApprove(pg.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl transition-colors"
              >
                <CheckCircle size={13}/> Approve
              </button>
              <button
                onClick={() => onReject(pg.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase rounded-xl transition-colors"
              >
                <XCircle size={13}/> Reject
              </button>
            </>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Info */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Property Details</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="text-slate-400 mt-0.5 shrink-0"/>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Address</p>
                      <p className="text-xs font-bold text-slate-700">{pg.address || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Tag size={14} className="text-slate-400 mt-0.5 shrink-0"/>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Starting Price</p>
                      <p className="text-xs font-bold text-slate-700">₹{minPrice}/month</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star size={14} className="text-slate-400 mt-0.5 shrink-0"/>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Rating</p>
                      <p className="text-xs font-bold text-slate-700">{pg.rating} ★</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="text-slate-400 mt-0.5 shrink-0"/>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Owner Phone</p>
                      <p className="text-xs font-bold text-slate-700">{pg.owner_phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Description & Amenities */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description & Amenities</h4>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">{pg.description || 'No description provided.'}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(pg.amenities || '').split(',').map((a, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg">{a.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Rooms */}
            {rooms.length > 0 && (
              <div className="border-t border-slate-100 px-6 pb-5 pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Room Types</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {rooms.map(room => (
                    <div key={room.id} className="p-3 bg-slate-50 rounded-2xl text-center">
                      <p className="text-[10px] font-black uppercase text-slate-400">{room.room_type}</p>
                      <p className="font-black text-slate-900 text-sm mt-1">₹{room.price}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{room.occupied_beds}/{room.total_beds} occupied</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { setCurrentView } = useNavigation();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [allPgs, setAllPgs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  const pendingPgs = allPgs.filter(p => p.status === 'PENDING');
  const approvedPgs = allPgs.filter(p => p.status === 'APPROVED');

  const fetchData = async () => {
    try {
      const [statsRes, pgsRes, usersRes] = await Promise.all([
        adminService.getDashboardStats(),
        pgService.getAll_admin(),
        adminService.getAllUsers(),
      ]);
      setStats(statsRes.data);
      setAllPgs(pgsRes.data);
      setAllUsers(usersRes.data);
    } catch (error) {
      console.error('Admin data fetch failed:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePgStatus = async (pgId, status) => {
    try {
      await pgService.updateStatus(pgId, status);
      setAllPgs(prev => prev.map(p => p.id === pgId ? { ...p, status } : p));
      showToast(status === 'APPROVED' ? '✅ Property Approved & is now Live!' : '❌ Property Rejected.');
    } catch {
      showToast('Failed to update property status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
        <p className="text-sm font-black uppercase text-slate-400">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors mb-3"
            >
              <ArrowLeft size={14}/> Back to Listings
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Shield size={22} className="text-white"/>
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Admin <span className="text-blue-600">Portal</span></h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Full Platform Control</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {ADMIN_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}
            >
              {tab}
              {tab === 'Pending Approvals' && pendingPgs.length > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingPgs.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ===== TAB: OVERVIEW ===== */}
        {activeTab === 'Overview' && stats && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <StatCard icon={DollarSign} label="Platform Revenue" value={`₹${stats.total_profit.toLocaleString()}`} color="text-emerald-600" sub="Based on occupied beds" />
              <StatCard icon={Home} label="Total Properties" value={stats.total_pgs} color="text-blue-600" sub={`${pendingPgs.length} awaiting approval`} />
              <StatCard icon={Users} label="Registered Users" value={stats.total_users} color="text-purple-600" sub="All time" />
              <StatCard icon={Activity} label="Total Reviews" value={stats.total_reviews} color="text-rose-600" sub="Across all listings" />
            </div>
            {/* Mini pending alert */}
            {pendingPgs.length > 0 && (
              <div
                onClick={() => setActiveTab('Pending Approvals')}
                className="cursor-pointer flex items-center gap-4 bg-amber-50 border-2 border-amber-200 rounded-3xl px-6 py-4 hover:bg-amber-100 transition-colors"
              >
                <Clock size={22} className="text-amber-500 shrink-0"/>
                <div>
                  <p className="font-black text-amber-700 text-sm">{pendingPgs.length} Propert{pendingPgs.length > 1 ? 'ies' : 'y'} Awaiting Approval</p>
                  <p className="text-[11px] text-amber-600 font-bold">Click to review → Pending Approvals tab</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ===== TAB: PENDING APPROVALS ===== */}
        {activeTab === 'Pending Approvals' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {pendingPgs.length === 0 ? (
              <div className="text-center py-20">
                <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4"/>
                <p className="font-black text-slate-500 uppercase text-sm">All caught up!</p>
                <p className="text-slate-400 text-xs font-bold mt-1">No properties pending approval.</p>
              </div>
            ) : (
              pendingPgs.map(pg => (
                <PropertyDetailCard
                  key={pg.id}
                  pg={pg}
                  isPending={true}
                  onApprove={(id) => handlePgStatus(id, 'APPROVED')}
                  onReject={(id) => handlePgStatus(id, 'REJECTED')}
                />
              ))
            )}
          </motion.div>
        )}

        {/* ===== TAB: ALL PROPERTIES ===== */}
        {activeTab === 'All Properties' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1.5 bg-blue-50 rounded-xl text-[10px] font-black text-blue-600 uppercase">{approvedPgs.length} Approved</div>
              <div className="px-3 py-1.5 bg-amber-50 rounded-xl text-[10px] font-black text-amber-600 uppercase">{pendingPgs.length} Pending</div>
              <div className="px-3 py-1.5 bg-red-50 rounded-xl text-[10px] font-black text-red-600 uppercase">{allPgs.filter(p => p.status === 'REJECTED').length} Rejected</div>
            </div>
            {allPgs.map(pg => (
              <PropertyDetailCard
                key={pg.id}
                pg={pg}
                isPending={pg.status === 'PENDING'}
                onApprove={(id) => handlePgStatus(id, 'APPROVED')}
                onReject={(id) => handlePgStatus(id, 'REJECTED')}
              />
            ))}
          </motion.div>
        )}

        {/* ===== TAB: ALL USERS ===== */}
        {activeTab === 'All Users' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-slate-900 uppercase tracking-tight">All Registered Users</h3>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl">{allUsers.length} total</span>
              </div>
              <div className="divide-y divide-slate-50">
                {allUsers.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 font-bold text-sm">No users registered yet.</div>
                ) : (
                  allUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{user.name}</p>
                          <p className="text-[11px] font-bold text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-slate-400">Joined</p>
                        <p className="text-xs font-bold text-slate-600">{user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
