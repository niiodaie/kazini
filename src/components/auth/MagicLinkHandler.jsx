import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../supabase';

const MagicLinkHandler = ({ onSuccess, onError }) => {
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        // Check if we have auth tokens in the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            setStatus('success');
            setMessage('Successfully signed in with magic link!');
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Call success callback
            setTimeout(() => {
              onSuccess(data.user);
            }, 1500);
          }
        } else {
          // Check for error in URL
          const error = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');
          
          if (error) {
            throw new Error(errorDescription || error);
          }
        }
      } catch (error) {
        console.error('Magic link handling error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to process magic link');
        onError(error.message || 'Failed to process magic link');
      }
    };

    handleMagicLink();
  }, [onSuccess, onError]);

  if (status === 'processing') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing magic link...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-600">
          {message}
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'error') {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-600">
          {message}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default MagicLinkHandler;

