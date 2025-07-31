import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Users, Shield, Star, ArrowRight, Play, MessageCircle, TrendingUp, User, Camera, Calendar, Hash } from 'lucide-react';
import './App.css';

import { supabase } from './supabase';
import { initializeAuth, setupAuthListener, handleLogout, isAuthenticated } from './utils/authHandler';
import { ROUTES, navigateWithAuth, handlePostAuthRedirect, getDefaultRoute } from './utils/router';

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
import { handleAuthTokens } from './utils/authHandler';
import { checkPlanAccess, PLAN_FEATURES } from './plans';
const [authInitializing, setAuthInitializing] = useState(true);


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

 useEffect(() => {
  const runAuth = async () => {
    setIsLoaded(true);

    // ✅ Handle OAuth redirect tokens (e.g. from Google)
    await handleAuthTokens(); // Ensure session is set before rendering

    // ✅ Initialize authentication and fetch user
    initializeAuth(setUser);

    // ✅ Setup auth state listener
    const authListener = setupAuthListener(setUser);

    // ✅ Custom event listener
    const handleShowAuth = () => setCurrentView('auth');
    window.addEventListener('showAuth', handleShowAuth);

    // Cleanup
    return () => {
      authListener?.subscription?.unsubscribe();
      window.removeEventListener('showAuth', handleShowAuth);
    };
  };

  runAuth().finally(() => {
    setAuthInitializing(false); // New flag to prevent early render
  });
}, []);



  const handleAuthSuccess = (userData, isNewUser = false, showWelcomeScreen = false) => {
    setUser(userData);
    localStorage.setItem('kazini_user', JSON.stringify(userData));
    
    if (showWelcomeScreen) {
      setWelcomeData(userData);
      setShowWelcome(true);
      setRedirectAfterWelcome(ROUTES.DASHBOARD);
    } else {
      // Check for post-auth redirect
      if (!handlePostAuthRedirect(setCurrentView)) {
        setCurrentView(ROUTES.DASHBOARD);
      }
    }
  };

  const handleWelcomeComplete = (mode) => {
    setShowWelcome(false);
    if (redirectAfterWelcome) {
      setCurrentView(redirectAfterWelcome);
    } else {
      setCurrentView(ROUTES.DASHBOARD);
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

  const handleCoupleMode = () => {
    navigateWithAuth(ROUTES.COUPLE, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature);
  };

  const handleTruthTest = () => {
    setCurrentView(ROUTES.TRUTH_TEST);
  };

  const handleGoLive = () => {
    setCurrentView(ROUTES.LIVE_DETECTION);
  };

  const handleAIScheduler = () => {
    navigateWithAuth(ROUTES.AI_SCHEDULER, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature);
  };

  const handleTruthCircle = () => {
    setCurrentView(ROUTES.TRUTH_CIRCLE);
  };

  const renderView = () => {
    // Show auth for logged-out users trying to access protected routes
    if (!isAuthenticated(user) && [ROUTES.COUPLE, ROUTES.COUPLE_LIVE, ROUTES.COUPLE_ASYNC, ROUTES.PROFILE, ROUTES.HISTORY, ROUTES.TRUST_INDEX, ROUTES.AI_SCHEDULER].includes(currentView)) {
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
              onClick={() => setCurrentView(ROUTES.PROFILE)}
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
        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center p-6">
          <div className="flex items-center space-x-3">
            <img src={kaziniIcon} alt="Kazini" className="w-10 h-10" />
            <img src={kaziniLogo} alt="Kazini" className="h-8" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView(ROUTES.PRICING)}
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Pricing
            </button>
            {isAuthenticated(user) ? (
              <button
                onClick={() => setCurrentView(ROUTES.PROFILE)}
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
              >
                Profile
              </button>
            ) : (
              <button
                onClick={() => setCurrentView(ROUTES.AUTH)}
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-7xl font-bold text-gray-800 mb-6"
            >
              Discover{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Emotional Truth
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
            >
              AI-powered relationship insights that help couples build deeper trust and authentic connections
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <button
                onClick={handleTruthTest}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Start Truth Test
              </button>

              <button
                onClick={handleGoLive}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 relative"
              >
                <Camera className="w-5 h-5" />
                Go Live
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              </button>

              <button
                onClick={handleCoupleMode}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Couple Mode
              </button>

              <button
                onClick={handleAIScheduler}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                AI Scheduler
              </button>

              <button
                onClick={handleTruthCircle}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Hash className="w-5 h-5" />
                Truth Circle
              </button>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-600">Advanced algorithms detect micro-expressions and speech patterns</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
                <p className="text-gray-600">Your conversations stay private with end-to-end encryption</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Relationship Growth</h3>
                <p className="text-gray-600">Build stronger bonds through honest communication</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative z-10 container mx-auto px-6 py-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Couples Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Kazini helped us communicate more honestly in our relationship."</p>
              <p className="font-semibold text-gray-800">- Sarah & Mike</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"The AI insights are surprisingly accurate and helpful."</p>
              <p className="font-semibold text-gray-800">- Alex Chen</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"A game-changer for understanding emotional authenticity."</p>
              <p className="font-semibold text-gray-800">- Emma Rodriguez</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="relative z-10 bg-gray-800 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <img src={kaziniIcon} alt="Kazini" className="w-8 h-8" />
                <img src={kaziniLogo} alt="Kazini" className="h-6" />
              </div>
              
              <div className="flex space-x-6 mb-4 md:mb-0">
                <a href="#" className="hover:text-pink-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-pink-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-pink-400 transition-colors">Support</a>
              </div>

              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-400">© 2024 Kazini. All rights reserved. Powered by Visnec Global.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

if (!isLoaded || authInitializing) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <img src={kaziniIcon} alt="Kazini" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600">Initializing Kazini...</p>
      </div>
    </div>
  );
}



  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>

      {/* Modals */}
      {showWelcome && (
        <WelcomeScreen
          userData={welcomeData}
          onComplete={handleWelcomeComplete}
        />
      )}

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

