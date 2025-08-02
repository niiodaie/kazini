import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { upsertUserProfile } from '../utils/authUtils';

/**
 * Custom hook for managing authentication state and operations
 * Centralizes all auth logic including login, signup, OTP, magic link, and plan-based routing
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear error messages
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get current user from Supabase session
  const getCurrentUser = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return null;
      }

      if (session?.user) {
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
          location: profileData.location || { country: '', city: '' },
          authMethod: session.user.app_metadata?.provider || 'email',
          emailConfirmed: !!session.user.email_confirmed_at,
          supabaseUser: session.user
        };

        setUser(userData);
        localStorage.setItem('kazini_user', JSON.stringify(userData));
        return userData;
      }

      return null;
    } catch (err) {
      console.error('Error in getCurrentUser:', err);
      return null;
    }
  }, []);

  // Plan-based routing logic
  const getRouteForPlan = useCallback((plan) => {
    switch (plan) {
      case 'pro':
        return '/dashboard';
      case 'couple':
        return '/couple-mode';
      case 'premium':
        return '/dashboard';
      default:
        return '/truth-test'; // fallback for free users
    }
  }, []);

  // Email/Password Login
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide specific error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a moment and try again.');
        } else {
          throw new Error(error.message || 'Login failed. Please try again.');
        }
      }

      if (data?.user) {
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          setError('Please verify your email address to access all features.');
          return { success: false, needsVerification: true };
        }

        const userData = await getCurrentUser();
        
        // Plan-based routing
        const route = getRouteForPlan(userData.plan);
        
        return { 
          success: true, 
          user: userData, 
          redirectTo: route 
        };
      }

      throw new Error('Login failed. Please try again.');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser, getRouteForPlan]);

  // Email/Password Signup
  const signup = useCallback(async (email, password, metadata = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        // Provide specific error messages
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please try logging in instead.');
        } else if (error.message.includes('Password should be')) {
          throw new Error('Password is too weak. Please choose a stronger password.');
        } else {
          throw new Error(error.message || 'Failed to create account. Please try again.');
        }
      }

      if (data?.user) {
        return { 
          success: true, 
          message: 'Account created successfully! Please check your email to verify your account.',
          needsVerification: true
        };
      }

      throw new Error('Failed to create account. Please try again.');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Magic Link Login
  const loginWithMagicLink = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to send magic link. Please try again.');
      }

      return { 
        success: true, 
        message: 'Magic link sent! Please check your email and click the link to sign in.' 
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Phone OTP Login
  const loginWithPhone = useCallback(async (phone) => {
    setIsLoading(true);
    setError(null);

    try {
      // Format phone number
      const formatPhoneNumber = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.length === 11 && cleaned.startsWith('1')) {
          return `+${cleaned}`;
        } else if (cleaned.length === 10) {
          return `+1${cleaned}`;
        } else if (phone.startsWith('+')) {
          return phone;
        } else {
          return `+1${cleaned}`;
        }
      };

      const formattedPhone = formatPhoneNumber(phone);

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        throw new Error(error.message || 'Failed to send OTP. Please try again.');
      }

      return { 
        success: true, 
        message: 'Verification code sent to your phone!',
        phone: formattedPhone
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify Phone OTP
  const verifyPhoneOTP = useCallback(async (phone, otp) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        throw new Error('Invalid verification code. Please try again.');
      }

      if (data?.user) {
        const userData = await getCurrentUser();
        
        // Plan-based routing
        const route = getRouteForPlan(userData.plan);
        
        return { 
          success: true, 
          user: userData, 
          redirectTo: route 
        };
      }

      throw new Error('Verification failed. Please try again.');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser, getRouteForPlan]);

  // Google OAuth Login
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw new Error('Google login failed. Please try again.');
      }

      // OAuth redirect will handle the rest
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Resend Email Verification
  const resendEmailVerification = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to resend verification email.');
      }

      return { 
        success: true, 
        message: 'Verification email sent! Please check your inbox.' 
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message || 'Logout failed.');
      }

      setUser(null);
      localStorage.removeItem('kazini_user');
      
      return { success: true, redirectTo: '/home' };
    } catch (err) {
      setError(err.message);
      // Fallback cleanup
      setUser(null);
      localStorage.removeItem('kazini_user');
      return { success: false, error: err.message, redirectTo: '/home' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guest Login
  const loginAsGuest = useCallback(() => {
    const guestData = {
      id: 'guest_' + Date.now(),
      displayName: 'Guest',
      plan: 'free',
      authMethod: 'guest',
      emailConfirmed: true
    };
    
    setUser(guestData);
    localStorage.setItem('kazini_user', JSON.stringify(guestData));
    
    const route = getRouteForPlan(guestData.plan);
    
    return { 
      success: true, 
      user: guestData, 
      redirectTo: route 
    };
  }, [getRouteForPlan]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing user session
        const savedUser = localStorage.getItem('kazini_user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            if (mounted) setUser(userData);
          } catch (err) {
            console.error("Error parsing saved user:", err);
            localStorage.removeItem('kazini_user');
          }
        }

        // Get current session from Supabase
        await getCurrentUser();
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user && mounted) {
          const userData = await getCurrentUser();
          
          if (event === 'SIGNED_IN' && userData) {
            // Plan-based routing on sign in
            const route = getRouteForPlan(userData.plan);
            // You can emit a custom event here for routing
            window.dispatchEvent(new CustomEvent('authRedirect', { 
              detail: { route, user: userData } 
            }));
          }
        } else if (event === 'SIGNED_OUT' && mounted) {
          setUser(null);
          localStorage.removeItem('kazini_user');
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [getCurrentUser, getRouteForPlan]);

  return {
    // State
    user,
    loading,
    error,
    isLoading,
    
    // Actions
    login,
    signup,
    loginWithMagicLink,
    loginWithPhone,
    verifyPhoneOTP,
    loginWithGoogle,
    loginAsGuest,
    logout,
    resendEmailVerification,
    getCurrentUser,
    clearError,
    
    // Utilities
    isAuthenticated: !!user,
    needsEmailVerification: user && !user.emailConfirmed,
    getRouteForPlan,
  };
};

