import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Users, Shield, Star, ArrowRight, Play, MessageCircle, TrendingUp, User, Camera, Calendar, Hash } from 'lucide-react';
import './App.css';

import { supabase } from './supabase';
import { initializeAuth, setupAuthListener, handleLogout, isAuthenticated, handleAuthSuccess as authHandlerSuccess } from './utils/authHandler';
import { ROUTES, navigateWithAuth, handlePostAuthRedirect, getDefaultRoute } from './utils/router';
import { guardRoute } from './utils/routeGuard';

import kaziniLogo from './assets/kazinilogo.png';
import kaziniIcon from './assets/kazini-appicon.png';

import TruthTest from './components/TruthTest';
import CoupleMode from './components/CoupleMode';
import CoupleModeSelector from './components/CoupleModeSelector';
import LiveSessionSetup from './components/LiveSessionSetup';
import AsyncLinkGenerator from './components/AsyncLinkGenerator';
import TrustIndex from './components/TrustIndex';
import History from './components/History';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import GlobalSettings from './components/GlobalSettings';
import Pricing from './components/Pricing';
import LongDistance from './components/LongDistance';
import BillingModal from './components/BillingModal';
import AIScheduler from './components/AIScheduler';
import TruthCircle from './components/TruthCircle';
import ComingSoonModal from './components/ComingSoonModal';
import LiveDetection from './components/LiveDetection';
import WelcomeScreen from './components/WelcomeScreen';
import UpgradePrompt from './components/UpgradePrompt';
import MagicLinkHandler from './components/auth/MagicLinkHandler';
import EnhancedHero from './components/EnhancedHero';
import LanguageSelector from './components/LanguageSelector';

import { checkPlanAccess, PLAN_FEATURES } from './plans';

