import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabase';

const MagicLinkLogin = ({ onSuccess, onError, loading, setLoading }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      setSent(true);
    } catch (error) {
      console.error('Magic link error:', error);
      setLocalError(error.message || 'Failed to send magic link. Please try again.');
      onError(error.message || 'Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setSent(false);
    setEmail('');
  };

  if (sent) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Magic link sent! Check your email and click the link to sign in.
          </AlertDescription>
        </Alert>
        
        <div className="text-center space-y-4">
          <div className="p-6 bg-gray-50 rounded-lg">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              We sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Click the link in your email to sign in instantly
            </p>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            className="w-full"
          >
            Send to Different Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {localError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-600">
            {localError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="magic-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="magic-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleInputChange}
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-gray-500">
          We'll send you a magic link for instant sign-in
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !email}
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </Button>
    </form>
  );
};

export default MagicLinkLogin;

