import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Mail, Phone, Link, Chrome, UserX, Facebook, Twitter, Github } from 'lucide-react';

import EmailLogin from './EmailLogin';
import SignupForm from './SignupForm';
import PhoneLogin from './PhoneLogin';
import MagicLinkLogin from './MagicLinkLogin';
import GoogleOAuthButton from './GoogleOAuthButton';
import GuestLogin from './GuestLogin';
import PasswordReset from './PasswordReset';
import EmailVerification from './EmailVerification';

const AuthTabs = ({ onAuthSuccess, onError, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('email');
  const [isSignup, setIsSignup] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleSuccess = (userData, isNewUser = false, showWelcome = false) => {
    setError('');
    setLoading(false);
    onAuthSuccess(userData, isNewUser, showWelcome);
  };

  const handleError = (errorMessage) => {
    if (errorMessage === 'SHOW_PASSWORD_RESET') {
      setShowPasswordReset(true);
      return;
    }
    if (errorMessage === 'EMAIL_VERIFICATION_REQUIRED') {
      setShowEmailVerification(true);
      // Extract email from form data if available
      const emailInput = document.querySelector('input[type="email"]');
      if (emailInput) {
        setVerificationEmail(emailInput.value);
      }
      return;
    }
    setError(errorMessage);
    setLoading(false);
    onError(errorMessage);
  };

  const switchToSignup = () => {
    setIsSignup(true);
    setError('');
  };

  const switchToLogin = () => {
    setIsSignup(false);
    setShowPasswordReset(false);
    setShowEmailVerification(false);
    setError('');
  };

  const handlePasswordResetBack = () => {
    setShowPasswordReset(false);
    setError('');
  };

  const handleEmailVerified = (user) => {
    setShowEmailVerification(false);
    onAuthSuccess(user, true, true); // isNewUser=true, showWelcome=true
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {showEmailVerification
              ? 'Verify Your Email'
              : showPasswordReset 
                ? 'Reset Password'
                : isSignup 
                  ? 'Create Account' 
                  : 'Welcome Back'
            }
          </CardTitle>
          <CardDescription>
            {showEmailVerification
              ? 'Check your email and click the verification link to continue'
              : showPasswordReset
                ? 'Enter your email to receive a password reset link'
                : isSignup 
                  ? 'Sign up to unlock all features and save your progress'
                  : 'Sign in to your account to continue'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {showEmailVerification ? (
            <EmailVerification 
              email={verificationEmail}
              onVerified={handleEmailVerified}
              onResend={() => setError('')}
            />
          ) : showPasswordReset ? (
            <PasswordReset onBack={handlePasswordResetBack} />
          ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="email" className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Phone</span>
              </TabsTrigger>
              <TabsTrigger value="magic" className="flex items-center gap-1">
                <Link className="w-4 h-4" />
                <span className="hidden sm:inline">Magic</span>
              </TabsTrigger>
              <TabsTrigger value="google" className="flex items-center gap-1">
                <Chrome className="w-4 h-4" />
                <span className="hidden sm:inline">Google</span>
              </TabsTrigger>
              <TabsTrigger value="guest" className="flex items-center gap-1">
                <UserX className="w-4 h-4" />
                <span className="hidden sm:inline">Guest</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="email" className="space-y-4">
                {isSignup ? (
                  <SignupForm
                    onSuccess={handleSuccess}
                    onError={handleError}
                    loading={loading}
                    setLoading={setLoading}
                  />
                ) : (
                  <EmailLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    loading={loading}
                    setLoading={setLoading}
                  />
                )}
                
                <div className="text-center">
                  <button
                    onClick={isSignup ? switchToLogin : switchToSignup}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {isSignup 
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Sign up"
                    }
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="phone">
                <PhoneLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  loading={loading}
                  setLoading={setLoading}
                />
              </TabsContent>

              <TabsContent value="magic">
                <MagicLinkLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  loading={loading}
                  setLoading={setLoading}
                />
              </TabsContent>

              <TabsContent value="google">
                <GoogleOAuthButton
                  onSuccess={handleSuccess}
                  onError={handleError}
                  loading={loading}
                  setLoading={setLoading}
                />
              </TabsContent>

              <TabsContent value="guest">
                <GuestLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  loading={loading}
                  setLoading={setLoading}
                />
              </TabsContent>
            </div>
          </Tabs>
          )}

          {/* Social Login Section */}
          {!showPasswordReset && !showEmailVerification && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Twitter className="w-5 h-5 text-blue-400" />
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Github className="w-5 h-5 text-gray-800" />
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTabs;

