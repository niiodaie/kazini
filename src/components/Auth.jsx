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

// Import the new useAuth hook
import { useAuth } from '../hooks/useAuth';
import { useGeolocation } from '../hooks/useGeolocation';
import { useLanguage } from '../hooks/useLanguage';

const Auth = ({ onBack, onAuthSuccess, redirectTo = null }) => {
  const {
    isLoading,
    error,
    login,
    signup,
    loginWithMagicLink,
    loginWithPhone,
    verifyPhoneOTP,
    loginWithGoogle,
    loginAsGuest,
    resendEmailVerification,
    clearError,
    needsEmailVerification
  } = useAuth();

  const { location, getFormattedLocation, getLocationFlag } = useGeolocation();
  const { t, getCurrentLanguageInfo } = useLanguage();

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
  const [otpTimer, setOtpTimer] = useState(0);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Clear all messages and errors
  const clearMessages = () => {
    setLocalErrors({});
    setSuccessMessage('');
    clearError();
  };

  // Handle authentication success with plan-based routing
  const handleAuthSuccess = (result) => {
    if (result.success && result.user) {
      onAuthSuccess(result.user, false, false);
      
      // Use the redirectTo from the auth result (plan-based routing)
      if (result.redirectTo) {
        // Emit custom event for routing
        window.dispatchEvent(new CustomEvent('authRedirect', { 
          detail: { route: result.redirectTo, user: result.user } 
        }));
      }
    }
  };

  // Handle Magic Link Login
  const handleMagicLink = async () => {
    if (!formData.email) {
      setLocalErrors({ email: 'Please enter your email address' });
      return;
    }

    clearMessages();
    const result = await loginWithMagicLink(formData.email);
    
    if (result.success) {
      setMagicLinkSent(true);
      setSuccessMessage(result.message);
    } else {
      setLocalErrors({ general: result.error });
    }
  };

  // Send OTP
  const sendOTP = async () => {
    if (!formData.phone) {
      setLocalErrors({ phone: 'Please enter your phone number' });
      return;
    }

    clearMessages();
    const result = await loginWithPhone(formData.phone);
    
    if (result.success) {
      setOtpSent(true);
      setOtpTimer(60);
      setSuccessMessage(result.message);
      setFormData(prev => ({ ...prev, phone: result.phone }));
    } else {
      setLocalErrors({ phone: result.error });
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setLocalErrors({ otp: 'Please enter the verification code' });
      return;
    }

    clearMessages();
    const result = await verifyPhoneOTP(formData.phone, formData.otp);
    
    if (result.success) {
      handleAuthSuccess(result);
    } else {
      setLocalErrors({ otp: result.error });
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
    } else if (activeTab === 'magic') {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    }

    setLocalErrors(newErrors);
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
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    clearMessages();
    
    if (activeTab === 'login') {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        handleAuthSuccess(result);
      } else if (result.needsVerification) {
        // Handle email verification needed
        setLocalErrors({ general: result.error || error });
      } else {
        setLocalErrors({ general: result.error || error });
      }
    } else if (activeTab === 'signup') {
      const result = await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      if (result.success) {
        setSuccessMessage(result.message);
        setActiveTab('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        setLocalErrors({ general: result.error || error });
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
                    {t('auth.welcome')}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <span className="text-lg">{getLocationFlag()}</span>
                  <MapPin className="w-4 h-4" />
                  <span>{getFormattedLocation()}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {getCurrentLanguageInfo().flag} {getCurrentLanguageInfo().name}
                  </span>
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
              {needsEmailVerification && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Please verify your email address to access all features.
                    <Button
                      variant="link"
                      size="sm"
                      onClick={resendEmailVerification}
                      className="p-0 h-auto ml-2 text-yellow-800 underline"
                    >
                      Resend Link
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* General Error */}
              {(localErrors.general || error) && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {localErrors.general || error}
                  </AlertDescription>
                </Alert>
              )}
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                  <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
                  <TabsTrigger value="magic">{t('auth.magic')}</TabsTrigger>
                  <TabsTrigger value="phone">{t('auth.phone')}</TabsTrigger>
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
                      {localErrors.email && <p className="text-sm text-red-500">{localErrors.email}</p>}
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
                      {localErrors.password && <p className="text-sm text-red-500">{localErrors.password}</p>}
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
                        {localErrors.firstName && <p className="text-sm text-red-500">{localErrors.firstName}</p>}
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
                        {localErrors.lastName && <p className="text-sm text-red-500">{localErrors.lastName}</p>}
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
                      {localErrors.email && <p className="text-sm text-red-500">{localErrors.email}</p>}
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
                      {localErrors.password && <p className="text-sm text-red-500">{localErrors.password}</p>}
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
                      {localErrors.confirmPassword && <p className="text-sm text-red-500">{localErrors.confirmPassword}</p>}
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
                        I agree to the{' '}
                        <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          Terms
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                    {localErrors.acceptTerms && <p className="text-sm text-red-500">{localErrors.acceptTerms}</p>}
                  </TabsContent>
                  
                  <TabsContent value="magic" className="space-y-4">
                    <div className="text-center mb-4">
                      <Zap className="w-12 h-12 mx-auto text-purple-500 mb-2" />
                      <h3 className="text-lg font-semibold">Magic Link Login</h3>
                      <p className="text-sm text-gray-600">No password needed - we'll send you a secure link</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
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
                          disabled={isLoading || magicLinkSent}
                        />
                      </div>
                      {localErrors.email && <p className="text-sm text-red-500">{localErrors.email}</p>}
                    </div>
                    
                    {magicLinkSent && (
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                        <p className="text-sm text-green-800">
                          Magic link sent! Check your email and click the link to sign in.
                        </p>
                      </div>
                    )}
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
                      onClick={otpSent ? handleVerifyOTP : sendOTP}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {!otpSent ? t('auth.sendingCode') : t('auth.verifying')}
                        </div>
                      ) : (
                        !otpSent ? t('auth.sendVerificationCode') : t('auth.verifyCode')
                      )}
                    </Button>
                  ) : activeTab === 'magic' ? (
                    <Button
                      type="button"
                      onClick={handleMagicLink}
                      disabled={isLoading || magicLinkSent}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {t('auth.sendingLink')}
                        </div>
                      ) : (
                        magicLinkSent ? '✓ Link Sent' : t('auth.sendMagicLink')
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
                          {activeTab === 'login' ? t('auth.signingIn') : t('auth.creatingAccount')}
                        </div>
                      ) : (
                        activeTab === 'login' ? t('auth.continueWithEmail') : t('auth.createAccount')
                      )}
                    </Button>
                  )}
                </form>
                
                {(activeTab === 'login' || activeTab === 'signup') && (
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
                        onClick={loginWithGoogle}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Globe className="w-4 h-4 mr-2" />
                            {t('general.google')}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const result = loginAsGuest();
                          if (result.success) {
                            handleAuthSuccess(result);
                          }
                        }}
                        disabled={isLoading}
                        className="w-full"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {t('general.guest')}
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

