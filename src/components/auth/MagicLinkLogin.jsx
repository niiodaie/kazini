import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Mail, Send, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { supabase } from '../../supabase';

const MagicLinkLogin = ({ onSuccess, onError, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [linkSent, setLinkSent] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Real Supabase magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: true,
          data: {
            plan: 'free'
          }
        }
      });

      if (error) {
        let errorMessage = 'Failed to send magic link. Please try again.';
        
        if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (error.message.includes('Email not configured')) {
          errorMessage = 'Email service is not available. Please try another login method.';
        } else {
          errorMessage = error.message;
        }
        
        setErrors({ general: errorMessage });
        if (onError) onError(errorMessage);
        setIsLoading(false);
        return;
      }

      setSuccessMessage(`Magic link sent to ${formData.email}! Check your inbox and click the link to sign in.`);
      setLinkSent(true);
      setIsLoading(false);
      
      if (onSuccess) {
        onSuccess({
          message: 'Magic link sent successfully!',
          email: formData.email,
          needsEmailCheck: true
        });
      }
    } catch (err) {
      console.error('Magic link error:', err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
      if (onError) onError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleResendLink = async () => {
    if (!formData.email) return;
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: true,
          data: {
            plan: 'free'
          }
        }
      });

      if (error) {
        setErrors({ general: 'Failed to resend magic link. Please try again.' });
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Magic link resent! Check your inbox.');
      setIsLoading(false);
    } catch (err) {
      console.error('Resend magic link error:', err);
      setErrors({ general: 'Failed to resend magic link. Please try again.' });
      setIsLoading(false);
    }
  };

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

      {/* Info Message */}
      {!linkSent && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            We'll send you a secure login link via email. No password required!
          </AlertDescription>
        </Alert>
      )}

      {linkSent && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-2">
              <p>Check your email inbox and click the magic link to sign in.</p>
              <p className="text-sm">Don't see the email? Check your spam folder or click resend below.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
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
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Magic Link...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send Magic Link</span>
            </div>
          )}
        </Button>

        {/* Resend Button */}
        {linkSent && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResendLink}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Resending...</span>
              </div>
            ) : (
              'Resend Magic Link'
            )}
          </Button>
        )}
      </form>

      {/* Additional Help */}
      {linkSent && (
        <div className="text-center text-sm text-gray-600">
          <p>Having trouble? Make sure to check your spam folder.</p>
          <p>The magic link will expire in 1 hour for security.</p>
        </div>
      )}
    </div>
  );
};

export default MagicLinkLogin;

