import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Phone, MessageSquare } from 'lucide-react';
import { supabase } from '../../supabase';

const PhoneLogin = ({ onSuccess, onError, loading, setLoading }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });
  const [localError, setLocalError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLocalError('');
  };

  const formatPhoneNumber = (phone) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('+')) {
      return phone;
    } else {
      return `+${cleaned}`;
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    try {
      const formattedPhone = formatPhoneNumber(formData.phone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone
      });

      if (error) {
        throw error;
      }

      setStep('otp');
    } catch (error) {
      console.error('OTP send error:', error);
      setLocalError(error.message || 'Failed to send OTP. Please try again.');
      onError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    try {
      const formattedPhone = formatPhoneNumber(formData.phone);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: formData.otp,
        type: 'sms'
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        onSuccess(data.user);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setLocalError(error.message || 'Invalid OTP. Please try again.');
      onError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setFormData(prev => ({ ...prev, otp: '' }));
    setLocalError('');
  };

  if (step === 'otp') {
    return (
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        {localError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-600">
              {localError}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            We sent a verification code to {formData.phone}
          </p>
        </div>

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
              className="pl-10 text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading || formData.otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleBackToPhone}
            disabled={loading}
          >
            Change Phone Number
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOTP} className="space-y-4">
      {localError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-600">
            {localError}
          </AlertDescription>
        </Alert>
      )}
      
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
            required
          />
        </div>
        <p className="text-xs text-gray-500">
          We'll send you a verification code via SMS
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !formData.phone}
      >
        {loading ? 'Sending...' : 'Send Verification Code'}
      </Button>
    </form>
  );
};

export default PhoneLogin;

