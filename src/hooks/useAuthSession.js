import { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from '../supabase';
import { upsertUserProfile } from '../utils/authUtils';
import { getPostLoginRoute } from '../utils/authHandler';

// Create Auth Context
const AuthContext = createContext({});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else if (session) {
          await handleSessionChange(session);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session) {
          await handleSessionChange(session);
        } else {
          setUser(null);
          setSession(null);
          localStorage.removeItem('kazini_user');
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSessionChange = async (session) => {
    try {
      setSession(session);
      
      if (session.user) {
        // Create/update user profile
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
      }
    } catch (error) {
      console.error('Error handling session change:', error);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (session?.user) {
      await handleSessionChange(session);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshUserProfile,
    isAuthenticated: !!user?.id,
    isGuest: user?.role === 'guest',
    isInvitedPartner: user?.isInvitedPartner === true,
    getPostLoginRoute: () => getPostLoginRoute(user)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuthSession = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for route protection
export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuthSession();
    const { requireAuth = true, allowedRoles = [], redirectTo = '/auth' } = options;

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      );
    }

    if (requireAuth && !user) {
      // Redirect to auth or show auth component
      window.location.href = redirectTo;
      return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      // User doesn't have required role
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default useAuthSession;

