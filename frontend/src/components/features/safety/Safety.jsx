import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Lock, Bell, UserCheck, 
  ShieldAlert, Sparkles, CheckCircle2
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const Safety = ({ onBack }) => {
  const { addToast } = useToast();
  const safetyFeatures = [
    {
      icon: <ShieldCheck className="text-blue-500" size={32} />,
      title: "100% Verified Owners",
      desc: "Every property owner goes through a strict KYC and identification process before listing."
    },
    {
      icon: <Lock className="text-indigo-500" size={32} />,
      title: "Secure Messaging",
      desc: "Your personal details are never shared. Communicate through our encrypted chat system."
    },
    {
      icon: <Bell className="text-rose-500" size={32} />,
      title: "24/7 Rapid Response",
      desc: "Our safety team is on standby 24/7 for any emergencies or resident disputes."
    },
    {
      icon: <UserCheck className="text-emerald-500" size={32} />,
      title: "Biometric Access",
      desc: "Smart locks and biometric entry systems are standard in all our premium properties."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="min-h-screen bg-white"
    >
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950 text-white">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8">
            <Sparkles size={14} /> Resident Protection
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase mb-8 leading-[0.95]">
            Safety <br/><span className="text-blue-500">Without Compromise.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 font-medium leading-relaxed mb-12">
            We've built the most secure ecosystem for bachelors and professionals. From verified owners to 24/7 support, your peace of mind is our priority.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => addToast("The PG Dhundo Resident Safety Manual is being generated for your account. Please check your email or wait for the PDF to prepare.", 'info')}
              className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              Download Safety Manual
            </button>
            <button onClick={onBack} className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Back to Home</button>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {safetyFeatures.map((item, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 hover:border-blue-200 transition-all group">
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-3">{item.title}</h3>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-slate-50 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Our Protocol</h2>
               <h3 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-8 leading-tight">Every Property is <span className="text-blue-600">Triple Checked</span></h3>
               <div className="space-y-6">
                  {[
                    "Verification of Landlord ID & Ownership Documents",
                    "On-site Inspection for Safety & Hygiene Standards",
                    "Digital Footprint & Resident Feedback Audit"
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                       <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-black text-xs">{i+1}</div>
                       <p className="text-slate-600 font-bold uppercase text-xs tracking-wide leading-relaxed pt-1.5">{step}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative">
               <div className="absolute -inset-4 bg-blue-100 rounded-[3rem] blur-2xl"></div>
               <img src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800" className="relative rounded-[3rem] border-8 border-white shadow-2xl" alt="Safety Audit" />
            </div>
         </div>
      </section>

    </motion.div>
  );
};

export default Safety;
