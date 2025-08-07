import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const AuthCallback = ({ onSuccess, onError }) => {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session after magic link redirect
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session && session.user) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Call the success handler with user data
          setTimeout(() => {
            onSuccess(session.user, false, false);
          }, 1500);
        } else {
          // Check if there are auth tokens in the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken) {
            // Set the session using the tokens from URL
            const { data: { session: newSession }, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (sessionError) {
              throw sessionError;
            }
            
            if (newSession && newSession.user) {
              setStatus('success');
              setMessage('Authentication successful! Redirecting...');
              
              setTimeout(() => {
                onSuccess(newSession.user, false, false);
              }, 1500);
            } else {
              throw new Error('Failed to establish session');
            }
          } else {
            throw new Error('No authentication tokens found');
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed. Please try again.');
        
        // Call error handler after a delay
        setTimeout(() => {
          onError(error.message || 'Authentication failed');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [onSuccess, onError]);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Authentication</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-800 mb-2">Authentication Successful!</h2>
            <p className="text-green-600">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Failed</h2>
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertDescription className="text-red-600">
                {message}
              </AlertDescription>
            </Alert>
            <Button onClick={handleReturnHome} className="w-full">
              Return to Home
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

