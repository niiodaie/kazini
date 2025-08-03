import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { User, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const GuestLogin = ({ onSuccess, onError, isLoading, setIsLoading }) => {
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      // Create a guest user session
      const guestUserData = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: null,
        displayName: 'Guest',
        plan: 'free',
        authMethod: 'guest',
        emailConfirmed: false,
        isGuest: true,
        session: {
          access_token: `guest_token_${Date.now()}`,
          refresh_token: null,
          expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          user: {
            id: `guest_${Date.now()}`,
            email: null,
            user_metadata: {
              full_name: 'Guest',
              plan: 'free'
            }
          }
        }
      };

      // Store guest session in localStorage
      localStorage.setItem('kazini_guest_session', JSON.stringify(guestUserData));
      
      setSuccessMessage('Signed in as guest! Redirecting...');
      setIsLoading(false);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(guestUserData);
        }, 1000);
      }
    } catch (err) {
      console.error('Guest login error:', err);
      const errorMessage = 'Failed to sign in as guest. Please try again.';
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

      {/* Info Message */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-1">
            <p className="font-medium">Guest Access Features:</p>
            <ul className="text-sm space-y-1">
              <li>• Try basic truth detection features</li>
              <li>• Limited to free plan features</li>
              <li>• Session expires after 24 hours</li>
              <li>• Create an account to save your progress</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Guest Login Button */}
      <Button
        onClick={handleGuestLogin}
        className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Signing In...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Continue as Guest</span>
          </div>
        )}
      </Button>

      {/* Additional Info */}
      <div className="text-center text-xs text-gray-500">
        <p>No account required • Try Kazini risk-free</p>
      </div>
    </div>
  );
};

export default GuestLogin;

