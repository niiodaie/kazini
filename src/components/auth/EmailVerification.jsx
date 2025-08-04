import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Mail, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '../../supabase';

const EmailVerification = ({ email, onVerified, onResend }) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'verified', 'error'

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    // Listen for auth state changes to detect verification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          setVerificationStatus('verified');
          setTimeout(() => {
            onVerified(session.user);
          }, 2000);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [onVerified]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      setResendCooldown(60); // 60 second cooldown
      onResend && onResend();
    } catch (error) {
      console.error('Resend verification error:', error);
      setVerificationStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  if (verificationStatus === 'verified') {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Email Verified!</h3>
        <p className="text-gray-600">
          Your email has been successfully verified. Redirecting you to the app...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <Mail className="w-16 h-16 text-blue-500" />
          <div className="absolute -top-1 -right-1">
            <Clock className="w-6 h-6 text-orange-500 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">Check Your Email</h3>
        <p className="text-gray-600">
          We've sent a verification link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Click the link in the email to verify your account and complete the signup process.
        </p>
      </div>

      {verificationStatus === 'error' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-600">
            Failed to resend verification email. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or request a new one.
        </p>
        
        <Button
          onClick={handleResendVerification}
          disabled={isResending || resendCooldown > 0}
          variant="outline"
          className="w-full"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            `Resend in ${resendCooldown}s`
          ) : (
            'Resend Verification Email'
          )}
        </Button>
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <p>Having trouble? Make sure to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Check your spam/junk folder</li>
          <li>Add noreply@kazini.com to your contacts</li>
          <li>Wait a few minutes for the email to arrive</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailVerification;

