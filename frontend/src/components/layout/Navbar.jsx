import React, { useState } from 'react';
import { Globe, Bell, PlusCircle, Zap, ShieldCheck, User, X, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';

const ADMIN_PASSWORD = 'admin123';

// Self-contained Admin Login Modal
const AdminLoginModal = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Try again.');
      setPassword('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Lock size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-sm uppercase tracking-tight">Admin Access</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5 px-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                autoFocus
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-3.5 pr-12 text-sm font-bold outline-none transition-all ${
                  error ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p className="text-[10px] font-bold text-red-500 mt-1.5 px-1">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
          >
            Enter Admin Panel
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-widest">
          Hint: admin123
        </p>
      </motion.div>
    </motion.div>
  );
};

const Navbar = () => {
  const { currentUser, logout, setIsLoginModalOpen } = useAuth();
  const { currentView, setCurrentView, setIsOwnerModalOpen } = useNavigation();
  const { notifications, setNotifications } = useNotifications();
  const { showToast } = useToast();
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleAdminSuccess = () => {
    setIsAdminModalOpen(false);
    setIsProfileOpen(false);
    setCurrentView('admin');
    showToast('Welcome to Admin Panel 🛡️');
  };

  return (
    <>
      <AnimatePresence>
        {isAdminModalOpen && (
          <AdminLoginModal
            onClose={() => setIsAdminModalOpen(false)}
            onSuccess={handleAdminSuccess}
          />
        )}
      </AnimatePresence>

      <nav className="sticky top-0 z-[2000] bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
             <img src="/pg_dhundo_logo.png" alt="PG DHUNDO" className="w-12 h-12 object-contain" />
             <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">PG DHUNDO</h1>
                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-0.5">Premium Living Network</p>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
             <button onClick={() => setCurrentView('home')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentView === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Listings</button>
             <button onClick={() => setCurrentView('safety')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentView === 'safety' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Safety</button>
             <button onClick={() => setCurrentView('membership')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentView === 'membership' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Membership</button>
             <button onClick={() => setCurrentView('about')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentView === 'about' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>About Us</button>
          </div>

          <div className="flex items-center gap-3">
             {currentUser ? (
                <div className="relative">
                   <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black border border-blue-500/20 hover:opacity-90 transition-all shadow-md shadow-blue-100"
                   >
                      {currentUser.name?.[0]?.toUpperCase() || 'U'}
                   </button>
                   <AnimatePresence>
                      {isProfileOpen && (
                         <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-4 w-52 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[3000]"
                         >
                            <div className="p-5 border-b border-slate-50">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Signed in as</p>
                               <p className="text-xs font-black text-slate-900 truncate mt-1">{currentUser.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                            </div>
                            <div className="p-2">
                               <button
                                 onClick={() => { setCurrentView('owner_dashboard'); setIsProfileOpen(false); }}
                                 className="w-full text-left p-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                               >
                                 Owner Dashboard
                               </button>
                               {currentUser?.email === 'admin@pgdhundo.com' && (
                                 <button
                                   onClick={() => { setIsAdminModalOpen(true); setIsProfileOpen(false); }}
                                   className="w-full text-left p-3 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2"
                                 >
                                   <ShieldCheck size={12} /> Admin Panel
                                 </button>
                               )}
                               <button 
                                onClick={() => { logout(); setIsProfileOpen(false); showToast('Signed out successfully'); }}
                                className="w-full text-left p-3 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                               >
                                  Logout
                               </button>
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             ) : (
                <button 
                  onClick={() => setCurrentView('login')}
                  className="hidden sm:flex px-4 py-2 text-[10px] font-black uppercase text-slate-900 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </button>
             )}
             
             <button 
               onClick={() => {
                 if (!currentUser) {
                   showToast('Please sign in to list a property', 'error');
                   setCurrentView('login');
                 } else {
                   setIsOwnerModalOpen(true);
                 }
               }} 
               className="hidden sm:flex px-4 py-2 text-[10px] font-black uppercase text-blue-600 border-2 border-blue-50 bg-blue-50/50 rounded-xl hover:bg-blue-100 transition-colors"
             >
               Add Property
             </button>
             
             {/* Notification Bell */}
             <div className="relative">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`p-2.5 rounded-xl transition-all relative ${isNotificationOpen ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                   <Bell size={20} />
                   {notifications.some(n => n.unread) && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                   )}
                </button>

                <AnimatePresence>
                   {isNotificationOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[3000]"
                      >
                         <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Alert Center</h4>
                            <button 
                              onClick={() => {
                                setNotifications(prev => prev.map(n => ({...n, unread: false})));
                                setIsNotificationOpen(false);
                              }}
                              className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                            >
                              Mark All Read
                            </button>
                         </div>
                         <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                            {notifications.length > 0 ? notifications.map(n => (
                               <div key={n.id} className={`p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors relative group ${n.unread ? 'bg-blue-50/30' : ''}`}>
                                  {n.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                                  <div className="flex gap-4">
                                     <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                                        n.type === 'new' ? 'bg-emerald-100 text-emerald-600' : 
                                        n.type === 'freeing' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                                     }`}>
                                        {n.type === 'new' ? <PlusCircle size={18} /> : 
                                         n.type === 'freeing' ? <Zap size={18} /> : <ShieldCheck size={18} />}
                                     </div>
                                     <div>
                                        <h5 className="text-[11px] font-black uppercase text-slate-900 tracking-tight mb-1">{n.title}</h5>
                                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-2">{n.message}</p>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{n.time}</span>
                                     </div>
                                  </div>
                               </div>
                            )) : (
                               <div className="p-10 text-center">
                                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">No New Alerts</p>
                               </div>
                            )}
                         </div>
                         <button className="w-full py-4 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">View All Notifications</button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>

             <button onClick={() => setCurrentView('membership')} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">Join Now</button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
