import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Calendar, ClipboardList, CheckCircle2 } from 'lucide-react';
import { bookingService } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const BookingModal = ({ isOpen, onClose, pg }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    requirements: '',
    preferred_time: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const { showToast } = useToast();

  if (!isOpen || !pg) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const requestData = {
        pg_id: pg.id,
        ...formData
      };
      await bookingService.createBooking(requestData);
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Failed to submit booking inquiry. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
            >
              <X size={20} />
            </button>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Book a Visit</h2>
            <p className="text-slate-400 font-bold text-sm">Schedule a physical visit for {pg.name}</p>
          </div>

          {status === 'success' ? (
            <div className="p-12 flex flex-col items-center justify-center text-center h-[400px]">
              <CheckCircle2 size={80} className="text-green-500 mb-6" />
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-wide">Request Sent!</h3>
              <p className="text-slate-500 font-medium">
                The owner has been notified via email. You will receive a confirmation soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {status === 'error' && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center">
                  {errorMsg}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400"><User size={18} /></div>
                  <input type="text" name="user_name" required placeholder="Full Name" value={formData.user_name} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-bold" />
                </div>
                
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400"><Mail size={18} /></div>
                  <input type="email" name="user_email" required placeholder="Email Address" value={formData.user_email} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-bold" />
                </div>
                
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400"><Phone size={18} /></div>
                  <input type="tel" name="user_phone" required placeholder="Phone Number" value={formData.user_phone} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-bold" />
                </div>
                
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400"><Calendar size={18} /></div>
                  <input type="text" name="preferred_time" required placeholder="Preferred Date & Time (e.g. Tomorrow 4 PM)" value={formData.preferred_time} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-bold" />
                </div>
                
                <div className="relative">
                  <div className="absolute top-6 -translate-y-1/2 left-4 text-slate-400"><ClipboardList size={18} /></div>
                  <textarea name="requirements" required placeholder="Any specific requirements? (e.g. need parking, moving next week)" value={formData.requirements} onChange={handleChange} rows="3" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-bold resize-none" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[12px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
