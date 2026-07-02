import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, LogIn, Github, Chrome, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        const res = await authService.register(formData);
        setIsRegister(false);
        setError('Account created! Please sign in.');
      } else {
        const res = await authService.login({ email: formData.email, password: formData.password });
        login(res.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[7000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl relative"
        >
          <div className="p-10">
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900">{isRegister ? 'Join Us' : 'Welcome Back'}</h3>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Access the Premium PG Network</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                   <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${error.includes('created') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                      <AlertCircle size={18} />
                      <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                   </div>
                )}
                {isRegister && (
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Full Name</label>
                      <input 
                        required 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all" 
                      />
                   </div>
                )}
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Email Address</label>
                   <div className="relative">
                      <input 
                        required 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email" 
                        placeholder="name@company.com" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all" 
                      />
                      <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Password</label>
                      {!isRegister && <button type="button" className="text-[9px] font-black uppercase text-blue-600 hover:underline">Forgot?</button>}
                   </div>
                   <div className="relative">
                      <input 
                        required 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all" 
                      />
                      <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                   {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : (isRegister ? 'Create Account' : 'Sign In Now')}
                   {!loading && <LogIn size={18} />}
                </button>
             </form>

             <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Or Continue With</span>
                <div className="flex-1 h-px bg-slate-100"></div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button className="py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                   <Chrome size={18} className="text-slate-600" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                </button>
                <button className="py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                   <Github size={18} className="text-slate-600" />
                   <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
                </button>
             </div>

             <p className="mt-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isRegister ? 'Already have an account?' : "Don't have an account?"} {' '}
                <button onClick={() => setIsRegister(!isRegister)} className="text-blue-600 font-black hover:underline">
                   {isRegister ? 'Login' : 'Register'}
                </button>
             </p>
          </div>

          <div className="bg-slate-50 p-6 flex items-center justify-center gap-2">
             <ShieldCheck size={14} className="text-slate-400" />
             <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none">Your data is secured with 256-bit encryption</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
