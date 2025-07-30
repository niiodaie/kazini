import { supabase } from './supabase';


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
          display_name: metadata.displayName || email.split('@')[0],
          country: metadata.country || 'US',
          language: metadata.language || 'en',
          plan: 'free',
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
 * Handle phone authentication - send OTP
 * @param {string} phone - Phone number in international format
 * @returns {Promise<Object>}
 */
export const handlePhoneAuth = async (phone) => {
  try {
    // Ensure phone number is in international format
    const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    })

    if (error) {
      console.error('Phone OTP send failed:', error.message)
      throw new Error(`Failed to send OTP: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Phone auth error:', error)
    throw error
  }
}

/**
 * Verify phone OTP
 * @param {string} phone - Phone number in international format
 * @param {string} token - OTP token
 * @returns {Promise<Object>}
 */
export const verifyPhoneOTP = async (phone, token) => {
  try {
    // Ensure phone number is in international format
    const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
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
 * Reset password
 * @param {string} email 
 * @returns {Promise<Object>}
 */
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      console.error('Password reset failed:', error.message)
      throw new Error(`Password reset failed: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Password reset error:', error)
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
 * Get current user
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
 * Upsert user profile in profiles table
 * @param {Object} user - Supabase user object
 * @returns {Promise<Object>}
 */
export const upsertUserProfile = async (user) => {
  try {
    const profileData = {
      id: user.id,
      email: user.email,
      phone: user.phone || null,
      display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
      country: user.user_metadata?.country || 'US',
      language: user.user_metadata?.language || 'en',
      plan: user.user_metadata?.plan || 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      console.error('Profile upsert failed:', error.message)
      throw new Error(`Profile update failed: ${error.message}`)
    }

    return data?.[0] || profileData
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
 * Send mobile app download links via SMS
 * @param {string} phone - Phone number
 * @returns {Promise<void>}
 */
export const sendMobileAppSMS = async (phone) => {
  try {
    // This would integrate with Twilio or similar SMS service
    // For now, we'll simulate the SMS sending
    const message = `Download the Kazini app:\n\niOS: https://apps.apple.com/app/kazini\nAndroid: https://play.google.com/store/apps/details?id=com.kazini.app\n\nDiscover emotional truth in your relationships!`
    
    // In production, this would call your SMS API
    console.log(`SMS would be sent to ${phone}:`, message)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return { success: true, message: 'SMS sent successfully' }
  } catch (error) {
    console.error('SMS send error:', error)
    throw error
  }
}

