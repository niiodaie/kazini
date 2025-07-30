import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Globe, MapPin, Phone, MessageSquare, CheckCircle, Clock } from 'lucide-react';

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

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => timer - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'phone') {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      
      if (otpSent && !formData.otp) {
        newErrors.otp = 'OTP is required';
      } else if (otpSent && formData.otp.length !== 6) {
        newErrors.otp = 'OTP must be 6 digits';
      }
    } else {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (activeTab === 'signup') {
        if (!formData.firstName) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
          newErrors.lastName = 'Last name is required';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.acceptTerms) {
          newErrors.acceptTerms = 'You must accept the terms and conditions';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    if (!formData.phone) {
      setErrors({ phone: 'Please enter your phone number' });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate Supabase OTP send
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOtpSent(true);
      setOtpTimer(60); // 60 second countdown
      setErrors({});
      
      // In real implementation:
      // const { error } = await supabase.auth.signInWithOtp({
      //   phone: formData.phone
      // });
      
    } catch (error) {
      setErrors({ phone: 'Failed to send OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful verification
      if (formData.otp === '123456' || formData.otp.length === 6) {
        setPhoneVerified(true);
        
        const userData = {
          id: '1',
          phone: formData.phone,
          firstName: 'Phone',
          lastName: 'User',
          plan: 'free',
          location: userLocation,
          authMethod: 'phone'
        };
        
        localStorage.setItem('kazini_user', JSON.stringify(userData));
        onAuthSuccess(userData, true, false); // isNewUser=true, isSocialLogin=false
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ otp: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful authentication
      const userData = {
        id: '1',
        email: formData.email,
        firstName: formData.firstName || 'Demo',
        lastName: formData.lastName || 'User',
        plan: 'free', // Default to free plan for all new users
        location: userLocation,
        authMethod: 'email',
        truthTestsUsed: 0, // Track usage for free plan limits
        truthTestsResetDate: new Date().toISOString() // Reset monthly
      };
      
      // Store user data in localStorage (in real app, use proper session management)
      localStorage.setItem('kazini_user', JSON.stringify(userData));
      
      // Pass isNewUser flag for signup
      const isNewUser = activeTab === 'signup';
      onAuthSuccess(userData, isNewUser, false); // isNewUser, isSocialLogin=false
    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    
    try {
      if (provider === 'phone') {
        // Handle phone authentication differently
        setActiveTab('phone');
        setIsLoading(false);
        return;
      }
      
      // Simulate social login API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful social authentication
      const userData = {
        id: `${provider}_${Date.now()}`,
        email: `user@${provider}.com`,
        firstName: 'Social',
        lastName: 'User',
        plan: 'free', // Default to free plan for social logins
        location: userLocation,
        provider: provider,
        authMethod: 'social',
        truthTestsUsed: 0, // Track usage for free plan limits
        truthTestsResetDate: new Date().toISOString() // Reset monthly
      };
      
      // Store user data in localStorage
      localStorage.setItem('kazini_user', JSON.stringify(userData));
      
      // Always show welcome screen for social logins with mode selection
      onAuthSuccess(userData, true, true); // isNewUser=true, isSocialLogin=true
    } catch (error) {
      setErrors({ general: `${provider} login failed. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestData = {
      id: 'guest',
      email: 'guest@kazini.com',
      firstName: 'Guest',
      lastName: 'User',
      plan: 'free', // Use free plan for guest users
      location: userLocation,
      truthTestsUsed: 0, // Track usage for free plan limits
      truthTestsResetDate: new Date().toISOString() // Reset monthly
    };
    
    localStorage.setItem('kazini_user', JSON.stringify(guestData));
    onAuthSuccess(guestData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen romantic-bg">
      {/* Floating emotional motifs */}
      <div className="emotional-motifs">
        <div className="motif">💔</div>
        <div className="motif">💑</div>
        <div className="motif">💬</div>
        <div className="motif">💍</div>
        <div className="motif">❤️</div>
        <div className="motif">💕</div>
      </div>
      
      {/* Dynamic light movement */}
      <div className="light-movement"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Location indicator */}
          {userLocation.country && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center justify-center gap-2 text-white/80"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{userLocation.city}, {userLocation.country}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Welcome to Kazini
                </CardTitle>
                <p className="text-gray-600">
                  Join thousands discovering emotional truth
                </p>
              </CardHeader>
              
              <CardContent className="p-6">
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
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
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
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="firstName"
                              placeholder="First name"
                              className="pl-10"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                          </div>
                          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
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
                            type="password"
                            placeholder="Confirm your password"
                            className="pl-10"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          />
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="acceptTerms" className="text-sm">
                          I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
                        </Label>
                      </div>
                      {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}
                    </TabsContent>
                    
                    <TabsContent value="phone" className="space-y-4">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold">Phone Authentication</h3>
                        <p className="text-sm text-gray-600">Enter your phone number to receive an OTP</p>
                      </div>
                      
                      {!otpSent ? (
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="pl-10"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                          </div>
                          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="otp">Enter OTP</Label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="otp"
                              type="text"
                              placeholder="Enter 6-digit code"
                              className="pl-10"
                              value={formData.otp}
                              onChange={(e) => handleInputChange('otp', e.target.value)}
                              maxLength={6}
                            />
                          </div>
                          {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
                          
                          <div className="text-center">
                            <p className="text-sm text-gray-600">
                              OTP sent to {formData.phone}
                            </p>
                            {otpTimer > 0 ? (
                              <p className="text-sm text-gray-500">
                                Resend in {otpTimer}s
                              </p>
                            ) : (
                              <button
                                type="button"
                                className="text-sm text-purple-600 hover:underline"
                                onClick={() => {
                                  setOtpTimer(30);
                                  // Simulate resending OTP
                                }}
                              >
                                Resend OTP
                              </button>
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
                    
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      disabled={isLoading}
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
                  </form>
                  
                    <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialLogin('phone')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Continue with Phone
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialLogin('google')}
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
                        onClick={() => handleSocialLogin('facebook')}
                      >
                        <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialLogin('apple')}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C8.396 0 8.025.044 6.79.207 5.557.37 4.697.723 3.953 1.171c-.744.448-1.376 1.08-1.824 1.824C1.681 3.739 1.328 4.599 1.165 5.832.002 7.067-.042 7.438-.042 11.059s.044 3.992.207 5.227c.163 1.233.516 2.093.964 2.837.448.744 1.08 1.376 1.824 1.824.744.448 1.604.801 2.837.964 1.235.163 1.606.207 5.227.207s3.992-.044 5.227-.207c1.233-.163 2.093-.516 2.837-.964.744-.448 1.376-1.08 1.824-1.824.448-.744.801-1.604.964-2.837.163-1.235.207-1.606.207-5.227s-.044-3.992-.207-5.227c-.163-1.233-.516-2.093-.964-2.837-.448-.744-1.08-1.376-1.824-1.824C15.109 1.328 14.249.975 13.016.812 11.781.649 11.41.605 7.789.605h4.228z"/>
                        </svg>
                        Apple
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGuestLogin}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Continue as Guest
                      </Button>
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
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

