import { supabase } from '../supabase';

/**
 * Handle social login with OAuth providers
 * @param {string} provider - OAuth provider (google, facebook, apple, etc.)
 * @returns {Promise<void>}
 */
export const handleSocialLogin = async (provider) => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error(`Login with ${provider} failed:`, error.message);
      throw new Error(`Login with ${provider} failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Social login error:', error);
    throw error;
  }
};

/**
 * Handle email/password login
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>}
 */
export const handleEmailLogin = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Email login failed:', error.message);
      throw new Error(`Login failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
};

/**
 * Handle email/password signup
 * @param {string} email 
 * @param {string} password 
 * @param {Object} metadata - Additional user metadata
 * @returns {Promise<Object>}
 */
export const handleEmailSignup = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: metadata.displayName || email.split('@')[0],
          ...metadata,
        },
      },
    });

    if (error) {
      console.error('Email signup failed:', error.message);
      throw new Error(`Signup failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Email signup error:', error);
    throw error;
  }
};

/**
 * Handle phone authentication with OTP
 * @param {string} phone - Phone number in international format
 * @returns {Promise<void>}
 */
export const handlePhoneAuth = async (phone) => {
  try {
    // Format phone number to international format
    const formattedPhone = formatPhoneNumber(phone);
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) {
      console.error('Phone auth failed:', error.message);
      throw new Error(`Phone authentication failed: ${error.message}`);
    }

    return { success: true, phone: formattedPhone };
  } catch (error) {
    console.error('Phone auth error:', error);
    throw error;
  }
};

/**
 * Verify phone OTP
 * @param {string} phone - Phone number
 * @param {string} token - OTP token
 * @returns {Promise<Object>}
 */
export const verifyPhoneOTP = async (phone, token) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formatPhoneNumber(phone),
      token,
      type: 'sms',
    });

    if (error) {
      console.error('OTP verification failed:', error.message);
      throw new Error(`OTP verification failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

/**
 * Format phone number to international format
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 1, assume US number
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  // If it's 10 digits, assume US number without country code
  else if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  // If it already starts with +, return as is
  else if (phone.startsWith('+')) {
    return phone;
  }
  // Default to US format
  else {
    return `+1${cleaned}`;
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get user failed:', error.message);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

/**
 * Get current session
 * @returns {Promise<Object|null>}
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Get session failed:', error.message);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

/**
 * Refresh the current session
 * @returns {Promise<Object|null>}
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Refresh session failed:', error.message);
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('Refresh session error:', error);
    return null;
  }
};

/**
 * Sign out user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out failed:', error.message);
      throw new Error(`Sign out failed: ${error.message}`);
    }

    // Clear local storage
    localStorage.removeItem('kazini_user');
    localStorage.removeItem('kazini_token');
    localStorage.removeItem('kazini_refresh_token');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Upsert user profile in Supabase
 * @param {Object} user - Supabase user object
 * @returns {Promise<Object>}
 */
export const upsertUserProfile = async (user) => {
  try {
    const profileData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      display_name: user.user_metadata?.display_name || 
                   user.user_metadata?.full_name || 
                   user.email?.split('@')[0] || 
                   'User',
      plan: 'free', // Default plan
      location: user.user_metadata?.location || { country: '', city: '' },
      auth_method: user.app_metadata?.provider || 'email',
      created_at: user.created_at,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Profile upsert failed:', error.message);
      // Return default profile data if upsert fails
      return profileData;
    }

    return data;
  } catch (error) {
    console.error('Profile upsert error:', error);
    // Return default profile data if error occurs
    return {
      id: user.id,
      email: user.email,
      display_name: user.email?.split('@')[0] || 'User',
      plan: 'free',
      location: { country: '', city: '' },
      auth_method: 'email',
    };
  }
};

/**
 * Handle password reset
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const handlePasswordReset = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      console.error('Password reset failed:', error.message);
      throw new Error(`Password reset failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} password - New password
 * @returns {Promise<void>}
 */
export const updatePassword = async (password) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error('Password update failed:', error.message);
      throw new Error(`Password update failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
};

/**
 * Store tokens in localStorage
 * @param {string} accessToken 
 * @param {string} refreshToken 
 */
export const storeTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('kazini_token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('kazini_refresh_token', refreshToken);
  }
};

/**
 * Get stored tokens from localStorage
 * @returns {Object} - { accessToken, refreshToken }
 */
export const getStoredTokens = () => {
  return {
    accessToken: localStorage.getItem('kazini_token'),
    refreshToken: localStorage.getItem('kazini_refresh_token'),
  };
};

/**
 * Clear stored tokens from localStorage
 */
export const clearStoredTokens = () => {
  localStorage.removeItem('kazini_token');
  localStorage.removeItem('kazini_refresh_token');
};

