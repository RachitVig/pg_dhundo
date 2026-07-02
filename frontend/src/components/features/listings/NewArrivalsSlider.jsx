import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, Star } from 'lucide-react';

const NewArrivalsSlider = ({ newArrivals, setActiveChatPg, onViewDetails }) => {
  return (
    <section className="bg-white py-12 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Exclusive Discovery</h2>
              <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900">New Arrivals</h3>
           </div>
           <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"><ArrowRight size={20} className="rotate-180" /></div>
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"><ArrowRight size={20} /></div>
           </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory">
           {newArrivals.map((pg) => (
              <motion.div 
                key={pg.id}
                whileHover={{ y: -8 }}
                className="min-w-[320px] md:min-w-[400px] bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 snap-start group relative shadow-sm hover:shadow-xl transition-all duration-500"
              >
                 <div className="h-48 relative overflow-hidden cursor-pointer" onClick={() => onViewDetails(pg)}>
                    <img src={pg.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={pg.name} />
                    <div className="absolute top-4 left-4">
                       <span className="px-3 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-1.5">
                          <Sparkles size={12} /> Just Added
                       </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                       <div>
                          <h4 className="text-lg font-black uppercase tracking-tight leading-none">{pg.name}</h4>
                          <p className="text-[10px] font-bold text-slate-200 mt-1 uppercase tracking-wide flex items-center gap-1"><MapPin size={10}/> {pg.area}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">From</p>
                          <p className="text-xl font-black leading-none">₹{pg.rooms[0].price}</p>
                       </div>
                    </div>
                 </div>
                 <div className="p-6 flex justify-between items-center bg-white">
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= pg.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />)}
                    </div>
                    <button 
                      onClick={() => onViewDetails(pg)}
                      className="px-5 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
                    >
                      View Details
                    </button>
                 </div>
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSlider;
