import { supabase } from '../supabase';

// User profile management
export const upsertUserProfile = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userData.id,
        email: userData.email,
        display_name: userData.displayName,
        plan: userData.plan || 'free',
        auth_method: userData.authMethod,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Profile upsert error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected profile upsert error:', err);
    return { data: null, error: err };
  }
};

// Redirect to dashboard based on user plan
export const redirectToDashboard = (user, setCurrentView) => {
  if (!user) {
    setCurrentView('auth');
    return;
  }

  // Plan-based routing
  switch (user.plan) {
    case 'premium':
      setCurrentView('pro');
      break;
    case 'pro':
      setCurrentView('dashboard');
      break;
    case 'free':
    default:
      setCurrentView('dashboard');
      break;
  }
};

// Check if user has access to a feature based on their plan
export const checkPlanAccess = (userPlan, feature) => {
  const planFeatures = {
    free: [
      'truth_test',
      'basic_analysis',
      'profile'
    ],
    pro: [
      'truth_test',
      'basic_analysis',
      'profile',
      'couple_mode',
      'live_detection',
      'history',
      'trust_index'
    ],
    premium: [
      'truth_test',
      'basic_analysis',
      'profile',
      'couple_mode',
      'live_detection',
      'history',
      'trust_index',
      'ai_scheduler',
      'truth_circle',
      'advanced_analytics',
      'priority_support'
    ]
  };

  const userFeatures = planFeatures[userPlan] || planFeatures.free;
  return userFeatures.includes(feature);
};

// Initialize authentication state
export const initializeAuth = async (setUser) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth initialization error:', error);
      return;
    }

    if (session && session.user) {
      const userData = {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        plan: session.user.user_metadata?.plan || 'free',
        authMethod: session.user.app_metadata?.provider || 'email',
        emailConfirmed: session.user.email_confirmed_at ? true : false,
        session: session
      };
      
      setUser(userData);
      
      // Upsert user profile
      await upsertUserProfile(userData);
    } else {
      // Check for guest session
      const guestSession = localStorage.getItem('kazini_guest_session');
      if (guestSession) {
        try {
          const guestData = JSON.parse(guestSession);
          if (guestData.session.expires_at > Date.now()) {
            setUser(guestData);
          } else {
            localStorage.removeItem('kazini_guest_session');
          }
        } catch (err) {
          console.error('Invalid guest session:', err);
          localStorage.removeItem('kazini_guest_session');
        }
      }
    }
  } catch (err) {
    console.error('Unexpected auth initialization error:', err);
  }
};

// Setup auth state listener
export const setupAuthListener = (setUser) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('Auth state changed:', event);

      if (event === 'SIGNED_IN' && session) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          plan: session.user.user_metadata?.plan || 'free',
          authMethod: session.user.app_metadata?.provider || 'email',
          emailConfirmed: session.user.email_confirmed_at ? true : false,
          session: session
        };
        
        setUser(userData);
        localStorage.removeItem('kazini_guest_session'); // Clear guest session
        
        // Upsert user profile
        await upsertUserProfile(userData);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('kazini_guest_session');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setUser(prev => prev ? { ...prev, session } : null);
      }
    }
  );

  return { subscription };
};

// Handle logout
export const handleLogout = async (setUser, setCurrentView) => {
  try {
    // Clear guest session
    localStorage.removeItem('kazini_guest_session');
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
    }
    
    // Clear user state
    setUser(null);
    
    // Redirect to home
    setCurrentView('home');
    
    return { error: null };
  } catch (err) {
    console.error('Unexpected logout error:', err);
    return { error: err };
  }
};

// Check if user is authenticated
export const isAuthenticated = (user) => {
  return !!(user && (user.session || user.isGuest));
};

// Handle post-auth redirect
export const handlePostAuthRedirect = (setCurrentView) => {
  // Check if there's a stored redirect path
  const redirectPath = localStorage.getItem('kazini_redirect_after_auth');
  
  if (redirectPath) {
    localStorage.removeItem('kazini_redirect_after_auth');
    setCurrentView(redirectPath);
    return true;
  }
  
  return false;
};

// Store redirect path for post-auth
export const storeRedirectPath = (path) => {
  localStorage.setItem('kazini_redirect_after_auth', path);
};

// Navigate with auth check
export const navigateWithAuth = (targetRoute, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature) => {
  if (!isAuthenticated(user)) {
    // Store redirect path and show auth
    storeRedirectPath(targetRoute);
    setCurrentView('auth');
    return;
  }

  // Check plan access for premium features
  const premiumFeatures = ['couple_mode', 'ai_scheduler', 'truth_circle'];
  const featureMap = {
    'couple': 'couple_mode',
    'ai-scheduler': 'ai_scheduler',
    'truth-circle': 'truth_circle'
  };

  const feature = featureMap[targetRoute] || targetRoute.replace('/', '').replace('-', '_');
  
  if (premiumFeatures.includes(feature) && !checkPlanAccess(user.plan, feature)) {
    setUpgradeFeature(feature);
    setShowUpgradePrompt(true);
    return;
  }

  // Navigate to target route
  setCurrentView(targetRoute);
};

// Format user display name
export const formatDisplayName = (user) => {
  if (!user) return 'User';
  
  if (user.displayName && user.displayName !== 'User') {
    return user.displayName;
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  if (user.phone) {
    return 'Phone User';
  }
  
  return user.isGuest ? 'Guest' : 'User';
};

// Get user plan display name
export const getPlanDisplayName = (plan) => {
  const planNames = {
    free: 'Free',
    pro: 'Pro',
    premium: 'Premium'
  };
  
  return planNames[plan] || 'Free';
};

// Check if email needs verification
export const needsEmailVerification = (user) => {
  return !!(user && user.email && !user.emailConfirmed && !user.isGuest);
};

// Send email verification
export const sendEmailVerification = async (email) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });

    if (error) {
      console.error('Email verification error:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected email verification error:', err);
    return { error: err };
  }
};

export default {
  upsertUserProfile,
  redirectToDashboard,
  checkPlanAccess,
  initializeAuth,
  setupAuthListener,
  handleLogout,
  isAuthenticated,
  handlePostAuthRedirect,
  storeRedirectPath,
  navigateWithAuth,
  formatDisplayName,
  getPlanDisplayName,
  needsEmailVerification,
  sendEmailVerification
};

