import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { UserX, ArrowRight } from 'lucide-react';
import { createGuestUser } from '../../utils/authHandler';

const GuestLogin = ({ onSuccess, onError, loading, setLoading }) => {
  const [localError, setLocalError] = useState('');

  const handleGuestLogin = async () => {
    setLoading(true);
    setLocalError('');

    try {
      // Create guest user session
      const guestUser = createGuestUser();
      
      // Store guest user in localStorage
      localStorage.setItem('kazini_user', JSON.stringify(guestUser));
      
      // Call success callback with guest user data
      onSuccess(guestUser, false, false); // isNewUser=false, showWelcome=false
      
    } catch (error) {
      console.error('Guest login error:', error);
      setLocalError('Failed to create guest session. Please try again.');
      onError('Failed to create guest session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {localError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-600">
            {localError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <UserX className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Continue as Guest
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Try Kazini without creating an account. You'll have access to the Truth Test feature.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p className="text-yellow-800">
            <strong>Guest limitations:</strong> You won't be able to save your results, access couple mode, or use advanced features. 
            Sign up anytime to unlock the full experience.
          </p>
        </div>

        <Button
          onClick={handleGuestLogin}
          disabled={loading}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white"
        >
          {loading ? (
            'Creating guest session...'
          ) : (
            <>
              Continue as Guest
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500">
          Guest sessions are temporary and will be lost when you close your browser.
        </p>
      </div>
    </div>
  );
};

export default GuestLogin;

