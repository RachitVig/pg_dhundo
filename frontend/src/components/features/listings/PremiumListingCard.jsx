import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, User, Star, MapPin, Share2, Heart, 
  MessageSquare, ArrowRight 
} from 'lucide-react';

const PremiumListingCard = ({ pg, onOpenChat, onViewDetails }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert(`Property link for "${pg.name}" copied to clipboard!`);
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-slate-200/70 rounded-[3rem] overflow-hidden hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col group mb-12"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="md:w-[40%] shrink-0 relative overflow-hidden bg-slate-100 min-h-[300px] cursor-pointer" onClick={onViewDetails}>
          <img src={pg.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt={pg.name} />
          <div className="absolute top-8 left-8 flex flex-col gap-3">
             <span className="w-fit px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-slate-900/40 border border-white/20 text-white flex items-center gap-2">
               <ShieldCheck size={14} className="text-blue-400" /> Verified Listing
             </span>
             <span className="w-fit px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-white/90 text-slate-900 shadow-xl flex items-center gap-2">
               <User size={14} className="text-blue-600" /> {pg.gender_category}
             </span>
          </div>
          <div className="absolute bottom-8 left-8 right-8">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                   <Star size={16} className="fill-yellow-400 text-yellow-400" />
                   <span className="text-sm font-black">{pg.rating}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowReviews(!showReviews); }} 
                  className="text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors"
                >
                  {pg.reviews.length} Reports
                </button>
             </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-10 flex-1 flex flex-col">
           <div className="flex justify-between items-start mb-6">
              <div className="cursor-pointer" onClick={onViewDetails}>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors mb-2">{pg.name}</h3>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <MapPin size={14} className="text-blue-600" /> {pg.address}
                 </div>
              </div>
              <div className="flex md:flex-col gap-2">
                 <button 
                  onClick={handleShare}
                  className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
                  title="Share Property"
                 >
                   <Share2 size={18}/>
                 </button>
                 <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-2xl transition-all border ${isLiked ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-rose-50 hover:text-rose-600'}`}
                  title="Save to Favourites"
                 >
                   <Heart size={18} className={isLiked ? "fill-rose-600" : ""}/>
                 </button>
              </div>
           </div>

           <div className="flex flex-wrap gap-2 mb-10">
              {pg.amenities.slice(0, 4).map(a => (
                 <span key={a} className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase border border-slate-100 tracking-widest flex items-center gap-1.5 transition-all">
                   <div className="w-1 h-1 rounded-full bg-blue-600"></div> {a}
                 </span>
              ))}
              {pg.amenities.length > 4 && (
                 <span className="px-4 py-2 bg-blue-50/50 text-blue-600 rounded-xl text-[9px] font-black uppercase border border-blue-100 tracking-widest">+{pg.amenities.length - 4} more</span>
              )}
           </div>

           {/* Room Comparison Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {pg.room_options.map((room, idx) => (
                 <div key={idx} className="relative p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group/room hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-500">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{room.room_type} Room</span>
                       {(room.occupied_beds < room.total_beds) ? (
                         <span className="flex items-center gap-1 text-[8px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                           Available
                         </span>
                       ) : (
                         <span className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-md">
                           Filled
                         </span>
                       )}
                    </div>
                    <div className="text-2xl font-black text-slate-900 tracking-tighter">₹{room.price.toLocaleString()}</div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inclusive of Utilities</p>
                 </div>
              ))}
           </div>

           <div className="mt-auto flex gap-3">
              <button 
                onClick={onOpenChat}
                className="flex-1 py-5 bg-slate-900 text-white font-black rounded-[1.5rem] text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                 <MessageSquare size={18} /> Chat Owner
              </button>
              <button 
                onClick={onViewDetails}
                className="flex-[1.5] py-5 bg-blue-600 text-white font-black rounded-[1.5rem] text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 group"
              >
                 View Detailed Info <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showReviews && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
          >
             <div className="p-10 space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Trust Reports & Feedback</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {pg.reviews.map((r, i) => (
                     <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xs font-black text-slate-900 border border-slate-200">{r.user_name[0]}</div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{r.user_name}</span>
                              <div className="flex gap-0.5">
                                 {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= (r.food_rating + r.room_rating)/2 ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />)}
                              </div>
                           </div>
                           <p className="text-[12px] text-slate-500 font-medium italic leading-relaxed">"{r.comment}"</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PremiumListingCard;
