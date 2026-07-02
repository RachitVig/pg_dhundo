import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { pgService } from '../../../services/api';

const OwnerModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    gender_category: 'MIXED',
    price: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await pgService.create({
        name: formData.name,
        area: formData.area,
        gender_category: formData.gender_category.toUpperCase(),
        price: parseFloat(formData.price),
        description: formData.description,
        address: formData.area + ', Chandigarh'
      });
      alert("Property submitted successfully! Our team will visit within 48 hours for KYC.");
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit property.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
       <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 animate-in zoom-in duration-300 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
          <div className="flex justify-between items-center mb-8">
             <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">List Your Property</h2>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Host Registration Portal</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
                <div className="p-3 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100">
                   {error}
                </div>
             )}
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Property Name</label>
                   <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="e.g. Royal Living" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Area / Sector</label>
                   <input required name="area" value={formData.area} onChange={handleChange} type="text" placeholder="e.g. Sector 15" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Gender Category</label>
                   <select name="gender_category" value={formData.gender_category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                      <option value="BOYS">Boys</option>
                      <option value="GIRLS">Girls</option>
                      <option value="MIXED">Mixed / Unisex</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Starting Price (₹)</label>
                   <input required name="price" value={formData.price} onChange={handleChange} type="number" placeholder="8500" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all" />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Property Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Describe the luxury and amenities..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all resize-none"></textarea>
             </div>

             <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex gap-4 items-start">
                <ShieldCheck size={24} className="text-blue-600 shrink-0" />
                <div>
                   <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-tight">Zero Brokerage Policy</h4>
                   <p className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed">By listing, you agree to our direct-to-tenant model. We do not charge any commission from owners or tenants.</p>
                </div>
             </div>

             <button disabled={loading} type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">
                {loading ? 'Submitting...' : 'Submit for Verification'}
             </button>
          </form>
       </div>
    </div>
  );
};

export default OwnerModal;
