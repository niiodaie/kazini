import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Users, Shield, Star, ArrowRight, Play, MessageCircle, TrendingUp, User, LogOut, Camera, Calendar, Hash } from 'lucide-react';
import './App.css';

// Import assets
import kaziniLogo from './assets/kazinilogo.png';
import kaziniIcon from './assets/kazini-appicon.png';

// Components
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

// Plan utilities
import { checkPlanAccess, PLAN_FEATURES } from './plans';

function App() {
  const [currentView, setCurrentView] = useState('home');
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
    setIsLoaded(true);
    
    // Check for existing user session
    const savedUser = localStorage.getItem('kazini_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Listen for custom auth events from components
    const handleShowAuth = () => {
      setCurrentView('auth');
    };

    window.addEventListener('showAuth', handleShowAuth);
    
    return () => {
      window.removeEventListener('showAuth', handleShowAuth);
    };
  }, []);

  const handleAuthSuccess = (userData, isNewUser = false, isSocialLogin = false) => {
    setUser(userData);
    
    // Check if we need to show welcome screen
    if (isNewUser || isSocialLogin) {
      setWelcomeData({ user: userData, isNewUser, isSocialLogin });
      setShowWelcome(true);
      // Store redirect destination if coming from a protected route
      const urlParams = new URLSearchParams(window.location.search);
      const nextRoute = urlParams.get('next');
      if (nextRoute) {
        setRedirectAfterWelcome(nextRoute);
      }
    } else {
      // Direct login, check for redirect
      const urlParams = new URLSearchParams(window.location.search);
      const nextRoute = urlParams.get('next');
      if (nextRoute) {
        setCurrentView(nextRoute.replace('/', ''));
      } else {
        setCurrentView('home');
      }
    }
  };

  const handleWelcomeComplete = (mode) => {
    setShowWelcome(false);
    setWelcomeData(null);
    
    if (mode === 'couple') {
      setCurrentView('couple-mode');
    } else if (mode === 'individual') {
      if (redirectAfterWelcome) {
        setCurrentView(redirectAfterWelcome.replace('/', ''));
        setRedirectAfterWelcome(null);
      } else {
        setCurrentView('home');
      }
    } else {
      // Skip welcome
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  // Plan gating and upgrade handlers
  const checkFeatureAccess = (feature) => {
    if (!user) return false;
    return checkPlanAccess(user.plan, feature);
  };

  const handleFeatureAccess = (feature, targetView) => {
    if (!user) {
      setCurrentView('auth');
      return;
    }

    if (checkFeatureAccess(feature)) {
      setCurrentView(targetView);
    } else {
      setUpgradeFeature(feature);
      setShowUpgradePrompt(true);
    }
  };

  const handleUpgrade = (plan) => {
    setShowUpgradePrompt(false);
    setShowBillingModal(true);
  };

  const handleBillingSuccess = (plan) => {
    // Update user plan
    const updatedUser = { ...user, plan: plan.id.replace('_yearly', '').replace('_monthly', '') };
    setUser(updatedUser);
    localStorage.setItem('kazini_user', JSON.stringify(updatedUser));
    setShowBillingModal(false);
  };

  const handleComingSoon = (feature) => {
    setComingSoonFeature(feature);
    setShowComingSoonModal(true);
  };

  const handleBillingClose = () => {
    setShowBillingModal(false);
  };

  const handleComingSoonClose = () => {
    setShowComingSoonModal(false);
    setComingSoonFeature('');
  };

  const handleWelcomeComplete = (mode) => {

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotional Truth Detection",
      description: "AI-powered analysis of emotional authenticity in conversations",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Couple Modes",
      description: "Live room codes and async link sharing for partners",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trust Index",
      description: "Visual scoring and confidence tracking over time",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Secure, encrypted conversations with optional sharing",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah & Mike",
      text: "Kazini helped us communicate more honestly in our relationship.",
      rating: 5
    },
    {
      name: "Alex Chen",
      text: "The AI insights are surprisingly accurate and helpful.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      text: "A game-changer for understanding emotional authenticity.",
      rating: 5
    }
  ];

  const renderView = () => {
    // Show welcome screen if needed
    if (showWelcome && welcomeData) {
      return (
        <WelcomeScreen
          user={welcomeData.user}
          onComplete={handleWelcomeComplete}
          isNewUser={welcomeData.isNewUser}
          isSocialLogin={welcomeData.isSocialLogin}
        />
      );
    }

    switch (currentView) {
      case 'auth':
        return <Auth onBack={() => setCurrentView('home')} onAuthSuccess={handleAuthSuccess} />;
      case 'profile':
        return <UserProfile user={user} onBack={() => setCurrentView('home')} onLogout={handleLogout} onUpgrade={handleUpgrade} onNavigate={setCurrentView} />;
      case 'global-settings':
        return <GlobalSettings onBack={() => setCurrentView('profile')} user={user} onSettingsUpdate={(settings) => console.log('Settings updated:', settings)} />;
      case 'pricing':
        return <Pricing onBack={() => setCurrentView('home')} user={user} onUpgrade={handleUpgrade} />;
      case 'long-distance':
        return <LongDistance onBack={() => setCurrentView('home')} user={user} />;
      case 'truth-test':
        return <TruthTest onBack={() => setCurrentView('home')} user={user} />;
      case 'couple-mode':
        // Check authentication for couple mode
        if (!user) {
          // Redirect to auth with next parameter
          window.history.replaceState(null, '', '?next=couple-mode');
          return <Auth onBack={() => setCurrentView('home')} onAuthSuccess={handleAuthSuccess} redirectTo="couple-mode" />;
        }
        return <CoupleModeSelector onBack={() => setCurrentView('home')} onNavigate={setCurrentView} user={user} />;
      case 'couple-live':
        // Check authentication for live mode
        if (!user) {
          window.history.replaceState(null, '', '?next=couple-live');
          return <Auth onBack={() => setCurrentView('home')} onAuthSuccess={handleAuthSuccess} redirectTo="couple-live" />;
        }
        return <LiveSessionSetup onBack={() => setCurrentView('couple-mode')} user={user} />;
      case 'couple-async':
        // Check authentication for async mode
        if (!user) {
          window.history.replaceState(null, '', '?next=couple-async');
          return <Auth onBack={() => setCurrentView('home')} onAuthSuccess={handleAuthSuccess} redirectTo="couple-async" />;
        }
        return <AsyncLinkGenerator onBack={() => setCurrentView('couple-mode')} user={user} />;
      case 'trust-index':
        return <TrustIndex onBack={() => setCurrentView('home')} user={user} />;
      case 'history':
        return <History onBack={() => setCurrentView('home')} user={user} />;
      case 'live-detection':
        return <LiveDetection onBack={() => setCurrentView('home')} user={user} />;
      case 'ai-scheduler':
        return <AIScheduler onBack={() => setCurrentView('home')} userPlan={user?.plan || 'free'} />;
      case 'truth-circle':
        return <TruthCircle onBack={() => setCurrentView('home')} />;
      default:
        return (
          <div className="min-h-screen romantic-bg">
            {/* Floating emotional motifs */}
            <div className="emotional-motifs">
              <div className="motif">💔</div>
              <div className="motif">💑</div>
              <div className="motif">💬</div>
              <div className="motif">💍</div>
              <div className="motif">❤️</div>
              <div className="motif">💕</div>
            </div>
            
            {/* Dynamic light movement */}
            <div className="light-movement"></div>

            {/* Navigation Header */}
            <nav className="relative z-20 p-4">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={kaziniIcon} alt="Kazini" className="w-10 h-10 heart-pulse" />
                  <span className="text-white font-bold text-xl">Kazini</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <span className="text-white/80 text-sm">
                        Welcome, {user.firstName}
                      </span>
                      <button
                        onClick={() => setCurrentView('profile')}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-300"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCurrentView('auth')}
                      className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-all duration-300"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-0">
              {/* Background Animation */}
              <div className="absolute inset-0 opacity-10">
                <div className="floating-animation absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
                <div className="floating-animation absolute top-40 right-32 w-24 h-24 bg-white rounded-full" style={{ animationDelay: '2s' }}></div>
                <div className="floating-animation absolute bottom-32 left-1/4 w-40 h-40 bg-white rounded-full" style={{ animationDelay: '4s' }}></div>
              </div>

              <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
                  transition={{ duration: 0.8 }}
                  className="mb-8"
                >
                  <div className="heart-pulse">
                    <img 
                      src={kaziniLogo} 
                      alt="Kazini Logo" 
                      className="w-64 h-auto mx-auto mb-6"
                    />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6"
                >
                  Discover Emotional
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Truth
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  AI-powered emotional truth detection for deeper, more authentic relationships. 
                  Understand the real emotions behind every conversation.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <button
                    onClick={() => user ? setCurrentView('truth-test') : setCurrentView('auth')}
                    className="bg-white text-[#3B2A4A] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 pulse-glow"
                  >
                    <Play className="w-6 h-6" />
                    Start Truth Test
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => user ? setCurrentView('live-detection') : setCurrentView('auth')}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-3 shadow-lg"
                  >
                    <Camera className="w-6 h-6" />
                    Go Live
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </button>
                  
                  <button
                    onClick={() => handleFeatureAccess(PLAN_FEATURES.COUPLE_MODE, 'couple-mode')}
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#3B2A4A] transition-all duration-300 flex items-center gap-3 couple-glow"
                  >
                    <Users className="w-6 h-6" />
                    Couple Mode
                    {user && user.plan === 'free' && (
                      <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full ml-2">Pro</span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => user ? setCurrentView('ai-scheduler') : setCurrentView('auth')}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-3 shadow-lg"
                  >
                    <Calendar className="w-6 h-6" />
                    AI Scheduler
                  </button>
                  
                  <button
                    onClick={() => setCurrentView('truth-circle')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center gap-3 shadow-lg"
                  >
                    <Hash className="w-6 h-6" />
                    Truth Circle
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoaded ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mt-16 text-white/70"
                >
                  <p className="text-sm mb-4">Powered by AI • Trusted by thousands</p>
                  <div className="flex justify-center items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm">4.9/5 from 10,000+ users</span>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/95 backdrop-blur-sm">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Why Choose Kazini?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Advanced AI technology meets intuitive design to help you understand 
                    emotional authenticity like never before.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-white/20"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    How It Works
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Simple, powerful, and accurate emotional truth detection in three steps.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12">
                  {[{
                      step: "1",
                      title: "Ask a Question",
                      description: "Type or speak your question to start the emotional analysis process.",
                      icon: <MessageCircle className="w-12 h-12" />
                    },
                    {
                      step: "2",
                      title: "Get Response",
                      description: "Receive an answer and let our AI analyze the emotional authenticity.",
                      icon: <Zap className="w-12 h-12" />
                    },
                    {
                      step: "3",
                      title: "View Results",
                      description: "See truth indicators, confidence scores, and detailed insights.",
                      icon: <TrendingUp className="w-12 h-12" />
                    }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="text-center"
                    >
                      <div className="w-24 h-24 bg-gradient-to-r from-[#3B2A4A] to-[#FF5A5F] rounded-full flex items-center justify-center text-white mx-auto mb-6 heart-pulse">
                        {step.icon}
                      </div>
                      <div className="text-sm font-bold text-[#FF5A5F] mb-2">STEP {step.step}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white/90 backdrop-blur-sm">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    What Users Say
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Join thousands of users who have discovered deeper emotional connections.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                    >
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic text-lg">"{testimonial.text}"</p>
                      <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-500/80 to-purple-500/80 backdrop-blur-sm">
              <div className="container mx-auto px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Discover Truth?
                  </h2>
                  <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
                    Start your journey to deeper, more authentic relationships today.
                  </p>
                  <button
                    onClick={() => user ? setCurrentView('truth-test') : setCurrentView('auth')}
                    className="bg-white text-[#3B2A4A] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 pulse-glow mx-auto"
                  >
                    <Play className="w-6 h-6" />
                    Start Truth Test
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#3B2A4A] py-12">
              <div className="container mx-auto px-6 text-center text-white/70">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                  <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <img src={kaziniIcon} alt="Kazini" className="w-8 h-8 heart-pulse" />
                    <span className="text-white font-bold text-lg">Kazini</span>
                    <span className="text-white/50">Powered by Visnec Global</span>
                  </div>
                  <div className="flex gap-6">
                    <a href="#" onClick={() => setCurrentView('trust-index')} className="hover:text-white transition-colors duration-300">Trust Index</a>
                    <a href="#" onClick={() => setCurrentView('history')} className="hover:text-white transition-colors duration-300">History</a>
                    <a href="#" onClick={() => setCurrentView('pricing')} className="hover:text-white transition-colors duration-300">Pricing</a>
                    <a href="#" onClick={() => setCurrentView('long-distance')} className="hover:text-white transition-colors duration-300">Long Distance</a>
                  </div>
                </div>
                
                {/* Social Media Icons */}
                <div className="flex justify-center gap-6 mb-6">
                  <a href="https://facebook.com/kazini" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com/kazini" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C8.396 0 8.025.044 6.79.207 5.557.37 4.697.723 3.953 1.171c-.744.448-1.376 1.08-1.824 1.824C1.681 3.739 1.328 4.599 1.165 5.832.002 7.067-.042 7.438-.042 11.059s.044 3.992.207 5.227c.163 1.233.516 2.093.964 2.837.448.744 1.08 1.376 1.824 1.824.744.448 1.604.801 2.837.964 1.235.163 1.606.207 5.227.207s3.992-.044 5.227-.207c1.233-.163 2.093-.516 2.837-.964.744-.448 1.376-1.08 1.824-1.824.448-.744.801-1.604.964-2.837.163-1.235.207-1.606.207-5.227s-.044-3.992-.207-5.227c-.163-1.233-.516-2.093-.964-2.837-.448-.744-1.08-1.376-1.824-1.824C15.109 1.328 14.249.975 13.016.812 11.781.649 11.41.605 7.789.605h4.228z"/>
                    </svg>
                  </a>
                  <a href="https://tiktok.com/@kazini" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com/company/kazini" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com/kazini" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
                
                <p className="text-sm">
                  © 2024 Visnec Global. All rights reserved. | Privacy Policy | Terms of Service
                </p>
              </div>
            </footer>
          </div>
        );
    }
  };

  // Add message listener for coming soon modal
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'SHOW_COMING_SOON') {
        handleComingSoon(event.data.feature);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {renderView()}
      <BillingModal 
        isOpen={showBillingModal} 
        onClose={handleBillingClose}
        onUpgrade={handleBillingSuccess}
      />
      <ComingSoonModal 
        isOpen={showComingSoonModal} 
        onClose={handleComingSoonClose}
        feature={comingSoonFeature}
      />
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature={upgradeFeature}
        onUpgrade={handleUpgrade}
        currentPlan={user?.plan || 'free'}
      />
    </AnimatePresence>
  );
}

export default App;


