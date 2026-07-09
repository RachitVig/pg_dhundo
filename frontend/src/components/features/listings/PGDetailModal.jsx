import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Star, ShieldCheck, User, 
  MessageSquare, ArrowRight, CheckCircle2,
  Coffee, Wifi, Tv, Wind, Zap, Lock
} from 'lucide-react';
import SmartMap from '../../shared/SmartMap';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { pgService } from '../../../services/api';

const PGDetailModal = ({ isOpen, onClose, pg, onOpenChat }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { currentUser } = useAuth();
  const { addToast } = useToast();

  if (!isOpen || !pg) return null;

  const handleBook = async () => {
    if (!currentUser) {
      addToast("Please sign in to book this PG.", "error");
      return;
    }
    setIsBooking(true);
    try {
      const defaultRoomType = pg.rooms?.[0]?.room_type || "SINGLE";
      await pgService.book(pg.id, {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || "9999999999",
        room_type: defaultRoomType
      });
      setBookingSuccess(true);
      addToast("Booking inquiry sent successfully!", "success");
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to submit booking inquiry.", "error");
    } finally {
      setIsBooking(false);
    }
  };

  const handleClose = () => {
    setBookingSuccess(false);
    onClose();
  };

  const amenitiesWithIcons = [
    { name: 'WiFi', icon: <Wifi size={18} /> },
    { name: 'AC', icon: <Wind size={18} /> },
    { name: 'Laundry', icon: <Zap size={18} /> },
    { name: 'Food', icon: <Coffee size={18} /> },
    { name: 'CCTV', icon: <Lock size={18} /> },
    { name: 'TV', icon: <Tv size={18} /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-colors z-50 text-white md:text-slate-400 md:bg-slate-100 md:hover:bg-slate-200"
          >
            <X size={24} />
          </button>

          {/* Left: Image Gallery */}
          <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden bg-slate-900">
             <img src={pg.images[0]} className="w-full h-full object-cover" alt={pg.name} />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
             <div className="absolute bottom-10 left-10 text-white">
                <div className="flex items-center gap-2 mb-4">
                   <span className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-blue-600 shadow-xl flex items-center gap-2">
                     <ShieldCheck size={14} /> Verified Property
                   </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">{pg.name}</h1>
                <p className="flex items-center gap-2 text-sm font-bold mt-2 opacity-80 uppercase tracking-widest"><MapPin size={16} className="text-blue-400"/> {pg.address}</p>
             </div>
          </div>

          {/* Right: Details Container */}
          <div className="flex-1 overflow-y-auto no-scrollbar bg-white p-8 md:p-14">
             {bookingSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                   <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-100/50">
                      <CheckCircle2 size={48} />
                   </div>
                   <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-4">Booking Inquiry Sent</h2>
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-md mx-auto mb-6">
                      Priority Booking Secured. The owner has received an email and will contact you shortly.
                   </p>
                   <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 inline-flex items-center gap-3 mb-10">
                      <ShieldCheck size={20} className="text-blue-600" />
                      <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest text-left">
                        Payments will be processed securely<br/>after physical verification.
                      </span>
                   </div>
                   <button 
                     onClick={handleClose}
                     className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl"
                   >
                      Back to Listings
                   </button>
                </div>
             ) : (
                <>
                   {/* Ratings & Tags */}
                   <div className="flex flex-wrap items-center gap-6 mb-12">
                      <div className="flex items-center gap-2">
                         <Star size={20} className="fill-yellow-400 text-yellow-400" />
                         <span className="text-xl font-black">{pg.rating}</span>
                         <span className="text-slate-400 text-xs font-bold uppercase">/ 5.0 Rating</span>
                      </div>
                      <div className="w-px h-8 bg-slate-100 hidden md:block"></div>
                      <div className="flex items-center gap-2">
                         <User size={20} className="text-blue-600" />
                         <span className="text-xs font-black uppercase tracking-widest text-slate-900">{pg.gender_category} Accommodation</span>
                      </div>
                   </div>

                   {/* Description */}
                   <div className="mb-12">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Overview</h3>
                      <p className="text-slate-500 font-medium leading-relaxed text-lg">
                         Experience luxury living at {pg.name}. Located in the heart of {pg.area}, this property offers 
                         premium suites with all inclusive utilities. Perfect for students and working professionals 
                         who seek comfort and a vibrant community.
                      </p>
                   </div>

                   {/* Amenities Grid */}
                   <div className="mb-12">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6">World Class Amenities</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                         {amenitiesWithIcons.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                               <div className="text-blue-600">{item.icon}</div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{item.name}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Room Options */}
                   <div className="mb-12">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6">Available Configurations</h3>
                      <div className="space-y-4">
                         {pg.room_options.map((room, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                               <div>
                                  <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight">{room.room_type} Sharing</h4>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                     {room.occupied_beds < room.total_beds ? `${room.total_beds - room.occupied_beds} Beds Available` : 'Fully Occupied'}
                                  </p>
                               </div>
                               <div className="text-right">
                                  <span className="text-2xl font-black text-slate-900">₹{room.price.toLocaleString()}</span>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Per Month</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Map Location */}
                   <div className="mb-12">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6">Exact Location</h3>
                      <div className="h-64 rounded-[2rem] overflow-hidden border border-slate-100 relative group">
                         <SmartMap pgs={[pg]} center={[pg.lat, pg.lng]} radius={1} />
                      </div>
                   </div>

                   {/* Footer Actions */}
                   <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t border-slate-100 flex gap-4">
                      <button 
                        onClick={() => { onOpenChat(); handleClose(); }}
                        className="flex-1 py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl active:scale-95"
                      >
                         <MessageSquare size={18} /> Chat Owner
                      </button>
                      <button 
                        onClick={handleBook}
                        disabled={isBooking}
                        className="flex-[1.5] py-5 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95 group"
                      >
                         {isBooking ? (
                           <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                         ) : (
                           <>Book This PG <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                         )}
                      </button>
                   </div>
                </>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PGDetailModal;
