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

  // Card button style - inline to ensure it works
  const cardButtonStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: '200px',
    justifyContent: 'center'
  };

  const cardButtonHoverStyle = {
    ...cardButtonStyle,
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  };

  // Handle auth success
  const handleAuthSuccess = (userData) => {
    console.log('Auth success:', userData);
    
    // Check if this is a new user
    if (userData?.isNewUser) {
      setWelcomeData(userData);
      setShowWelcome(true);
    } else {
      // Redirect to dashboard for returning users
      setCurrentView(ROUTES.DASHBOARD);
    }
  };

  // Handle welcome completion
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setCurrentView(ROUTES.DASHBOARD);
  };

  // Handle logout
  const handleLogoutClick = async () => {
    try {
      await signOut();
      setCurrentView(ROUTES.HOME);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle upgrade
  const handleUpgrade = (feature) => {
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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%)' }}>
        {/* Navigation */}
        <nav style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/kazinilogo.png" alt="Kazini" style={{ width: '32px', height: '32px' }} />
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Kazini</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Language Selector */}
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '4px 8px' }}
              >
                <option value="en">🇺🇸 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
              </select>
              
              <button
                onClick={() => setCurrentView(ROUTES.PRICING)}
                style={{ 
                  padding: '4px 12px', 
                  background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                  color: 'white', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {t('pricing')}
              </button>
              <button
                onClick={() => setCurrentView(ROUTES.PROFILE)}
                style={{ 
                  padding: '4px 12px', 
                  backgroundColor: '#3b82f6', 
                  color: 'white', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {t('profile')}
              </button>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
              Welcome back, {formatDisplayName(user)}!
            </h1>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Ready to discover emotional truth?</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Truth Test */}
            <div 
              onClick={handleTruthTest}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                💬
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Truth Test</h3>
              <p style={{ color: '#6b7280' }}>Analyze responses for emotional authenticity</p>
            </div>

            {/* Couple Mode */}
            <div 
              onClick={handleCoupleMode}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                👫
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Couple Mode</h3>
              <p style={{ color: '#6b7280' }}>Test together in real-time or async</p>
            </div>

            {/* Go Live */}
            <div 
              onClick={handleGoLive}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #ef4444, #ec4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                📹
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Go Live</h3>
              <p style={{ color: '#6b7280' }}>Real-time video truth detection</p>
            </div>

            {/* AI Scheduler */}
            <div 
              onClick={handleAIScheduler}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                📅
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>AI Scheduler</h3>
              <p style={{ color: '#6b7280' }}>Schedule automated truth sessions</p>
            </div>

            {/* Truth Circle */}
            <div 
              onClick={handleTruthCircle}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #f97316, #ef4444)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                #
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Truth Circle</h3>
              <p style={{ color: '#6b7280' }}>Group truth sessions</p>
            </div>

            {/* Profile */}
            <div 
              onClick={() => setCurrentView(ROUTES.PROFILE)}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #6b7280, #4b5563)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                👤
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Profile</h3>
              <p style={{ color: '#6b7280' }}>Manage your account settings</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render hero page - FINAL FIXED VERSION WITH INLINE STYLES
  const renderHero = () => {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Floating Hearts Animation */}
        <div style={{ position: 'absolute', inset: '0', pointerEvents: 'none' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="animate-float"
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: '0.2',
                fontSize: '24px',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              {['💕', '💖', '💗', '💝', '💞', '💓'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>

        {/* Navigation - FIXED: Single logo */}
        <nav style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb', position: 'relative', zIndex: '10' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/kazinilogo.png" alt="Kazini" style={{ width: '32px', height: '32px' }} />
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Kazini</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Language Selector */}
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '4px 8px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              >
                <option value="en">🇺🇸 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
              </select>
              
              <button
                onClick={() => setCurrentView(ROUTES.PRICING)}
                style={{ 
                  padding: '4px 12px', 
                  background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                  color: 'white', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {t('pricing')}
              </button>
              
              {isAuthenticated() ? (
                <button
                  onClick={() => setCurrentView(ROUTES.PROFILE)}
                  style={{ 
                    padding: '4px 12px', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '6px', 
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {t('profile')}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView(ROUTES.AUTH)}
                  style={{ 
                    padding: '4px 12px', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '6px', 
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {t('signIn')}
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content - FIXED: Proper layout structure with inline styles */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 16px', textAlign: 'center', position: 'relative', zIndex: '10' }}>
          <h1 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1' }}>
            <span style={{ color: '#1f2937' }}>Discover</span>
            <br />
            <span style={{ background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Emotional Truth
            </span>
          </h1>
          
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '48px', maxWidth: '512px', margin: '0 auto 48px' }}>
            AI-powered relationship insights that help couples build deeper trust and authentic connections
          </p>

          {/* Action Buttons - FIXED: Proper card layout with inline styles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '800px', margin: '0 auto 64px' }}>
            <button
              onClick={handleTruthTest}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', transition: 'transform 0.3s' }}>
                🔍
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Start Truth Test</h3>
              <p style={{ color: '#6b7280' }}>Analyze responses for emotional authenticity</p>
            </button>
            
            <button
              onClick={handleGoLive}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #ef4444, #ec4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', transition: 'transform 0.3s' }}>
                📹
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Go Live</h3>
              <p style={{ color: '#6b7280' }}>Real-time video truth detection</p>
            </button>
            
            <button
              onClick={handleCoupleMode}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', transition: 'transform 0.3s' }}>
                👫
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Couple Mode</h3>
              <p style={{ color: '#6b7280' }}>Test together in real-time or async</p>
            </button>
            
            <button
              onClick={handleAIScheduler}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', transition: 'transform 0.3s' }}>
                📅
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>AI Scheduler</h3>
              <p style={{ color: '#6b7280' }}>Schedule automated truth sessions</p>
            </button>
            
            <button
              onClick={handleTruthCircle}
              style={cardButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, cardButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, cardButtonStyle)}
            >
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #f97316, #ef4444)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', transition: 'transform 0.3s' }}>
                #
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Truth Circle</h3>
              <p style={{ color: '#6b7280' }}>Group truth sessions</p>
            </button>
          </div>

          {/* Features Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                🤖
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>AI-Powered Analysis</h3>
              <p style={{ color: '#6b7280' }}>Advanced algorithms detect micro-expressions and speech patterns</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                🔒
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Privacy First</h3>
              <p style={{ color: '#6b7280' }}>Your conversations stay private with end-to-end encryption</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to right, #3b82f6, #10b981)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                💝
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Relationship Growth</h3>
              <p style={{ color: '#6b7280' }}>Build stronger bonds through honest communication</p>
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ marginTop: '80px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '32px' }}>What Couples Are Saying</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>"Kazini helped us communicate more honestly in our relationship."</p>
                <p style={{ fontWeight: '600', color: '#1f2937' }}>- Sarah & Mike</p>
              </div>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>"The AI insights are surprisingly accurate and helpful."</p>
                <p style={{ fontWeight: '600', color: '#1f2937' }}>- Alex Chen</p>
              </div>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>"A game-changer for understanding emotional authenticity."</p>
                <p style={{ fontWeight: '600', color: '#1f2937' }}>- Emma Rodriguez</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)', borderTop: '1px solid #e5e7eb', marginTop: '80px', position: 'relative', zIndex: '10' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                Visnec Global – Appleton, Wisconsin
              </p>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                📞 920-808-1188 | 📧 info@visnec.com
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                <a href="https://visnec.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>visnec.com</a>
                <a href="https://visnec.ai" style={{ color: '#3b82f6', textDecoration: 'none' }}>visnec.ai</a>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Support: support@visnec-it.com
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // Loading state
  if (authLoading || locationLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', border: '4px solid #8b5cf6', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6b7280' }}>Loading Kazini...</p>
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

