import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../supabase';

const MagicLinkHandler = ({ onSuccess, onError }) => {
  const [status, setStatus] = useState(null); // null, 'processing', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        // Check if we have auth tokens in the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        // Only process if we have tokens (magic link scenario)
        if (accessToken && refreshToken) {
          setStatus('processing');
          setMessage('Processing magic link...');

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
              onSuccess(data.user, false, true); // isNewUser=false, showWelcome=true
            }, 1500);
          }
        } else {
          // Check for error in URL
          const error = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');
          
          if (error) {
            setStatus('error');
            throw new Error(errorDescription || error);
          }
          
          // No tokens and no error - not a magic link scenario
          setStatus(null);
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

  // Only render if we're actually processing a magic link
  if (status === null) {
    return null;
  }

  if (status === 'processing') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{message}</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center shadow-xl">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-green-600 text-lg">{message}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center shadow-xl">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{message}</p>
          <button 
            onClick={() => setStatus(null)}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MagicLinkHandler;

