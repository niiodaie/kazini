import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Globe, MapPin, Phone, MessageSquare, CheckCircle, Clock } from 'lucide-react';

// Import Supabase
import { supabase } from '../supabase';

const Auth = ({ onBack, onAuthSuccess, redirectTo = null }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [errors, setErrors] = useState({});
  const [userLocation, setUserLocation] = useState({ country: '', city: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    // Simulate location detection
    const detectLocation = async () => {
      try {
        // Mock location detection - in real app, use geolocation API
        setTimeout(() => {
          setUserLocation({ country: 'United States', city: 'New York' });
        }, 1000);
      } catch (error) {
        console.error('Location detection failed:', error);
      }
    };
    detectLocation();
  }, []);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Format phone number to international format
  const formatPhoneNumber = (phone) => {
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

  // ✅ 1. Send OTP with proper phone formatting
  const sendOTP = async () => {
    if (!formData.phone) {
      setErrors({ phone: 'Please enter your phone number' });
      return;
    }

    const formattedPhone = formatPhoneNumber(formData.phone);
    console.log('Sending OTP to:', formattedPhone);

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error('OTP Error:', error);
        setErrors({ phone: `Failed to send OTP: ${error.message}` });
      } else {
        setOtpSent(true);
        setOtpTimer(60); // 60 second countdown
        setErrors({});
        // Update formData with formatted phone
        setFormData(prev => ({ ...prev, phone: formattedPhone }));
      }
    } catch (err) {
      console.error('OTP Exception:', err);
      setErrors({ phone: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 2. Verify OTP
  const verifyOTP = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formData.phone,
        token: formData.otp,
        type: 'sms'
      });

      if (data?.user) {
        const userData = {
          id: data.user.id,
          phone: formData.phone,
          firstName: 'Phone',
          lastName: 'User',
          plan: 'free',
          location: userLocation,
          authMethod: 'phone'
        };

        localStorage.setItem('kazini_user', JSON.stringify(userData));
        onAuthSuccess(userData, true, false);
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
      }
    } catch (err) {
      setErrors({ otp: 'Verification failed. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === 'login') {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
    } else if (activeTab === 'signup') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';
    } else if (activeTab === 'phone') {
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (otpSent && !formData.otp) newErrors.otp = 'OTP is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for phone input
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
    try {
      if (activeTab === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (data?.user) {
          const userData = {
            id: data.user.id,
            email: formData.email,
            firstName: data.user.user_metadata?.firstName || 'User',
            lastName: data.user.user_metadata?.lastName || '',
            plan: 'free',
            location: userLocation,
            authMethod: 'email'
          };

          localStorage.setItem('kazini_user', JSON.stringify(userData));
          onAuthSuccess(userData, true, false);
        } else {
          setErrors({ general: 'Invalid email or password' });
        }
    } else if (activeTab === 'signup') {
  try {
    const { data: data2, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      },
    });

    if (data2?.user) {
      await supabase.auth.signOut(); // Prevent auto-login before verification
      setShowMessage("🎉 Account created! Please check your inbox and verify your email before logging in.");
    } else {
      setErrors({ general: error?.message?.toString() || 'Failed to create account' });
    }
  }
  } catch (error) {
    setErrors({ general: error.message });
  } finally {
    setIsLoading(false);
  }
}

    if (provider === 'google') {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'https://auth.kazini.app/auth/v1/callback',

          },
        });

        if (error) {
          setErrors({ general: 'Google login failed. Please try again.' });
        }
      } catch (error) {
        setErrors({ general: 'An error occurred during Google login.' });
      } finally {
        setIsLoading(false);
      }
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
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
                          disabled={otpSent}
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
                                }}
                                className="text-purple-600 hover:text-purple-700 hover:underline"
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
                  
                  {errors.general && (
                    <div className="text-sm text-red-500 text-center mb-4">
                      {errors.general}
                    </div>
                  )}
                  
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
                          {!otpSent ? 'Sending OTP...' : 'Verifying...'}
                        </div>
                      ) : (
                        !otpSent ? 'Send OTP' : 'Verify OTP'
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
                        activeTab === 'login' ? 'Sign In' : 'Create Account'
                      )}
                    </Button>
                  )}
                </form>
              </Tabs>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLoginClick('google')}
                    disabled={isLoading}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLoginClick('guest')}
                    disabled={isLoading}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Guest
                  </Button>
                </div>
              </div>
              
              {/* Forgot Password Link for Login Tab */}
              {activeTab === 'login' && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                    onClick={() => window.parent.postMessage({ type: 'SHOW_COMING_SOON', feature: 'Password Reset' }, '*')}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Badge variant="secondary" className="text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  Global Platform • 50+ Languages
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

