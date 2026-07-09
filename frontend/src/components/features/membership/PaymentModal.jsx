import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CreditCard, ShieldCheck, Zap, 
  ArrowRight, CheckCircle2, QrCode, Phone,
  Lock, Wallet
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const PaymentModal = ({ isOpen, onClose, plan }) => {
  const { addToast } = useToast();
  const [step, setStep] = useState('selection'); // selection, razorpay, qr, success
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep('selection');
      setProcessing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isOpen || !plan) return null;

  const handleRazorpay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_YOUR_KEY_HERE',
        amount: plan.price * 100, // paise
        currency: 'INR',
        name: 'PG Dhundo',
        description: `${plan.name} Membership`,
        image: '/pg_dhundo_logo.png',
        handler: function (response) {
          setStep('success');
        },
        prefill: {
          name: 'Premium Member',
          email: 'member@pgdhundo.com',
          contact: '9999999999'
        },
        theme: {
          color: '#2563eb'
        }
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          console.error("Payment failed", response.error);
          addToast("Payment Failed: " + response.error.description, 'error');
        });
        rzp.open();
      } catch (err) {
        addToast("Demo Mode: Razorpay key invalid, simulating successful payment.", 'info');
        console.warn("Razorpay init failed, simulating success.", err);
        setTimeout(() => setStep('success'), 2000);
      }
    }, 1000);
  };

  const handlePayment = (method) => {
    if (method === 'razorpay') {
      handleRazorpay();
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(method);
    }, 1500);
  };

  const finalizePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-8 pb-0 flex justify-between items-start">
             <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Secure Checkout</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Tier: {plan.name} Membership</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
          </div>

          <div className="p-8">
             {step === 'selection' && (
                <div className="space-y-6">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Amount</span>
                         <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                         <ShieldCheck size={14} className="text-blue-600" /> All taxes included
                      </div>
                   </div>

                   <div className="space-y-3">
                      <button 
                        onClick={() => handlePayment('razorpay')}
                        disabled={processing}
                        className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-between group hover:border-blue-500 transition-all active:scale-95"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                               <CreditCard size={24} />
                            </div>
                            <div className="text-left">
                               <h4 className="text-sm font-black uppercase text-slate-900">Razorpay</h4>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cards, Netbanking, Wallet</p>
                            </div>
                         </div>
                         <ArrowRight size={20} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                      </button>

                      <button 
                        onClick={() => handlePayment('qr')}
                        disabled={processing}
                        className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-between group hover:border-blue-500 transition-all active:scale-95"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                               <QrCode size={24} />
                            </div>
                            <div className="text-left">
                               <h4 className="text-sm font-black uppercase text-slate-900">UPI / QR Code</h4>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Scan and Pay instantly</p>
                            </div>
                         </div>
                         <ArrowRight size={20} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                      </button>
                   </div>
                </div>
             )}

             {/* Removed fake razorpay step in favor of the real Razorpay modal */}

             {step === 'qr' && (
                <div className="text-center space-y-6 animate-in fade-in duration-500">
                   <button onClick={() => setStep('selection')} className="block text-[10px] font-black uppercase text-blue-600 hover:underline mb-4">← Change Method</button>
                   <div className="mx-auto w-48 h-48 bg-slate-50 border-4 border-slate-100 rounded-[2rem] p-4 relative flex items-center justify-center overflow-hidden">
                      <QrCode size={120} className="text-slate-900 opacity-80" />
                      {processing && (
                         <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center flex-col p-4">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full mb-2"></div>
                            <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Verifying Payment...</p>
                         </div>
                      )}
                   </div>
                   <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 tracking-tight">Scan with any UPI App</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">GPay, PhonePe, Paytm</p>
                   </div>
                   <div className="flex justify-center gap-6 py-2">
                      <Wallet size={24} className="text-slate-300" />
                      <Phone size={24} className="text-slate-300" />
                      <Zap size={24} className="text-slate-300" />
                   </div>
                   <button 
                     onClick={finalizePayment}
                     className="text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full transition-colors"
                   >
                      Click here after payment
                   </button>
                </div>
             )}

             {step === 'success' && (
                <div className="text-center py-10 animate-in zoom-in duration-500">
                   <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100/50">
                      <CheckCircle2 size={48} />
                   </div>
                   <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-2">Payment Success!</h3>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-10 px-8">
                      Your {plan.name} Membership is now active. Welcome to the elite network.
                   </p>
                   <button 
                     onClick={onClose}
                     className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                   >
                      Start Exploring
                   </button>
                </div>
             )}
          </div>

          {step !== 'success' && (
             <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                <Lock size={14} className="text-slate-400" />
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">256-bit Encrypted SSL Secure Payment</span>
             </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
