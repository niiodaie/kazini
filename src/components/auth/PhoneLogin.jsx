import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Phone, MessageSquare, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../supabase';

const PhoneLogin = ({ onSuccess, onError, isLoading, setIsLoading }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });
  const [formattedPhone, setFormattedPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle different phone number formats
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

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.phone.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Please enter a valid phone number' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const formatted = formatPhoneNumber(formData.phone);
      setFormattedPhone(formatted);
      
      // Real Supabase phone OTP
      const { error } = await supabase.auth.signInWithOtp({
        phone: formatted,
      });

      if (error) {
        let errorMessage = 'Failed to send verification code. Please try again.';
        
        if (error.message.includes('Phone number not valid')) {
          errorMessage = 'Please enter a valid phone number.';
        } else if (error.message.includes('SMS not configured')) {
          errorMessage = 'SMS service is not available. Please try another login method.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else {
          errorMessage = error.message;
        }
        
        setErrors({ general: errorMessage });
        if (onError) onError(errorMessage);
        setIsLoading(false);
        return;
      }

      setSuccessMessage(`Verification code sent to ${formatted}!`);
      setStep('otp');
      setIsLoading(false);
    } catch (err) {
      console.error('Phone OTP error:', err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
      if (onError) onError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.otp.trim()) {
      setErrors({ otp: 'Verification code is required' });
      return;
    }
    
    if (formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Real Supabase OTP verification
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: formData.otp,
        type: 'sms'
      });

      if (error) {
        let errorMessage = 'Invalid verification code. Please try again.';
        
        if (error.message.includes('Token has expired')) {
          errorMessage = 'Verification code has expired. Please request a new one.';
        } else if (error.message.includes('Invalid token')) {
          errorMessage = 'Invalid verification code. Please check and try again.';
        } else {
          errorMessage = error.message;
        }
        
        setErrors({ general: errorMessage });
        if (onError) onError(errorMessage);
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
          emailConfirmed: true, // Phone verification counts as confirmed
          session: data.session
        };
        
        setSuccessMessage('Phone verified successfully! Redirecting...');
        setIsLoading(false);
        
        if (onSuccess) {
          onSuccess(userData);
        }
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
      if (onError) onError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setFormData(prev => ({ ...prev, otp: '' }));
    setErrors({});
    setSuccessMessage('');
  };

  if (step === 'otp') {
    return (
      <div className="space-y-4">
        {/* Success Message */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
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

        {/* Phone Number Display */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to
          </p>
          <p className="font-medium text-gray-800">{formattedPhone}</p>
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          {/* OTP Field */}
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium">
              Verification Code
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
                disabled={isLoading}
              />
            </div>
            {errors.otp && (
              <p className="text-sm text-red-600">{errors.otp}</p>
            )}
          </div>

          {/* Verify Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify Code'
            )}
          </Button>

          {/* Back Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleBackToPhone}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Phone Number
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* General Error */}
      {errors.general && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errors.general}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSendOTP} className="space-y-4">
        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
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
              disabled={isLoading}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
          <p className="text-xs text-gray-500">
            We'll send you a verification code via SMS
          </p>
        </div>

        {/* Send OTP Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Code...</span>
            </div>
          ) : (
            'Send Verification Code'
          )}
        </Button>
      </form>
    </div>
  );
};

export default PhoneLogin;

