import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Globe, MapPin, Phone, MessageSquare, CheckCircle, Clock, AlertTriangle, Info, Zap } from 'lucide-react';
import { supabase } from '../supabase';

const AuthEnhanced = ({ onBack, onAuthSuccess, redirectTo = null }) => {
  // Basic state
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    otp: '',
    acceptTerms: false
  });
  const [localErrors, setLocalErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');

  // Geolocation state
  const [location, setLocation] = useState({
    country: 'United States',
    city: 'New York',
    countryCode: 'US',
    loading: false,
    error: null
  });

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [availableLanguages] = useState([
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ]);

  // Simple translations
  const translations = {
    en: {
      'auth.welcome': 'Welcome to Kazini',
      'auth.login': 'Login',
      'auth.signup': 'Sign Up',
      'auth.magic': 'Magic Link',
      'auth.phone': 'Phone',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.continueWithEmail': 'Continue with Email',
      'auth.createAccount': 'Create Account',
      'auth.sendMagicLink': 'Send Magic Link',
      'auth.sendOTP': 'Send OTP',
      'auth.verifyOTP': 'Verify OTP',
      'auth.phoneNumber': 'Phone Number',
      'auth.verificationCode': 'Verification Code',
      'general.guest': 'Guest',
      'general.google': 'Google'
    },
    fr: {
      'auth.welcome': 'Bienvenue sur Kazini',
      'auth.login': 'Connexion',
      'auth.signup': 'S\'inscrire',
      'auth.magic': 'Lien Magique',
      'auth.phone': 'Téléphone',
      'auth.email': 'Email',
      'auth.password': 'Mot de passe',
      'auth.continueWithEmail': 'Continuer avec l\'email',
      'auth.createAccount': 'Créer un compte',
      'auth.sendMagicLink': 'Envoyer le lien',
      'auth.sendOTP': 'Envoyer le code',
      'auth.verifyOTP': 'Vérifier le code',
      'auth.phoneNumber': 'Numéro de téléphone',
      'auth.verificationCode': 'Code de vérification',
      'general.guest': 'Invité',
      'general.google': 'Google'
    },
    es: {
      'auth.welcome': 'Bienvenido a Kazini',
      'auth.login': 'Iniciar sesión',
      'auth.signup': 'Registrarse',
      'auth.magic': 'Enlace Mágico',
      'auth.phone': 'Teléfono',
      'auth.email': 'Email',
      'auth.password': 'Contraseña',
      'auth.continueWithEmail': 'Continuar con email',
      'auth.createAccount': 'Crear cuenta',
      'auth.sendMagicLink': 'Enviar enlace',
      'auth.sendOTP': 'Enviar código',
      'auth.verifyOTP': 'Verificar código',
      'auth.phoneNumber': 'Número de teléfono',
      'auth.verificationCode': 'Código de verificación',
      'general.guest': 'Invitado',
      'general.google': 'Google'
    }
  };

  // Translation function
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || translations['en']?.[key] || fallback;
  };

  // Get location flag
  const getLocationFlag = () => {
    const flagMap = {
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'GB': '🇬🇧',
      'FR': '🇫🇷',
      'DE': '🇩🇪',
      'ES': '🇪🇸',
      'IT': '🇮🇹',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'AU': '🇦🇺',
      'MX': '🇲🇽',
      'RU': '🇷🇺',
      'KR': '🇰🇷',
    };
    
    return flagMap[location.countryCode] || '🌍';
  };

  // Get formatted location
  const getFormattedLocation = () => {
    if (location.loading) return 'Detecting location...';
    if (location.error) return 'Location unavailable';
    
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    } else if (location.country) {
      return location.country;
    } else {
      return 'Unknown location';
    }
  };

  // Detect location on mount
  useEffect(() => {
    const detectLocation = async () => {
      setLocation(prev => ({ ...prev, loading: true }));
      
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.reason || 'API error');
        }

        setLocation({
          country: data.country_name || 'United States',
          city: data.city || 'New York',
          countryCode: data.country_code || 'US',
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Geolocation detection failed:', error);
        setLocation({
          country: 'United States',
          city: 'New York',
          countryCode: 'US',
          loading: false,
          error: error.message
        });
      }
    };

    detectLocation();
  }, []);

  // Detect language on mount
  useEffect(() => {
    const detectLanguage = () => {
      try {
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        const langCode = browserLang.split('-')[0].toLowerCase();
        const supportedLanguage = translations[langCode] ? langCode : 'en';
        
        setCurrentLanguage(supportedLanguage);
        localStorage.setItem('kazini_language', supportedLanguage);
      } catch (error) {
        console.error('Language detection failed:', error);
        setCurrentLanguage('en');
      }
    };

    const savedLanguage = localStorage.getItem('kazini_language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    } else {
      detectLanguage();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field-specific error
    if (localErrors[name]) {
      setLocalErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleGuestLogin = () => {
    const guestData = {
      id: 'guest_' + Date.now(),
      displayName: 'Guest',
      plan: 'free',
      authMethod: 'guest',
      emailConfirmed: true
    };
    
    if (onAuthSuccess) {
      onAuthSuccess(guestData, '/dashboard');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalErrors({});
    
    // Basic validation
    if (!formData.email) {
      setLocalErrors({ email: 'Email is required' });
      setIsLoading(false);
      return;
    }
    
    if (!formData.password) {
      setLocalErrors({ password: 'Password is required' });
      setIsLoading(false);
      return;
    }

    try {
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('Invalid login credentials')) {
          setLocalErrors({ general: 'Invalid email or password. Please check your credentials and try again.' });
        } else if (error.message.includes('Email not confirmed')) {
          setLocalErrors({ general: 'Please verify your email address before signing in.' });
        } else {
          setLocalErrors({ general: error.message || 'Login failed. Please try again.' });
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
          plan: data.user.user_metadata?.plan || 'free',
          authMethod: 'email',
          emailConfirmed: data.user.email_confirmed_at ? true : false
        };
        
        setIsLoading(false);
        if (onAuthSuccess) {
          onAuthSuccess(userData, '/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalErrors({ general: 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalErrors({});
    
    // Basic validation
    if (!formData.email) {
      setLocalErrors({ email: 'Email is required' });
      setIsLoading(false);
      return;
    }
    
    if (!formData.password) {
      setLocalErrors({ password: 'Password is required' });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setLocalErrors({ password: 'Password must be at least 6 characters' });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalErrors({ confirmPassword: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      // Real Supabase signup
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`.trim() || formData.email.split('@')[0],
            plan: 'free'
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setLocalErrors({ general: 'An account with this email already exists. Please try logging in instead.' });
        } else {
          setLocalErrors({ general: error.message || 'Signup failed. Please try again.' });
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setSuccessMessage('Account created successfully! Please check your email to verify your account before signing in.');
        setIsLoading(false);
        // Switch to login tab after successful signup
        setTimeout(() => {
          setActiveTab('login');
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setLocalErrors({ general: 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalErrors({});
    
    if (!formData.email) {
      setLocalErrors({ email: 'Email is required' });
      setIsLoading(false);
      return;
    }

    try {
      // Real Supabase magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        setLocalErrors({ general: error.message || 'Failed to send magic link. Please try again.' });
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Magic link sent! Check your email and click the link to sign in.');
      setIsLoading(false);
    } catch (err) {
      console.error('Magic link error:', err);
      setLocalErrors({ general: 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  const handlePhoneOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalErrors({});
    
    if (!formData.phone) {
      setLocalErrors({ phone: 'Phone number is required' });
      setIsLoading(false);
      return;
    }

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

      const formattedPhone = formatPhoneNumber(formData.phone);

      // Real Supabase phone OTP
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        setLocalErrors({ general: error.message || 'Failed to send OTP. Please try again.' });
        setIsLoading(false);
        return;
      }

      setOtpSent(true);
      setOtpPhone(formattedPhone);
      setSuccessMessage('Verification code sent to your phone!');
      setIsLoading(false);
    } catch (err) {
      console.error('Phone OTP error:', err);
      setLocalErrors({ general: 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalErrors({});
    
    if (!formData.otp) {
      setLocalErrors({ otp: 'Verification code is required' });
      setIsLoading(false);
      return;
    }

    try {
      // Real Supabase OTP verification
      const { data, error } = await supabase.auth.verifyOtp({
        phone: otpPhone,
        token: formData.otp,
        type: 'sms'
      });

      if (error) {
        setLocalErrors({ general: error.message || 'Invalid verification code. Please try again.' });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          phone: data.user.phone,
          displayName: data.user.user_metadata?.full_name || 'Phone User',
          plan: data.user.user_metadata?.plan || 'free',
          authMethod: 'phone',
          emailConfirmed: true // Phone verification counts as confirmed
        };
        
        setIsLoading(false);
        if (onAuthSuccess) {
          onAuthSuccess(userData, '/dashboard');
        }
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setLocalErrors({ general: 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLocalErrors({});
    
    try {
      // Real Supabase Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        setLocalErrors({ general: error.message || 'Google login failed. Please try again.' });
        setIsLoading(false);
        return;
      }

      // OAuth will redirect, so we don't need to handle success here
      // The auth state change will be handled by the auth listener
    } catch (err) {
      console.error('Google login error:', err);
      setLocalErrors({ general: 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('kazini_language', langCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              {/* Location and Language Display */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{getLocationFlag()}</span>
                  <span>{getFormattedLocation()}</span>
                </div>
                
                {/* Language Selector */}
                <div className="relative">
                  <select
                    value={currentLanguage}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="text-xs bg-transparent border-none outline-none cursor-pointer"
                  >
                    {availableLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              {t('auth.welcome')}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to discover emotional truth
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
                <TabsTrigger value="magic">{t('auth.magic')}</TabsTrigger>
                <TabsTrigger value="phone">{t('auth.phone')}</TabsTrigger>
              </TabsList>

              {/* General Error Display */}
              {localErrors.general && (
                <Alert className="border-red-200 bg-red-50 mt-4">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {localErrors.general}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t('auth.email')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="pl-10"
                      />
                    </div>
                    {localErrors.email && (
                      <p className="text-sm text-red-600">{localErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t('auth.password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {localErrors.password && (
                      <p className="text-sm text-red-600">{localErrors.password}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : t('auth.continueWithEmail')}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">
                      {t('auth.email')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="pl-10"
                      />
                    </div>
                    {localErrors.email && (
                      <p className="text-sm text-red-600">{localErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">
                      {t('auth.password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {localErrors.password && (
                      <p className="text-sm text-red-600">{localErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="pl-10"
                      />
                    </div>
                    {localErrors.confirmPassword && (
                      <p className="text-sm text-red-600">{localErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : t('auth.createAccount')}
                  </Button>
                </form>
              </TabsContent>

              {/* Magic Link Tab */}
              <TabsContent value="magic" className="space-y-4">
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="magic-email" className="text-sm font-medium">
                      {t('auth.email')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="magic-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="pl-10"
                      />
                    </div>
                    {localErrors.email && (
                      <p className="text-sm text-red-600">{localErrors.email}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending Link...' : t('auth.sendMagicLink')}
                  </Button>
                </form>
              </TabsContent>

              {/* Phone Tab */}
              <TabsContent value="phone" className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handlePhoneOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        {t('auth.phoneNumber')}
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="pl-10"
                        />
                      </div>
                      {localErrors.phone && (
                        <p className="text-sm text-red-600">{localErrors.phone}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending Code...' : t('auth.sendOTP')}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">
                        Code sent to {otpPhone}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-sm font-medium">
                        {t('auth.verificationCode')}
                      </Label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="otp"
                          name="otp"
                          type="text"
                          value={formData.otp}
                          onChange={handleInputChange}
                          placeholder="123456"
                          className="pl-10 text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>
                      {localErrors.otp && (
                        <p className="text-sm text-red-600">{localErrors.otp}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying...' : t('auth.verifyOTP')}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOtpSent(false);
                        setFormData(prev => ({ ...prev, otp: '' }));
                        setLocalErrors({});
                      }}
                    >
                      Back to Phone Number
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Social Login */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50"
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with {t('general.google')}
            </Button>

            {/* Guest Login */}
            <Button
              onClick={handleGuestLogin}
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50"
            >
              <User className="w-4 h-4 mr-2" />
              Continue as {t('general.guest')}
            </Button>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 space-x-4">
              <a href="/terms" className="hover:text-pink-500 transition-colors">
                Terms
              </a>
              <a href="/privacy" className="hover:text-pink-500 transition-colors">
                Privacy Policy
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthEnhanced;

