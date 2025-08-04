import React from 'react';
import { Button } from '../ui/button';

const GuestLogin = ({ onSuccess, onError, loading, setLoading }) => {
  const handleGuestLogin = async () => {
    setLoading(true);

    try {
      // Create a guest user session
      const guestUser = {
        id: 'guest_' + Date.now(),
        email: 'guest@kazini.app',
        user_metadata: {
          full_name: 'Guest User',
          first_name: 'Guest',
          last_name: 'User'
        },
        app_metadata: {
          provider: 'guest',
          plan: 'free'
        },
        created_at: new Date().toISOString(),
        is_guest: true
      };

      // Store guest session in localStorage
      localStorage.setItem('kazini_guest_session', JSON.stringify({
        user: guestUser,
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      onSuccess(guestUser);
    } catch (error) {
      console.error('Guest login error:', error);
      onError('Failed to start guest session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGuestLogin}
      disabled={loading}
      className="w-full flex items-center justify-center space-x-2"
    >
      <span className="text-lg">👤</span>
      <span>{loading ? 'Starting session...' : 'Continue as Guest'}</span>
    </Button>
  );
};

export default GuestLogin;

