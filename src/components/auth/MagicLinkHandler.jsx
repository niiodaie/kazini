import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../../supabase';

const MagicLinkHandler = ({ onSuccess, onError }) => {
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        // Check if we have a hash with tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        // Check if we have URL params (alternative format)
        const urlParams = new URLSearchParams(window.location.search);
        const urlAccessToken = urlParams.get('access_token');
        const urlRefreshToken = urlParams.get('refresh_token');
        const urlType = urlParams.get('type');

        const token = accessToken || urlAccessToken;
        const refresh = refreshToken || urlRefreshToken;
        const authType = type || urlType;

        if (!token || authType !== 'magiclink') {
          // Not a magic link, skip processing
          setStatus('idle');
          return;
        }

        setStatus('processing');
        setMessage('Processing magic link...');

        // Get session from URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Magic link session error:', error);
          setStatus('error');
          setMessage('Failed to process magic link. Please try again.');
          if (onError) onError('Failed to process magic link');
          return;
        }

        if (data.session && data.session.user) {
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email,
            displayName: data.session.user.user_metadata?.full_name || data.session.user.email.split('@')[0],
            plan: data.session.user.user_metadata?.plan || 'free',
            authMethod: 'magic_link',
            emailConfirmed: true, // Magic link confirms email
            session: data.session
          };

          setStatus('success');
          setMessage('Magic link verified successfully! Redirecting...');

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);

          // Call success callback
          if (onSuccess) {
            setTimeout(() => {
              onSuccess(userData);
            }, 1500);
          }
        } else {
          // Try to exchange the token manually
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refresh
          });

          if (sessionError) {
            console.error('Magic link token exchange error:', sessionError);
            setStatus('error');
            setMessage('Invalid or expired magic link. Please request a new one.');
            if (onError) onError('Invalid or expired magic link');
            return;
          }

          if (sessionData.session && sessionData.session.user) {
            const userData = {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email,
              displayName: sessionData.session.user.user_metadata?.full_name || sessionData.session.user.email.split('@')[0],
              plan: sessionData.session.user.user_metadata?.plan || 'free',
              authMethod: 'magic_link',
              emailConfirmed: true,
              session: sessionData.session
            };

            setStatus('success');
            setMessage('Magic link verified successfully! Redirecting...');

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // Call success callback
            if (onSuccess) {
              setTimeout(() => {
                onSuccess(userData);
              }, 1500);
            }
          } else {
            setStatus('error');
            setMessage('Failed to authenticate with magic link. Please try again.');
            if (onError) onError('Failed to authenticate with magic link');
          }
        }
      } catch (err) {
        console.error('Magic link handler error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        if (onError) onError('An unexpected error occurred');
      }
    };

    // Only run if we're on the client side
    if (typeof window !== 'undefined') {
      handleMagicLink();
    }
  }, [onSuccess, onError]);

  // Don't render anything if we're not processing a magic link
  if (status === 'idle') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {status === 'processing' && (
          <Alert className="border-blue-200 bg-blue-50">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center space-x-2">
                <span>{message}</span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default MagicLinkHandler;

