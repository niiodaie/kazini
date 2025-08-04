import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Globe, MapPin } from 'lucide-react';

// Import modular auth components
import AuthTabs from './auth/AuthTabs';

const Auth = ({ onBack, onAuthSuccess, redirectTo = null }) => {
  const [userLocation, setUserLocation] = useState({ country: '', city: '', flag: '' });

  useEffect(() => {
    // Detect user location
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserLocation({ 
          country: data.country_name || 'United States', 
          city: data.city || 'New York',
          flag: data.country_code ? `https://flagcdn.com/16x12/${data.country_code.toLowerCase()}.png` : '🇺🇸'
        });
      } catch (error) {
        console.error('Location detection failed:', error);
        setUserLocation({ country: 'United States', city: 'New York', flag: '🇺🇸' });
      }
    };
    detectLocation();
  }, []);

  // Format phone number to international format
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

  // Clear all messages and errors
  const clearMessages = () => {
    setErrors({});
    setSuccessMessage('');
    setEmailVerificationRequired(false);
  };

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    clearMessages();
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        setErrors({ general: 'Google login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Google OAuth exception:', error);
      setErrors({ general: 'An error occurred during Google login.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP with proper phone formatting
  const sendOTP = async () => {
    if (!formData.phone) {
      setErrors({ phone: 'Please enter your phone number' });
      return;
    }

    const formattedPhone = formatPhoneNumber(formData.phone);
    console.log('Sending OTP to:', formattedPhone);

    setIsLoading(true);
    clearMessages();
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error('OTP Error:', error);
        setErrors({ phone: `Failed to send OTP: ${error.message}` });
      } else {
        setOtpSent(true);
        setOtpTimer(60);
        setSuccessMessage('Verification code sent to your phone!');
        setFormData(prev => ({ ...prev, phone: formattedPhone }));
      }
    } catch (err) {
      console.error('OTP Exception:', err);
      setErrors({ phone: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!formData.otp) {
      setErrors({ otp: 'Please enter the verification code' });
      return;
    }

    setIsLoading(true);
    clearMessages();
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formData.phone,
        token: formData.otp,
        type: 'sms'
      });

      if (error) {
        console.error('OTP Verification Error:', error);
        setErrors({ otp: 'Invalid verification code. Please try again.' });
        return;
      }

      if (data?.user) {
        // Create user profile
        const profileData = await upsertUserProfile(data.user);
        
        const userData = {
          id: data.user.id,
          phone: formData.phone,
          displayName: profileData.display_name || 'Phone User',
          plan: profileData.plan || 'free',
          location: userLocation,
          authMethod: 'phone',
          supabaseUser: data.user
        };

        localStorage.setItem('kazini_user', JSON.stringify(userData));
        
        // Redirect to truth-test on successful verification
        onAuthSuccess(userData, true, false);
      }
    } catch (err) {
      console.error('OTP Verification Exception:', err);
      setErrors({ otp: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === 'login') {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    } else if (activeTab === 'signup') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    } else if (activeTab === 'phone') {
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (otpSent && !formData.otp) newErrors.otp = 'Verification code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'phone') {
      // Allow only digits, spaces, hyphens, parentheses, and plus sign
      const cleaned = value.replace(/[^\d\s\-\(\)\+]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleaned
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    clearMessages();
    
    try {
      if (activeTab === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Login error:', error);
          
          // Provide specific error messages
          if (error.message.includes('Invalid login credentials')) {
            setErrors({ general: 'Invalid email or password. Please check your credentials and try again.' });
          } else if (error.message.includes('Email not confirmed')) {
            setErrors({ general: 'Please verify your email address before signing in.' });
          } else if (error.message.includes('Too many requests')) {
            setErrors({ general: 'Too many login attempts. Please wait a moment and try again.' });
          } else {
            setErrors({ general: error.message || 'Login failed. Please try again.' });
          }
          return;
        }

        if (data?.user) {
          // Check if email is verified
          if (!data.user.email_confirmed_at) {
            setEmailVerificationRequired(true);
            setErrors({ general: 'Please verify your email address to access all features.' });
            return;
          }

          // Create user profile
          const profileData = await upsertUserProfile(data.user);
          
          const userData = {
            id: data.user.id,
            email: formData.email,
            displayName: profileData.display_name || 
                        data.user.user_metadata?.firstName || 
                        data.user.email?.split('@')[0] || 
                        'User',
            plan: profileData.plan || 'free',
            location: userLocation,
            authMethod: 'email',
            supabaseUser: data.user
          };

          localStorage.setItem('kazini_user', JSON.stringify(userData));
          
          // Redirect to truth-test on successful login
          onAuthSuccess(userData, false, false);
        }
      } else if (activeTab === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              firstName: formData.firstName,
              lastName: formData.lastName,
            },
          },
        });

        if (error) {
          console.error('Signup error:', error);
          
          // Provide specific error messages
          if (error.message.includes('User already registered')) {
            setErrors({ general: 'An account with this email already exists. Please try logging in instead.' });
          } else if (error.message.includes('Password should be')) {
            setErrors({ general: 'Password is too weak. Please choose a stronger password.' });
          } else {
            setErrors({ general: error.message || 'Failed to create account. Please try again.' });
          }
          return;
        }

        if (data?.user) {
          setSuccessMessage('Account created successfully! Please check your email to verify your account.');
          setActiveTab('login');
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        }
      }
    } catch (error) {
      console.error('Auth exception:', error);
      setErrors({ general: 'A network error occurred. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome to Kazini
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{userLocation.city}, {userLocation.country}</span>
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email Verification Required */}
              {emailVerificationRequired && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Please check your email and click the verification link to access all features.
                  </AlertDescription>
                </Alert>
              )}

              {/* General Error */}
              {errors.general && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {errors.general}
                  </AlertDescription>
                </Alert>
              )}
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit}>
                  <TabsContent value="login" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="rounded border-gray-300"
                        disabled={isLoading}
                      />
                      <Label htmlFor="acceptTerms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                    {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}
                  </TabsContent>
                  
                  <TabsContent value="phone" className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold">Phone Authentication</h3>
                      <p className="text-sm text-gray-600">We'll send you a verification code</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          disabled={otpSent || isLoading}
                        />
                      </div>
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>
                    
                    {otpSent && (
                      <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="otp"
                            name="otp"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={formData.otp}
                            onChange={handleInputChange}
                            className="pl-10"
                            maxLength={6}
                            disabled={isLoading}
                          />
                        </div>
                        {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {otpTimer > 0 ? (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Resend in {otpTimer}s
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setOtpSent(false);
                                  setFormData(prev => ({ ...prev, otp: '' }));
                                  clearMessages();
                                }}
                                className="text-purple-600 hover:text-purple-700 hover:underline"
                                disabled={isLoading}
                              >
                                Resend Code
                              </button>
                            )}
                          </span>
                          {phoneVerified && (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  {activeTab === 'phone' ? (
                    <Button
                      type="button"
                      onClick={otpSent ? verifyOTP : sendOTP}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {!otpSent ? 'Sending Code...' : 'Verifying...'}
                        </div>
                      ) : (
                        !otpSent ? 'Send Verification Code' : 'Verify Code'
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {activeTab === 'login' ? 'Signing In...' : 'Creating Account...'}
                        </div>
                      ) : (
                        activeTab === 'login' ? 'Continue with Email' : 'Create Account'
                      )}
                    </Button>
                  )}
                </form>
                
                {activeTab !== 'phone' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Globe className="w-4 h-4 mr-2" />
                            Google
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Guest login functionality
                          const guestData = {
                            id: 'guest_' + Date.now(),
                            displayName: 'Guest',
                            plan: 'free',
                            location: userLocation,
                            authMethod: 'guest'
                          };
                          localStorage.setItem('kazini_user', JSON.stringify(guestData));
                          onAuthSuccess(guestData, true, false);
                        }}
                        disabled={isLoading}
                        className="w-full"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Guest
                      </Button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'login' && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                      onClick={() => {
                        // Handle forgot password
                        console.log('Forgot password clicked');
                      }}
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </Tabs>
              
              <div className="text-center text-xs text-gray-500">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Globe className="w-3 h-3" />
                  <span>Global Platform • 50+ Languages</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

