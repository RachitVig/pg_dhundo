import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, LogIn, Github, Chrome, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

const Signup = () => {
  const { login } = useAuth();
  const { setCurrentView } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await authService.register(formData);
      // After successful registration, show success and maybe redirect to login
      setError('Account created! redirecting to login...');
      setTimeout(() => setCurrentView('login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side: Brand & Value Prop */}
        <div className="hidden lg:block">
           <button 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors mb-12"
           >
              <ArrowLeft size={16} /> Back to Listings
           </button>
           <h1 className="text-6xl font-black text-slate-900 leading-tight uppercase mb-8">
              Join the <br/><span className="text-blue-600">Premium</span> Network.
           </h1>
           <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md mb-12">
              Create an account to access exclusive listings, chat directly with owners, and manage your PG preferences effortlessly.
           </p>
           
           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                 <ShieldCheck className="text-blue-600 mb-4" size={24} />
                 <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-tight">Verified Listings</h4>
                 <p className="text-[10px] font-bold text-slate-400 mt-1">100% physically verified properties.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                 <LogIn className="text-blue-600 mb-4" size={24} />
                 <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-tight">Direct Chat</h4>
                 <p className="text-[10px] font-bold text-slate-400 mt-1">Talk to owners without any broker.</p>
              </div>
           </div>
        </div>

        {/* Right Side: Signup Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-12 border border-slate-100 max-w-md mx-auto lg:mx-0 w-full"
        >
          <div className="mb-10">
             <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900">Create Account</h3>
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Get started with PG DHUNDO</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${error.includes('created') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                   <AlertCircle size={18} />
                   <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </div>
             )}
             
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Full Name</label>
                <div className="relative">
                   <input 
                     required 
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     type="text" 
                     placeholder="John Doe" 
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all" 
                   />
                   <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
             </div>

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
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Password</label>
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
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : 'Create Account'}
                {!loading && <LogIn size={18} />}
             </button>
          </form>

          <div className="my-8 flex items-center gap-4">
             <div className="flex-1 h-px bg-slate-100"></div>
             <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Or Signup With</span>
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
             Already have an account? {' '}
             <button onClick={() => setCurrentView('login')} className="text-blue-600 font-black hover:underline">
                Login
             </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
