import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, CreditCard, Heart, Zap, 
  CheckCircle2, Sparkles, TrendingUp, Star,
  ArrowRight
} from 'lucide-react';
import PaymentModal from './PaymentModal';

const Membership = ({ onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const openCheckout = (plan) => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  const plans = [
    {
      name: "Basic",
      price: "0",
      tagline: "Free Forever",
      features: [
        "Verified Listings Access",
        "Direct Owner Chat",
        "Community Support",
        "Standard Vetting"
      ],
      color: "bg-slate-100",
      textColor: "text-slate-900",
      buttonColor: "bg-slate-900 text-white",
      isPopular: false
    },
    {
      name: "Elite",
      price: "999",
      tagline: "Most Popular",
      features: [
        "Zero Security Deposit",
        "Priority Support (24/7)",
        "Free Moving Service",
        "Premium Event Invites",
        "Identity Protection"
      ],
      color: "bg-blue-600",
      textColor: "text-white",
      buttonColor: "bg-white text-blue-600",
      isPopular: true
    },
    {
      name: "Pro",
      price: "1999",
      tagline: "Complete Protection",
      features: [
        "All Elite Benefits",
        "Rental Insurance Cover",
        "Legal Assistance",
        "Early Access to PGs",
        "VIP Status Badge"
      ],
      color: "bg-slate-900",
      textColor: "text-white",
      buttonColor: "bg-blue-600 text-white",
      isPopular: false
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="min-h-screen bg-[#FAFBFF] pb-20"
    >
      <section className="relative pt-24 pb-40 overflow-hidden bg-white">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-blue-100">
            <Award size={14} /> The Elite Club
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase mb-8 leading-[0.9] text-slate-900">
            Elevate Your <br/><span className="text-blue-600">Living Standard.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed mb-12">
            Unlock exclusive benefits, zero deposit options, and priority support by joining the PG Dhundo membership network. Designed for the modern professional.
          </p>
          <div className="flex justify-center gap-4">
             <button 
               onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
               className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-colors"
             >
               View Plans Below
             </button>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative p-12 rounded-[3.5rem] overflow-hidden flex flex-col transition-all duration-500 ${
                plan.isPopular 
                  ? 'bg-slate-900 text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] scale-105 z-10' 
                  : 'bg-white border border-slate-200 text-slate-900 hover:shadow-2xl'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-10 right-10 bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30 flex items-center gap-1.5">
                  <Star size={12} className="fill-white" /> Popular Choice
                </div>
              )}
              
              <div className="mb-10">
                 <h4 className={`text-xs font-black uppercase tracking-[0.25em] mb-4 ${plan.isPopular ? 'text-blue-400' : 'text-slate-400'}`}>
                    {plan.name} Tier
                 </h4>
                 <div className="flex items-baseline gap-1">
                   <span className="text-6xl font-black tracking-tighter">₹{plan.price}</span>
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.isPopular ? 'opacity-60' : 'text-slate-400'}`}>/ Billing Cycle</span>
                 </div>
                 <p className={`text-[11px] font-black uppercase tracking-widest mt-2 ${plan.isPopular ? 'text-slate-400' : 'text-blue-600'}`}>{plan.tagline}</p>
              </div>

              <div className="space-y-5 mb-14 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.isPopular ? 'bg-white/10' : 'bg-blue-50'}`}>
                       <CheckCircle2 size={12} className={plan.isPopular ? 'text-blue-400' : 'text-blue-600'} />
                    </div>
                    <span className="text-[13px] font-bold tracking-tight opacity-90">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => openCheckout(plan)}
                className={`group w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  plan.isPopular 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/50' 
                    : 'bg-slate-900 text-white hover:bg-black shadow-xl'
                }`}
              >
                Select {plan.name} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        plan={selectedPlan} 
      />

      <section className="max-w-7xl mx-auto px-6 py-20">
         <div className="bg-slate-900 rounded-[4rem] p-16 text-white grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
               <TrendingUp className="mx-auto text-blue-500 mb-6" size={40} />
               <h4 className="text-3xl font-black mb-2">98%</h4>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resident Satisfaction</p>
            </div>
            <div>
               <Zap className="mx-auto text-yellow-400 mb-6" size={40} />
               <h4 className="text-3xl font-black mb-2">15 Min</h4>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Guarantee</p>
            </div>
            <div>
               <Star className="mx-auto text-indigo-400 mb-6" size={40} />
               <h4 className="text-3xl font-black mb-2">5.0k</h4>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Elite Members</p>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

export default Membership;
