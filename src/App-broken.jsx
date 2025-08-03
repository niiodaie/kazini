import React, { useState, useEffect } from 'react';
import './App.css';

// Import modular auth components
import AuthTabs from './components/auth/AuthTabs';
import MagicLinkHandler from './components/auth/MagicLinkHandler';

// Import existing components
import TruthTest from './components/TruthTest';
import CoupleModeSelector from './components/CoupleModeSelector';
import LiveSessionSetup from './components/LiveSessionSetup';
import AsyncLinkGenerator from './components/AsyncLinkGenerator';
import UserProfile from './components/UserProfile';
import AIScheduler from './components/AIScheduler';
import TruthCircle from './components/TruthCircle';
import LiveDetection from './components/LiveDetection';
import Pricing from './pages/Pricing';
import BillingModal from './components/BillingModal';
import ComingSoonModal from './components/ComingSoonModal';
import UpgradePrompt from './components/UpgradePrompt';
import WelcomeScreen from './components/WelcomeScreen';

// Import hooks and utilities
import useAuthSession from './hooks/useAuthSession';
import { useGeolocation } from './hooks/useGeolocation';
import { useLanguage } from './hooks/useLanguage';
import { 
  redirectToDashboard, 
  checkPlanAccess, 
  navigateWithAuth,
  handlePostAuthRedirect,
  formatDisplayName
} from './utils/authUtils';

// Import routing constants
import { ROUTES } from './utils/router';

