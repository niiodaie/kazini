import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabase';

const GoogleOAuthButton = ({ onSuccess, onError, isLoading, setIsLoading }) => {
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      // Real Supabase Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        let errorMessage = 'Google sign-in failed. Please try again.';
        
        if (error.message.includes('OAuth provider not configured')) {
          errorMessage = 'Google sign-in is not available. Please try another login method.';
        } else if (error.message.includes('popup_closed_by_user')) {
          errorMessage = 'Sign-in was cancelled. Please try again.';
        } else if (error.message.includes('access_denied')) {
          errorMessage = 'Access denied. Please grant permission to continue.';
        } else {
          errorMessage = error.message;
        }
        
        setErrors({ general: errorMessage });
        if (onError) onError(errorMessage);
        setIsLoading(false);
        return;
      }

      // OAuth redirect will handle the rest
      setSuccessMessage('Redirecting to Google...');
      
      // Note: The actual success handling will be done by the auth state listener
      // or the MagicLinkHandler component when the user returns from Google
      
    } catch (err) {
      console.error('Google OAuth error:', err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
      if (onError) onError(errorMessage);
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

      {/* Google OAuth Button */}
      <Button
        onClick={handleGoogleLogin}
        className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting to Google...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default GoogleOAuthButton;

