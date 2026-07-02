import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Rocket, Heart, ShieldCheck, 
  ArrowRight, Users, Award, TrendingUp 
} from 'lucide-react';

const About = ({ onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-[#FAFBFF]"
    >
      {/* Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden bg-white">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-blue-100">
             <Rocket size={14} /> Our Story
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight uppercase mb-8 leading-[0.9] text-slate-900">
             Revolutionizing <br/><span className="text-blue-600">Premium Living.</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-500 font-medium leading-relaxed mb-12">
             Started as a visionary college project to eliminate the exploitation in the housing market, PG Dhundo has rapidly scaled into a sophisticated, nationwide network of verified luxury accommodations.
          </p>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
               <div className="absolute -inset-4 bg-blue-100 rounded-[3rem] blur-2xl opacity-50"></div>
               <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800" className="relative rounded-[3.5rem] border-8 border-white shadow-2xl" alt="Our Journey" />
               <div className="absolute -bottom-10 -right-10 p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 hidden md:block">
                  <h4 className="text-4xl font-black text-blue-600">2026</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Foundation Year</p>
               </div>
            </div>
            <div>
               <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Starting Journey</h2>
               <h3 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-8 leading-tight">Driven by a <span className="text-blue-600">Universal Need.</span></h3>
               <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  The journey began in a small dorm room when our founders realized that finding quality housing was an unnecessarily complex and unsafe process across all major hubs. We saw the lack of standardization and the hidden costs that burdened students and young professionals alike.
               </p>
               <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  By building an end-to-end encrypted ecosystem, we bridged the gap between premium property owners and quality-seeking residents, ensuring every stay is backed by a 100% verification guarantee and zero hidden commissions.
               </p>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 text-blue-600"><Users size={24}/></div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Community First</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1">Built by students, for students.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 text-emerald-600"><ShieldCheck size={24}/></div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Zero Brokerage</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1">Direct communication with owners.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] opacity-10 pointer-events-none">
            <TrendingUp size={600} className="text-blue-500" />
         </div>
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
               <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500 mb-4">Our Mission</h2>
               <h3 className="text-5xl font-black uppercase tracking-tight mb-8">Redefining <span className="text-blue-500">Quality of Life.</span></h3>
               <p className="max-w-2xl mx-auto text-slate-400 text-lg">Our mission is to create a digital ecosystem where finding a home is as easy as booking a hotel, with safety and quality guaranteed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                  { icon: <Target size={32}/>, title: "Precision Search", desc: "Helping you find the exact match for your lifestyle." },
                  { icon: <Heart size={32}/>, title: "Human Centric", desc: "We prioritize your comfort and safety over numbers." },
                  { icon: <Award size={32}/>, title: "Elite Standards", desc: "Only the top 5% of properties make it to our network." }
               ].map((m, i) => (
                  <div key={i} className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center">
                     <div className="mb-6 text-blue-500 flex justify-center">{m.icon}</div>
                     <h4 className="text-xl font-black uppercase mb-4 tracking-tight">{m.title}</h4>
                     <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 max-w-7xl mx-auto px-6 text-center">
         <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 mb-10 leading-tight">
           Join the <span className="text-blue-600">Future</span> of Living.
         </h2>
         <button onClick={onBack} className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mx-auto">
            Back to Home <ArrowRight size={20} />
         </button>
      </section>
    </motion.div>
  );
};

export default About;