function App() {
  // Auth state from custom hook
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuthSession();
  
  // Location and language hooks
  const { location, loading: locationLoading } = useGeolocation();
  const { language, setLanguage, t } = useLanguage();
  
  // App state
  const [currentView, setCurrentView] = useState(ROUTES.HOME);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeData, setWelcomeData] = useState(null);
  const [redirectAfterWelcome, setRedirectAfterWelcome] = useState(null);

  // Handle auth success
  const handleAuthSuccess = (userData, isNewUser = false, showWelcomeScreen = false) => {
    if (showWelcomeScreen) {
      setWelcomeData(userData);
      setShowWelcome(true);
      setRedirectAfterWelcome(ROUTES.DASHBOARD);
    } else {
      // Check for post-auth redirect, otherwise go to dashboard
      if (!handlePostAuthRedirect(setCurrentView)) {
        redirectToDashboard(userData, setCurrentView);
      }
    }
  };

  // Handle welcome completion
  const handleWelcomeComplete = (mode) => {
    setShowWelcome(false);
    if (redirectAfterWelcome) {
      setCurrentView(redirectAfterWelcome);
    } else {
      setCurrentView(ROUTES.DASHBOARD);
    }
  };

  // Handle logout
  const handleLogoutClick = async () => {
    await signOut();
    setCurrentView(ROUTES.HOME);
  };

  // Handle upgrade
  const handleUpgrade = () => {
    setShowBillingModal(true);
  };

  // Handle coming soon
  const handleComingSoon = (feature) => {
    setComingSoonFeature(feature);
    setShowComingSoonModal(true);
  };

  // Handle show upgrade
  const handleShowUpgrade = (feature) => {
    setUpgradeFeature(feature);
    setShowUpgradePrompt(true);
  };

  // Navigation handlers
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

  // Render view based on current route
  const renderView = () => {
    // Show auth for logged-out users trying to access protected routes
    const protectedRoutes = [ROUTES.COUPLE, ROUTES.COUPLE_LIVE, ROUTES.COUPLE_ASYNC, ROUTES.PROFILE, ROUTES.HISTORY, ROUTES.TRUST_INDEX, ROUTES.AI_SCHEDULER];
    
    if (!isAuthenticated() && protectedRoutes.includes(currentView)) {
      return (
        <AuthTabs 
          onBack={() => setCurrentView(ROUTES.HOME)} 
          onSuccess={handleAuthSuccess}
          location={location}
          language={language}
        />
      );
    }

    switch (currentView) {
      case ROUTES.AUTH:
        return (
          <AuthTabs 
            onBack={() => setCurrentView(ROUTES.HOME)} 
            onSuccess={handleAuthSuccess}
            location={location}
            language={language}
          />
        );
      case ROUTES.TRUTH_TEST:
        return <TruthTest onBack={() => setCurrentView(ROUTES.HOME)} user={user} />;
      case ROUTES.COUPLE:
        return <CoupleModeSelector onBack={() => setCurrentView(ROUTES.HOME)} />;
      case ROUTES.COUPLE_LIVE:
        return <LiveSessionSetup onBack={() => setCurrentView(ROUTES.COUPLE)} />;
      case ROUTES.COUPLE_ASYNC:
        return <AsyncLinkGenerator onBack={() => setCurrentView(ROUTES.COUPLE)} />;
      case ROUTES.PROFILE:
        return <UserProfile onBack={() => setCurrentView(ROUTES.HOME)} user={user} onLogout={handleLogoutClick} />;
      case ROUTES.PRICING:
        return <Pricing onBack={() => setCurrentView(ROUTES.HOME)} onUpgrade={handleUpgrade} />;
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

  // Render dashboard
  const renderDashboard = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/kazinilogo.png" alt="Kazini" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-800">Kazini</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="en">🇺🇸 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
              </select>
              
              <button
                onClick={() => setCurrentView(ROUTES.PRICING)}
                className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md text-sm hover:from-purple-600 hover:to-pink-600"
              >
                {t('pricing')}
              </button>
              <button
                onClick={() => setCurrentView(ROUTES.PROFILE)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                {t('profile')}
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome back, {formatDisplayName(user)}!
            </h1>
            <p className="text-lg text-gray-600">Ready to discover emotional truth?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Truth Test */}
            <div 
              onClick={handleTruthTest}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Truth Test</h3>
                <p className="text-gray-600">Analyze responses for emotional authenticity</p>
              </div>
            </div>

            {/* Couple Mode */}
            <div 
              onClick={handleCoupleMode}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👫</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Couple Mode</h3>
                <p className="text-gray-600">Test together in real-time or async</p>
              </div>
            </div>

            {/* Go Live */}
            <div 
              onClick={handleGoLive}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📹</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Go Live</h3>
                <p className="text-gray-600">Real-time video truth detection</p>
              </div>
            </div>

            {/* AI Scheduler */}
            <div 
              onClick={handleAIScheduler}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Scheduler</h3>
                <p className="text-gray-600">Schedule automated truth sessions</p>
              </div>
            </div>

            {/* Truth Circle */}
            <div 
              onClick={handleTruthCircle}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">#</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Truth Circle</h3>
                <p className="text-gray-600">Group truth sessions</p>
              </div>
            </div>

            {/* Profile */}
            <div 
              onClick={() => setCurrentView(ROUTES.PROFILE)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile</h3>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render hero page
  const renderHero = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              {['💕', '💖', '💗', '💝', '💞', '💓'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b relative z-10">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/kazinilogo.png" alt="Kazini" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-800">Kazini</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-white/90"
              >
                <option value="en">🇺🇸 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
              </select>
              
              <button
                onClick={() => setCurrentView(ROUTES.PRICING)}
                className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md text-sm hover:from-purple-600 hover:to-pink-600"
              >
                {t('pricing')}
              </button>
              
              {isAuthenticated() ? (
                <button
                  onClick={() => setCurrentView(ROUTES.PROFILE)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  {t('profile')}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView(ROUTES.AUTH)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  {t('signIn')}
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6">
            <span className="text-gray-800">Discover </span>
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Emotional Truth
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            AI-powered relationship insights that help couples build deeper trust and authentic connections
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={handleTruthTest}
              className="w-full py-4 px-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              🔍 Start Truth Test
            </button>
            
            <button
              onClick={handleGoLive}
              className="w-full py-4 px-8 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              📹 Go Live
            </button>
            
            <button
              onClick={handleCoupleMode}
              className="w-full py-4 px-8 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              👫 Couple Mode
            </button>
            
            <button
              onClick={handleAIScheduler}
              className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              📅 AI Scheduler
            </button>
            
            <button
              onClick={handleTruthCircle}
              className="w-full py-4 px-8 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              # Truth Circle
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">Advanced algorithms detect micro-expressions and speech patterns</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Privacy First</h3>
              <p className="text-gray-600">Your conversations stay private with end-to-end encryption</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Relationship Growth</h3>
              <p className="text-gray-600">Build stronger bonds through honest communication</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">What Couples Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <p className="text-gray-600 mb-4">"Kazini helped us communicate more honestly in our relationship."</p>
                <p className="font-semibold text-gray-800">- Sarah & Mike</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <p className="text-gray-600 mb-4">"The AI insights are surprisingly accurate and helpful."</p>
                <p className="font-semibold text-gray-800">- Alex Chen</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <p className="text-gray-600 mb-4">"A game-changer for understanding emotional authenticity."</p>
                <p className="font-semibold text-gray-800">- Emma Rodriguez</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white/90 backdrop-blur-sm border-t mt-20 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center space-y-2 text-sm text-gray-600">
              <p className="font-medium">Visnec Global – Appleton, Wisconsin</p>
              <p>📞 920-808-1188 | ✉️ info@visnec.com</p>
              <div className="space-x-2">
                <a href="https://visnec.com" className="hover:text-gray-800 underline">visnec.com</a>
                <span>|</span>
                <a href="https://visnec.ai" className="hover:text-gray-800 underline">visnec.ai</a>
              </div>
              <p>Support: support@visnec-it.com</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // Show loading screen while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Kazini...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Magic Link Handler - Global */}
      <MagicLinkHandler onSuccess={handleAuthSuccess} />
      
      {/* Welcome Screen */}
      {showWelcome && (
        <WelcomeScreen
          userData={welcomeData}
          onComplete={handleWelcomeComplete}
        />
      )}
      
      {/* Main Content */}
      {renderView()}
      
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

