import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Award, Star, Layers } from 'lucide-react';
import NewArrivalsSlider from '../components/features/listings/NewArrivalsSlider';
import PremiumListingCard from '../components/features/listings/PremiumListingCard';
import SmartMap from '../components/shared/SmartMap';
import { usePGs } from '../context/PGContext';

const Home = ({ setActiveChatPg, onViewDetails }) => {
  const { pgs, loading } = usePGs();

  // Filtering States (Moved from App.jsx)
  const [filterGender, setFilterGender] = useState('All');
  const [filterPrice, setFilterPrice] = useState(20000);
  const [filterRoomType, setFilterRoomType] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [searchArea, setSearchArea] = useState('');

  const scrollToListings = () => {
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredPGs = useMemo(() => {
    let result = pgs.filter(pg => {
      const gMatch = filterGender === 'All' || pg.gender_category === filterGender.toUpperCase();
      const aMatch = pg.area.toLowerCase().includes(searchArea.toLowerCase()) || 
                     pg.name.toLowerCase().includes(searchArea.toLowerCase());
      const pMatch = pg.rooms.some(r => r.price <= filterPrice);
      const rTypeMatch = filterRoomType === 'All' || pg.rooms.some(r => r.room_type === filterRoomType.toUpperCase());
      return gMatch && aMatch && pMatch && rTypeMatch;
    });

    if (sortBy === 'price_low') {
      result.sort((a, b) => Math.min(...a.rooms.map(r => r.price)) - Math.min(...b.rooms.map(r => r.price)));
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => Math.max(...a.rooms.map(r => r.price)) - Math.max(...b.rooms.map(r => r.price)));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [pgs, filterGender, filterPrice, filterRoomType, sortBy, searchArea]);

  const newArrivals = useMemo(() => pgs.slice(0, 5), [pgs]);

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <header className="relative bg-white pt-20 pb-32 overflow-hidden border-b border-slate-100">
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px]"></div>
         <div className="absolute top-1/2 -left-24 w-72 h-72 bg-indigo-100/20 rounded-full blur-[80px]"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 animate-pulse">
                     <TrendingUp size={14} className="text-blue-500" /> Professional Live Chat Enabled
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8 uppercase">
                     Luxury PG Living <br/><span className="text-blue-600">Perfected.</span>
                  </h1>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
                     Sober, professional, and real-time. Connect with property owners instantly via our secure messaging network. No brokerage, just quality living in the finest prime locations.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white border border-slate-200 rounded-[2rem] shadow-2xl shadow-slate-200/50 max-w-xl mb-12">
                     <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:border-blue-500 transition-all">
                        <Search className="text-slate-400" size={20} />
                        <input 
                           type="text" 
                           placeholder="Search by Sector or Area..." 
                           className="w-full bg-transparent border-none text-sm font-bold placeholder:text-slate-300 outline-none"
                           value={searchArea}
                           onChange={(e) => setSearchArea(e.target.value)}
                        />
                     </div>
                     <button onClick={scrollToListings} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Explore</button>
                  </div>

                  <div className="flex items-center gap-8">
                     <div className="flex -space-x-3 overflow-hidden">
                        {[1,2,3,4].map(i => (
                           <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white" src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
                        ))}
                     </div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span className="text-slate-900 font-black">2.5k+</span> Professionals found homes this month
                     </div>
                  </div>
               </div>

               <div className="relative group lg:block hidden">
                  <div className="absolute -inset-4 bg-blue-100/50 rounded-[3rem] blur-2xl group-hover:bg-blue-200/50 transition-all duration-700"></div>
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl scale-100 group-hover:scale-[1.02] transition-all duration-700">
                     <img src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800" alt="Luxury PG Interior" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                     <div className="absolute bottom-10 left-10 p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 text-white">
                        <div className="flex items-center gap-2 mb-2">
                           <Award className="text-yellow-400" size={20} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Prime Location</span>
                        </div>
                        <p className="text-sm font-bold">Premium Suites from ₹12,000</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </header>

      {/* New Arrivals Slider */}
      <NewArrivalsSlider 
        newArrivals={newArrivals} 
        setActiveChatPg={setActiveChatPg} 
        onViewDetails={onViewDetails} 
      />

      {/* Advanced Filters Bar */}
      <section className="bg-white py-8 border-b border-slate-100 sticky top-[73px] z-[1500] shadow-sm">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
               <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Living Category</span>
                  <div className="flex gap-2">
                     {['All', 'Boys', 'Girls', 'Mixed'].map(g => (
                        <button key={g} onClick={() => setFilterGender(g)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterGender === g ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-400'}`}>{g}</button>
                     ))}
                  </div>
               </div>

               <div className="flex-1 min-w-[200px] space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Max Budget</span>
                     <span className="text-sm font-black text-blue-600">₹{filterPrice.toLocaleString()}</span>
                  </div>
                  <input type="range" min="5000" max="20000" step="500" value={filterPrice} onChange={(e) => setFilterPrice(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
               </div>

               <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Room Format</span>
                  <select value={filterRoomType} onChange={(e) => setFilterRoomType(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:border-blue-500">
                     <option value="All">Any Capacity</option>
                     <option value="Single">Single Sharing</option>
                     <option value="Double">Double Sharing</option>
                     <option value="Triple">Triple Sharing</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Sort By</span>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl">
                     <button onClick={() => setSortBy('rating')} className={`p-1.5 rounded-lg transition-colors ${sortBy === 'rating' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`} title="Top Rated"><Star size={18} /></button>
                     <button onClick={() => setSortBy('price_low')} className={`p-1.5 rounded-lg transition-colors ${sortBy === 'price_low' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`} title="Cheapest First"><TrendingUp size={18} /></button>
                     <button onClick={() => setSortBy('price_high')} className={`p-1.5 rounded-lg transition-colors ${sortBy === 'price_high' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`} title="Premium First"><Layers size={18} /></button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Content Area */}
      <main id="listings" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {loading ? (
              <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div></div>
            ) : (
              <div className="space-y-12">
                {filteredPGs.map(pg => (
                  <PremiumListingCard 
                    key={pg.id} 
                    pg={pg} 
                    onOpenChat={() => setActiveChatPg(pg)} 
                    onViewDetails={() => onViewDetails(pg)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-4 space-y-8 sticky top-32 h-fit">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-xl shadow-slate-200/50 overflow-hidden">
                <h3 className="text-sm font-black text-slate-800 uppercase mb-6 tracking-widest underline decoration-blue-500 decoration-4 underline-offset-8">Market Pulse Map</h3>
                <div className="h-64 rounded-3xl overflow-hidden border border-slate-100">
                   {filteredPGs.length > 0 && (
                     <SmartMap pgs={filteredPGs} center={[30.7333, 76.7794]} radius={2} />
                   )}
                </div>
             </div>
             <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-all"><TrendingUp size={100}/></div>
                <h3 className="text-2xl font-black mb-4 uppercase">Sober Deal</h3>
                <p className="text-slate-400 text-xs mb-8">Get 10% off on your first month advance. Use code <span className="text-white font-black">CHAT10</span></p>
                <button onClick={scrollToListings} className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors">Check Active Listings</button>
             </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default Home;
