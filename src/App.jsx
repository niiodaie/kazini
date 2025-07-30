import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Users, Shield, Star, ArrowRight, Play, MessageCircle, TrendingUp, User, LogOut, Camera, Calendar, Hash } from 'lucide-react';
import './App.css';

import supabase from './supabase';
import { upsertUserProfile, getCurrentUser } from './utils/authUtils';

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

  // 🌍 GEO + LANGUAGE PATCH
  const fetchLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json');
      const data = await res.json();
      return {
        country: data.country_name,
        city: data.city,
        language: navigator.language || 'en'
      };
    } catch (err) {
      return { country: '', city: '', language: 'en' };
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    const savedUser = localStorage.getItem('kazini_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        try {
          const profile = await upsertUserProfile(session.user);
          const geo = await fetchLocation();
          const userData = {
            id: session.user.id,
            email: session.user.email,
            firstName: session.user.user_metadata?.first_name || session.user.user_metadata?.name?.split(' ')[0] || 'User',
            lastName: session.user.user_metadata?.last_name || session.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
            fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email,
            plan: profile?.plan || 'free',
            location: geo,
            language: geo.language,
            authMethod: session.user.app_metadata?.provider || 'email',
            provider: session.user.app_metadata?.provider,
            truthTestsUsed: profile?.truth_tests_used || 0,
            truthTestsResetDate: profile?.truth_tests_reset_date || new Date().toISOString(),
            supabaseUser: session.user,
            supabaseProfile: profile
          };
          localStorage.setItem('kazini_user', JSON.stringify(userData));
          setUser(userData);
          if (session.user.app_metadata?.provider !== 'email') {
            setWelcomeData(userData);
            setShowWelcome(true);
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('kazini_user');
        setUser(null);
        setCurrentView('home');
      }
    });

    window.addEventListener('showAuth', () => setCurrentView('auth'));
    return () => {
      window.removeEventListener('showAuth', () => setCurrentView('auth'));
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {renderView()}
      <BillingModal isOpen={showBillingModal} onClose={() => setShowBillingModal(false)} onUpgrade={handleBillingSuccess} />
      <ComingSoonModal isOpen={showComingSoonModal} onClose={() => setShowComingSoonModal(false)} feature={comingSoonFeature} />
      <UpgradePrompt isOpen={showUpgradePrompt} onClose={() => setShowUpgradePrompt(false)} feature={upgradeFeature} onUpgrade={handleUpgrade} currentPlan={user?.plan || 'free'} />
    </AnimatePresence>
  );
}

export default App;
