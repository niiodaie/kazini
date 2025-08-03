import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const useAuthSession = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setError(error.message);
        } else if (session && mounted) {
          setSession(session);
          setUser({
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            plan: session.user.user_metadata?.plan || 'free',
            authMethod: session.user.app_metadata?.provider || 'email',
            emailConfirmed: session.user.email_confirmed_at ? true : false,
            session: session
          });
        } else {
          // Check for guest session
          const guestSession = localStorage.getItem('kazini_guest_session');
          if (guestSession && mounted) {
            try {
              const guestData = JSON.parse(guestSession);
              // Check if guest session is still valid (24 hours)
              if (guestData.session.expires_at > Date.now()) {
                setUser(guestData);
                setSession(guestData.session);
              } else {
                // Remove expired guest session
                localStorage.removeItem('kazini_guest_session');
              }
            } catch (err) {
              console.error('Invalid guest session data:', err);
              localStorage.removeItem('kazini_guest_session');
            }
          }
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
        setError(err.message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session) {
          setSession(session);
          setUser({
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            plan: session.user.user_metadata?.plan || 'free',
            authMethod: session.user.app_metadata?.provider || 'email',
            emailConfirmed: session.user.email_confirmed_at ? true : false,
            session: session
          });
          // Clear any guest session when user signs in
          localStorage.removeItem('kazini_guest_session');
          setError(null);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          // Clear any guest session on sign out
          localStorage.removeItem('kazini_guest_session');
          setError(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setSession(session);
          // Update user data with refreshed session
          setUser(prev => prev ? { ...prev, session } : null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear guest session
      localStorage.removeItem('kazini_guest_session');
      
      // Sign out from Supabase (if not a guest)
      if (user && !user.isGuest) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Sign out error:', error);
          setError(error.message);
          return { error };
        }
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      setError(null);
      
      return { error: null };
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Refresh session error:', error);
        setError(error.message);
        return { error };
      }
      
      if (session) {
        setSession(session);
        setUser(prev => prev ? { ...prev, session } : null);
      }
      
      return { session, error: null };
    } catch (err) {
      console.error('Unexpected refresh error:', err);
      setError(err.message);
      return { error: err };
    }
  };

  const isAuthenticated = () => {
    return !!(user && (session || user.isGuest));
  };

  const isGuest = () => {
    return !!(user && user.isGuest);
  };

  const hasValidSession = () => {
    if (user && user.isGuest) {
      return user.session.expires_at > Date.now();
    }
    return !!(session && session.access_token);
  };

  return {
    user,
    session,
    loading,
    error,
    signOut,
    refreshSession,
    isAuthenticated,
    isGuest,
    hasValidSession
  };
};

export default useAuthSession;

