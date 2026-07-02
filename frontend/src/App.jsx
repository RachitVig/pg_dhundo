import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Layout & UI Components
import Navbar from './components/layout/Navbar';
import OwnerModal from './components/features/listings/OwnerModal';
import LoginModal from './components/features/auth/LoginModal';
import ChatOverlay from './components/features/chat/ChatOverlay';
import PGDetailModal from './components/features/listings/PGDetailModal';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import Safety from './components/features/safety/Safety';
import Membership from './components/features/membership/Membership';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { PGProvider, usePGs } from './context/PGContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { NotificationProvider } from './context/NotificationContext';

// Services constants
import { API_BASE, WS_BASE } from './services/api';

function AppContent() {
  const { pgs, loading } = usePGs();
  const { currentView, setCurrentView, isOwnerModalOpen, setIsOwnerModalOpen } = useNavigation();
  const { isLoginModalOpen, setIsLoginModalOpen } = useAuth();
  
  const [activeChatPg, setActiveChatPg] = useState(null);
  const [selectedPgDetails, setSelectedPgDetails] = useState(null);
  const [clientId] = useState(`User_${Math.floor(Math.random() * 1000)}`);

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-slate-900 selection:bg-blue-100 font-inter">
      <Navbar />

      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <Home 
            setActiveChatPg={setActiveChatPg}
            onViewDetails={(pg) => setSelectedPgDetails(pg)}
          />
        )}
        {currentView === 'about' && (
          <About onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'safety' && (
          <Safety onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'membership' && (
          <Membership onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'login' && (
          <Login />
        )}
        {currentView === 'signup' && (
          <Signup />
        )}
        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </AnimatePresence>

      <ChatOverlay 
        activeChatPg={activeChatPg} 
        setActiveChatPg={setActiveChatPg} 
        clientId={clientId}
        API_BASE={API_BASE}
        WS_BASE={WS_BASE}
      />

      <PGDetailModal 
        isOpen={!!selectedPgDetails}
        onClose={() => setSelectedPgDetails(null)}
        pg={selectedPgDetails}
        onOpenChat={() => setActiveChatPg(selectedPgDetails)}
      />

      <OwnerModal 
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PGProvider>
        <NavigationProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </NavigationProvider>
      </PGProvider>
    </AuthProvider>
  );
}

export default App;
