import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckCircle2, Clock, Mail, Phone, Calendar,
  ClipboardList, Home, ArrowLeft, X, Building2, AlertCircle, Send
} from 'lucide-react';
import { bookingService, pgService } from '../services/api';
import { useNavigation } from '../context/NavigationContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const OWNER_TABS = ['My Properties', 'Booking Requests'];

// Confirmation modal for accepting a booking with custom time and message
const ConfirmModal = ({ booking, onClose, onConfirm }) => {
  const [scheduledTime, setScheduledTime] = useState(booking.preferred_time || '');
  const [ownerMessage, setOwnerMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledTime || !ownerMessage) return;
    setLoading(true);
    await onConfirm(booking.id, scheduledTime, ownerMessage);
    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[5000] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase">Confirm Booking</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">for {booking.pg_name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20}/>
          </button>
        </div>

        {/* Visitor Info */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Visitor Details</p>
          <div className="flex items-center gap-2">
            <Mail size={13} className="text-slate-400"/>
            <span className="text-xs font-bold text-slate-700">{booking.user_name} — {booking.user_email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-slate-400"/>
            <span className="text-xs font-bold text-slate-700">{booking.user_phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-slate-400"/>
            <span className="text-xs font-bold text-slate-700">Requested: {booking.preferred_time}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Confirmed Visit Time *
            </label>
            <input
              required
              type="text"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              placeholder="e.g. Tomorrow at 5:00 PM"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Message to Visitor *
            </label>
            <textarea
              required
              rows={4}
              value={ownerMessage}
              onChange={e => setOwnerMessage(e.target.value)}
              placeholder="e.g. Please call when you reach the gate. Parking available. Ask for Rahul at the reception."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
            <Send size={14} className="text-blue-500 shrink-0"/>
            <p className="text-[10px] font-bold text-blue-600">This message + confirmed time will be emailed to the visitor immediately.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Sending...</>
            ) : (
              <><CheckCircle2 size={15}/> Confirm &amp; Send Email</>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const OwnerDashboard = () => {
  const { setCurrentView } = useNavigation();
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('Booking Requests');
  const [bookings, setBookings] = useState([]);
  const [myPgs, setMyPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingBooking, setConfirmingBooking] = useState(null); // booking object to confirm

  // Use owner ID from logged-in user or fallback to 1 for testing
  const OWNER_ID = currentUser?.owner_id || currentUser?.id || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, pgsRes] = await Promise.all([
        bookingService.getOwnerBookings(OWNER_ID),
        pgService.getOwnerPgs(OWNER_ID),
      ]);
      setBookings(bookingsRes.data);
      setMyPgs(pgsRes.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleConfirm = async (bookingId, scheduledTime, ownerMessage) => {
    try {
      await bookingService.verifyBooking(bookingId, { scheduled_time: scheduledTime, owner_message: ownerMessage });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b));
      showToast('✅ Booking confirmed! Email sent to visitor.');
    } catch {
      showToast('Failed to confirm booking.', 'error');
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
        <p className="text-sm font-black uppercase text-slate-400">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {confirmingBooking && (
          <ConfirmModal
            booking={confirmingBooking}
            onClose={() => setConfirmingBooking(null)}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors mb-4"
            >
              <ArrowLeft size={14}/> Back to Listings
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-200">
                <LayoutDashboard size={26} className="text-white"/>
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                  Owner <span className="text-blue-600">Dashboard</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Manage Properties & Booking Requests
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center">
              <p className="text-2xl font-black text-slate-900">{myPgs.length}</p>
              <p className="text-[10px] font-black uppercase text-slate-400 mt-1">My Properties</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center">
              <p className="text-2xl font-black text-amber-600">{pendingBookings.length}</p>
              <p className="text-[10px] font-black uppercase text-amber-500 mt-1">Pending Requests</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center">
              <p className="text-2xl font-black text-emerald-600">{confirmedBookings.length}</p>
              <p className="text-[10px] font-black uppercase text-emerald-500 mt-1">Confirmed</p>
            </div>
          </div>

          {/* Tab Nav */}
          <div className="flex items-center gap-2 mb-6">
            {OWNER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
                }`}
              >
                {tab}
                {tab === 'Booking Requests' && pendingBookings.length > 0 && (
                  <span className="ml-2 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingBookings.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ===== MY PROPERTIES TAB ===== */}
          {activeTab === 'My Properties' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {myPgs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                  <Building2 size={48} className="text-slate-200 mx-auto mb-4"/>
                  <p className="font-black text-slate-400 uppercase text-sm">No Properties Yet</p>
                  <p className="text-slate-300 text-xs font-bold mt-1">Use "Add Property" in the navbar to list your first PG.</p>
                </div>
              ) : (
                myPgs.map(pg => (
                  <div key={pg.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl shrink-0">
                        {pg.name[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-sm">{pg.name}</h3>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">{pg.area} · {pg.gender_category}</p>
                        {pg.rooms?.length > 0 && (
                          <p className="text-[11px] font-bold text-slate-400">Starting ₹{Math.min(...pg.rooms.map(r => r.price))}/mo</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-xl text-[10px] font-black uppercase ${
                        pg.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                        pg.status === 'REJECTED' ? 'bg-red-50 text-red-500' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {pg.status === 'APPROVED' ? '✅ Live' : pg.status === 'REJECTED' ? '❌ Rejected' : '⏳ Pending Review'}
                      </span>
                      {pg.status === 'PENDING' && (
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5">Admin will review shortly</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* ===== BOOKING REQUESTS TAB ===== */}
          {activeTab === 'Booking Requests' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                  <ClipboardList size={48} className="text-slate-200 mx-auto mb-4"/>
                  <p className="font-black text-slate-400 uppercase text-sm">No Booking Requests Yet</p>
                  <p className="text-slate-300 text-xs font-bold mt-1">Requests will appear here when users inquire about your properties.</p>
                </div>
              ) : (
                bookings.map(booking => (
                  <motion.div
                    key={booking.id}
                    layout
                    className={`rounded-3xl border-2 overflow-hidden transition-colors ${
                      booking.status === 'CONFIRMED'
                        ? 'border-emerald-100 bg-emerald-50/20'
                        : 'border-amber-100 bg-white'
                    }`}
                  >
                    <div className="p-6">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Property</p>
                          <h3 className="font-black text-slate-900 text-base mt-0.5">{booking.pg_name}</h3>
                        </div>
                        <span className={`px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase shrink-0 ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {booking.status === 'CONFIRMED' ? '✅ Confirmed' : '⏳ Pending'}
                        </span>
                      </div>

                      {/* Visitor details grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
                          <Mail size={14} className="text-slate-400 shrink-0"/>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Visitor</p>
                            <p className="text-xs font-bold text-slate-800">{booking.user_name}</p>
                            <p className="text-[11px] font-bold text-slate-500">{booking.user_email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
                          <Phone size={14} className="text-slate-400 shrink-0"/>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Phone</p>
                            <p className="text-xs font-bold text-slate-800">{booking.user_phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
                          <Calendar size={14} className="text-slate-400 shrink-0"/>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Preferred Time</p>
                            <p className="text-xs font-bold text-slate-800">{booking.preferred_time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
                          <Clock size={14} className="text-slate-400 shrink-0"/>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Received</p>
                            <p className="text-xs font-bold text-slate-800">
                              {new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="flex items-start gap-3 bg-blue-50/60 border border-blue-100 rounded-2xl px-4 py-3 mb-5">
                        <ClipboardList size={14} className="text-blue-400 mt-0.5 shrink-0"/>
                        <div>
                          <p className="text-[10px] font-black text-blue-500 uppercase mb-1">Visitor Requirements</p>
                          <p className="text-xs font-medium text-slate-700 italic">"{booking.requirements}"</p>
                        </div>
                      </div>

                      {/* Action */}
                      {booking.status === 'PENDING' ? (
                        <button
                          onClick={() => setConfirmingBooking(booking)}
                          className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={15}/> Verify &amp; Confirm Visit
                        </button>
                      ) : (
                        <div className="w-full py-4 bg-emerald-100 text-emerald-700 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                          <CheckCircle2 size={15}/> Visit Confirmed — Email Sent ✓
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
