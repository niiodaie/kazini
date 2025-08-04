import { supabase } from '../supabase';
import { upsertUserProfile } from './authUtils';

/**
 * Handle URL hash tokens and session setup
 * This function processes OAuth redirect tokens from the URL hash
 */
export const handleAuthTokens = async () => {
  const hash = window.location.hash;

  if (hash.includes("access_token") && hash.includes("refresh_token")) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      try {
        // Set session in Supabase
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Supabase setSession error:", error);
          return { success: false, error };
        } else {
          console.log("Supabase session established via URL token.");
          // Clean URL
          window.history.replaceState(null, null, window.location.pathname);
          return { success: true, data };
        }
      } catch (err) {
        console.error("Error setting session:", err);
        return { success: false, error: err };
      }
    }
  }

  return { success: false, error: "No tokens found in URL" };
};

/**
 * Post-login routing logic based on user profile
 * @param {Object} user - User object with profile data
 * @returns {string} - Route to redirect to
 */
export const getPostLoginRoute = (user) => {
  // If no session, redirect to auth
  if (!user || !user.id) {
    return '/auth';
  }

  // Guest users go to truth-test
  if (user.role === 'guest') {
    return '/truth-test';
  }

  // Invited partners go to couple session
  if (user.isInvitedPartner === true && user.partnerSessionId) {
    return `/couple-session/${user.partnerSessionId}`;
  }

  // All other authenticated users go to dashboard
  // (Free, Pro, Enterprise users)
  return '/dashboard';
};

/**
 * Setup auth state listener with new routing logic
 * This function sets up the Supabase auth state change listener
 */
export const setupAuthListener = (setUser) => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (session && session.user) {
        try {
          // Create/update user profile in Supabase
          const profileData = await upsertUserProfile(session.user);
          
          // Create user object for local state
          const userData = {
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            displayName: profileData.display_name || 
                        session.user.user_metadata?.full_name || 
                        session.user.email?.split('@')[0] || 
                        'User',
            plan: profileData.plan || 'free',
            role: profileData.role || 'user',
            isInvitedPartner: profileData.is_invited_partner || false,
            partnerSessionId: profileData.partner_session_id || null,
            isCoupleModeActive: profileData.is_couple_mode_active || false,
            location: profileData.location || { country: '', city: '' },
            authMethod: session.user.app_metadata?.provider || 'email',
            supabaseUser: session.user
          };

          setUser(userData);
          localStorage.setItem('kazini_user', JSON.stringify(userData));
          
          // Return routing information for the app to handle
          if (event === 'SIGNED_IN') {
            const redirectRoute = getPostLoginRoute(userData);
            return { redirect: redirectRoute, user: userData };
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          return { error };
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear user state
        setUser(null);
        localStorage.removeItem('kazini_user');
        return { redirect: '/home' };
      }
      
      return { success: true };
    }
  );

  return authListener;
};

/**
 * Initialize authentication with new routing logic
 * This function handles initial auth setup and token processing
 */
export const initializeAuth = async (setUser) => {
  try {
    // Handle URL tokens first
    await handleAuthTokens();
    
    // Check for existing user session
    const savedUser = localStorage.getItem('kazini_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error("Error parsing saved user:", err);
        localStorage.removeItem('kazini_user');
      }
    }

    // Get current session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return { success: false, error };
    }

    if (session && session.user) {
      // Update user profile and local state
      const profileData = await upsertUserProfile(session.user);
      
      const userData = {
        id: session.user.id,
        email: session.user.email,
        phone: session.user.phone,
        displayName: profileData.display_name || 
                    session.user.user_metadata?.full_name || 
                    session.user.email?.split('@')[0] || 
                    'User',
        plan: profileData.plan || 'free',
        role: profileData.role || 'user',
        isInvitedPartner: profileData.is_invited_partner || false,
        partnerSessionId: profileData.partner_session_id || null,
        isCoupleModeActive: profileData.is_couple_mode_active || false,
        location: profileData.location || { country: '', city: '' },
        authMethod: session.user.app_metadata?.provider || 'email',
        supabaseUser: session.user
      };

      setUser(userData);
      localStorage.setItem('kazini_user', JSON.stringify(userData));
    }

    return { success: true };
  } catch (error) {
    console.error('Error initializing auth:', error);
    return { success: false, error };
  }
};

/**
 * Handle logout
 * This function signs out the user and cleans up state
 */
export const handleLogout = async (setUser, setCurrentView) => {
  try {
    await supabase.auth.signOut();
    // Auth state listener will handle cleanup
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    // Fallback cleanup
    setUser(null);
    localStorage.removeItem('kazini_user');
    if (setCurrentView) {
      setCurrentView('home');
    }
    return { success: false, error };
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (user) => {
  return user && user.id;
};

/**
 * Get redirect URL after authentication
 */
export const getAuthRedirectUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('next') || getPostLoginRoute();
};

/**
 * Set redirect URL for after authentication
 */
export const setAuthRedirectUrl = (url) => {
  const currentUrl = new URL(window.location);
  currentUrl.searchParams.set('next', url);
  window.history.replaceState(null, null, currentUrl.toString());
};

/**
 * Handle post-authentication success with new routing logic
 * @param {Object} userData - User data from authentication
 * @param {Function} setCurrentView - Function to set current view
 * @param {boolean} isNewUser - Whether this is a new user signup
 */
export const handleAuthSuccess = (userData, setCurrentView, isNewUser = false) => {
  // Determine the correct route based on user profile
  const redirectRoute = getPostLoginRoute(userData);
  
  // Convert route to view name (remove leading slash and convert to view format)
  let viewName = redirectRoute.replace('/', '');
  
  // Handle special route mappings
  if (viewName === 'truth-test') {
    viewName = 'truth-test';
  } else if (viewName === 'dashboard') {
    viewName = 'dashboard';
  } else if (viewName.startsWith('couple-session/')) {
    // For couple session routes, we'll need to handle this specially
    viewName = 'couple-session';
  } else if (viewName === 'auth') {
    viewName = 'auth';
  } else {
    // Default fallback
    viewName = 'dashboard';
  }
  
  setCurrentView(viewName);
};

/**
 * Create guest user session
 * @returns {Object} - Guest user data
 */
export const createGuestUser = () => {
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const guestUser = {
    id: guestId,
    email: null,
    phone: null,
    displayName: 'Guest User',
    plan: 'free',
    role: 'guest',
    isInvitedPartner: false,
    partnerSessionId: null,
    isCoupleModeActive: false,
    location: { country: '', city: '' },
    authMethod: 'guest',
    supabaseUser: null
  };
  
  return guestUser;
};

