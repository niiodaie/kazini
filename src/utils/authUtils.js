// src/utils/authUtils.js
import supabase from '../supabase'

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
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error(`Login with ${provider} failed:`, error.message)
      throw new Error(`Login with ${provider} failed: ${error.message}`)
    }
  } catch (error) {
    console.error('Social login error:', error)
    throw error
  }
}

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
    })

    if (error) {
      console.error('Email login failed:', error.message)
      throw new Error(`Login failed: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Email login error:', error)
    throw error
  }
}

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
          full_name: metadata.fullName || '',
          first_name: metadata.firstName || '',
          last_name: metadata.lastName || '',
          ...metadata
        }
      }
    })

    if (error) {
      console.error('Email signup failed:', error.message)
      throw new Error(`Signup failed: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Email signup error:', error)
    throw error
  }
}

/**
 * Handle phone authentication
 * @param {string} phone 
 * @returns {Promise<Object>}
 */
export const handlePhoneAuth = async (phone) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    })

    if (error) {
      console.error('Phone auth failed:', error.message)
      throw new Error(`Phone authentication failed: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Phone auth error:', error)
    throw error
  }
}

/**
 * Verify OTP for phone authentication
 * @param {string} phone 
 * @param {string} token 
 * @returns {Promise<Object>}
 */
export const verifyPhoneOTP = async (phone, token) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    })

    if (error) {
      console.error('OTP verification failed:', error.message)
      throw new Error(`OTP verification failed: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('OTP verification error:', error)
    throw error
  }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Sign out failed:', error.message)
      throw new Error(`Sign out failed: ${error.message}`)
    }
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

/**
 * Get current user session
 * @returns {Promise<Object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Get user failed:', error.message)
      return null
    }

    return user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

/**
 * Create or update user profile in profiles table
 * @param {Object} user - Supabase user object
 * @returns {Promise<Object>}
 */
export const upsertUserProfile = async (user) => {
  try {
    const profileData = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      plan: 'free', // Default plan for new users
      provider: user.app_metadata?.provider || 'email',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (error) {
      console.error('Profile upsert failed:', error.message)
      throw new Error(`Profile update failed: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Profile upsert error:', error)
    throw error
  }
}

/**
 * Get user profile from profiles table
 * @param {string} userId 
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Get profile failed:', error.message)
      return null
    }

    return data
  } catch (error) {
    console.error('Get profile error:', error)
    return null
  }
}

/**
 * Reset password for email
 * @param {string} email 
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      console.error('Password reset failed:', error.message)
      throw new Error(`Password reset failed: ${error.message}`)
    }
  } catch (error) {
    console.error('Password reset error:', error)
    throw error
  }
}