function App() {
  const [currentView, setCurrentView] = useState(ROUTES.HOME);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeData, setWelcomeData] = useState(null);
  const [redirectAfterWelcome, setRedirectAfterWelcome] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');

  // Handle URL hash tokens and session setup
  useEffect(() => {
    setIsLoaded(true);
    
    // Initialize authentication
    initializeAuth(setUser);
    
    // Setup auth state listener with new routing logic
    const authListener = setupAuthListener((userData) => {
      setUser(userData);
      
      // Apply new routing logic when user state changes
      if (userData) {
        const redirectRoute = authHandlerSuccess(userData, setCurrentView);
      }
    });

    // Listen for custom auth events
    const handleShowAuth = (event) => {
      setCurrentView('auth');
    };

    window.addEventListener('showAuth', handleShowAuth);

    return () => {
      authListener?.subscription?.unsubscribe();
      window.removeEventListener('showAuth', handleShowAuth);
    };
  }, []);

  const handleAuthSuccess = (userData, isNewUser = false, showWelcomeScreen = false) => {
    setUser(userData);
    localStorage.setItem('kazini_user', JSON.stringify(userData));
    
    if (showWelcomeScreen) {
      setWelcomeData(userData);
      setShowWelcome(true);
      // Use new routing logic to determine redirect
      const redirectRoute = getDefaultRoute(userData);
      setRedirectAfterWelcome(redirectRoute);
    } else {
      // Use new routing logic
      authHandlerSuccess(userData, setCurrentView, isNewUser);
    }
  };

  const handleWelcomeComplete = (mode) => {
    setShowWelcome(false);
    if (redirectAfterWelcome) {
      setCurrentView(redirectAfterWelcome);
    } else {
      // Fallback to new routing logic
      const redirectRoute = getDefaultRoute(user);
      setCurrentView(redirectRoute);
    }
  };

  const handleLogoutClick = async () => {
    await handleLogout(setUser, setCurrentView);
  };

  const handleUpgrade = () => {
    setShowBillingModal(true);
  };

  const handleComingSoon = (feature) => {
    setComingSoonFeature(feature);
    setShowComingSoonModal(true);
  };

  const handleShowUpgrade = (feature) => {
    setUpgradeFeature(feature);
    setShowUpgradePrompt(true);
  };

  // Plan gating functions
  const checkFeatureAccess = (feature) => {
    if (!user) return false;
    return checkPlanAccess(user.plan, feature);
  };

  const handleFeatureAccess = (feature, callback) => {
    if (checkFeatureAccess(feature)) {
      callback();
    } else {
      handleShowUpgrade(feature);
    }
  };

  // Navigation handlers with new route guard
  const handleCoupleMode = () => {
    guardRoute(ROUTES.COUPLE, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature);
  };

  const handleTruthTest = () => {
    guardRoute(ROUTES.TRUTH_TEST, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature);
  };

  const handleGoLive = () => {
    guardRoute(ROUTES.LIVE_DETECTION, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature);
  };

  const handleAIScheduler = () => {
    guardRoute(ROUTES.AI_SCHEDULER, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature);
  };

  const handleTruthCircle = () => {
    guardRoute(ROUTES.TRUTH_CIRCLE, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature);
  };

  const handleDashboard = () => {
    guardRoute(ROUTES.DASHBOARD, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature);
  };

  const renderView = () => {
    // Show auth for logged-out users trying to access protected routes
    if (!isAuthenticated(user) && [ROUTES.COUPLE, ROUTES.COUPLE_LIVE, ROUTES.COUPLE_ASYNC, ROUTES.PROFILE, ROUTES.HISTORY, ROUTES.TRUST_INDEX, ROUTES.AI_SCHEDULER, ROUTES.DASHBOARD].includes(currentView)) {
      return <Auth onBack={() => setCurrentView(ROUTES.HOME)} onAuthSuccess={handleAuthSuccess} />;
    }

    switch (currentView) {
      case ROUTES.AUTH:
        return <Auth onBack={() => setCurrentView(ROUTES.HOME)} onAuthSuccess={handleAuthSuccess} />;
      case ROUTES.TRUTH_TEST:
        return <TruthTest onBack={() => setCurrentView(ROUTES.HOME)} user={user} />;
      case ROUTES.COUPLE:
        return <CoupleModeSelector onBack={() => setCurrentView(ROUTES.HOME)} />;
      case ROUTES.COUPLE_LIVE:
        return <LiveSessionSetup onBack={() => setCurrentView(ROUTES.COUPLE)} />;
      case ROUTES.COUPLE_ASYNC:
        return <AsyncLinkGenerator onBack={() => setCurrentView(ROUTES.COUPLE)} />;
      case ROUTES.TRUST_INDEX:
        return <TrustIndex onBack={() => setCurrentView(ROUTES.HOME)} />;
      case ROUTES.HISTORY:
        return <History onBack={() => setCurrentView(ROUTES.HOME)} />;
      case ROUTES.PROFILE:
        return <UserProfile onBack={() => setCurrentView(ROUTES.HOME)} user={user} onLogout={handleLogoutClick} />;
      case ROUTES.SETTINGS:
        return <GlobalSettings onBack={() => setCurrentView(ROUTES.HOME)} />;
      case ROUTES.PRICING:
        return <Pricing onBack={() => setCurrentView(ROUTES.HOME)} onUpgrade={handleUpgrade} />;
      case ROUTES.LONG_DISTANCE:
        return <LongDistance onBack={() => setCurrentView(ROUTES.HOME)} />;
      case ROUTES.AI_SCHEDULER:
        return <AIScheduler onBack={() => setCurrentView(ROUTES.HOME)} user={user} />;
      case ROUTES.TRUTH_CIRCLE:
        return <TruthCircle onBack={() => setCurrentView(ROUTES.HOME)} />;
      case ROUTES.LIVE_DETECTION:
        return <LiveDetection onBack={() => setCurrentView(ROUTES.HOME)} />;
      case ROUTES.DASHBOARD:
        return renderDashboard();
      default:
        return renderHero();
    }
  };

  const renderDashboard = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome back, {user?.displayName}!</h1>
            <p className="text-lg text-gray-600">Ready to discover emotional truth?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature cards */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg cursor-pointer"
              onClick={handleTruthTest}
            >
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Truth Test</h3>
                <p className="text-gray-600">Analyze responses for emotional authenticity</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg cursor-pointer"
              onClick={handleCoupleMode}
            >
              <div className="text-center">
                <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Couple Mode</h3>
                <p className="text-gray-600">Test together in real-time or async</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg cursor-pointer"
              onClick={handleGoLive}
            >
              <div className="text-center">
                <Camera className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Go Live</h3>
                <p className="text-gray-600">Real-time video truth detection</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg cursor-pointer"
              onClick={handleAIScheduler}
            >
              <div className="text-center">
                <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Scheduler</h3>
                <p className="text-gray-600">Schedule automated truth sessions</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg cursor-pointer"
              onClick={handleTruthCircle}
            >
              <div className="text-center">
                <Hash className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Truth Circle</h3>
                <p className="text-gray-600">Community stories and insights</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg cursor-pointer"
              onClick={() => guardRoute(ROUTES.PROFILE, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature)}
            >
              <div className="text-center">
                <User className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Profile</h3>
                <p className="text-gray-600">Manage your account and settings</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  const renderHero = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden">
        {/* Enhanced floating hearts and couple elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute animate-float opacity-10"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0.5 + Math.random() * 0.5
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              {['💕', '💖', '💗', '💝', '💞', '💓'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center p-6 bg-white/10 backdrop-blur-sm">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <img src={kaziniIcon} alt="Kazini" className="w-10 h-10" />
            <img src={kaziniLogo} alt="Kazini" className="h-8" />
          </motion.div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentView(ROUTES.PRICING)}
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Pricing
            </motion.button>
            {isAuthenticated(user) ? (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleDashboard}
                  className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
                >
                  Dashboard
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => guardRoute(ROUTES.PROFILE, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Profile
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setCurrentView(ROUTES.AUTH)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 font-medium"
              >
                Sign In
              </motion.button>
            )}
          </div>
        </nav>

        {/* Enhanced Hero Content */}
        <EnhancedHero
          handleTruthTest={handleTruthTest}
          handleGoLive={handleGoLive}
          handleCoupleMode={handleCoupleMode}
          handleAIScheduler={handleAIScheduler}
          handleTruthCircle={handleTruthCircle}
        />

        {/* Magic Link Handler - Always present at root level */}
        <MagicLinkHandler
          onSuccess={handleAuthSuccess}
          onError={(error) => console.error('Magic link error:', error)}
        />
      </div>
    );
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <WelcomeScreen
            key="welcome"
            userData={welcomeData}
            onComplete={handleWelcomeComplete}
          />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showBillingModal && (
        <BillingModal
          onClose={() => setShowBillingModal(false)}
          user={user}
        />
      )}

      {showComingSoonModal && (
        <ComingSoonModal
          feature={comingSoonFeature}
          onClose={() => setShowComingSoonModal(false)}
        />
      )}

      {showUpgradePrompt && (
        <UpgradePrompt
          feature={upgradeFeature}
          onClose={() => setShowUpgradePrompt(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
}

export default App;

