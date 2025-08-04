import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Mail, Phone, Link, Chrome, UserX } from 'lucide-react';

import EmailLogin from './EmailLogin';
import SignupForm from './SignupForm';
import PhoneLogin from './PhoneLogin';
import MagicLinkLogin from './MagicLinkLogin';
import GoogleOAuthButton from './GoogleOAuthButton';
import GuestLogin from './GuestLogin';

const AuthTabs = ({ onAuthSuccess, onError, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('email');
  const [isSignup, setIsSignup] = useState(false);

  const handleSuccess = (userData, isNewUser = false, showWelcome = false) => {
    setError('');
    setLoading(false);
    onAuthSuccess(userData, isNewUser, showWelcome);
  };

  const handleError = (errorMessage) => {
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
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSignup 
              ? 'Sign up to unlock all features and save your progress'
              : 'Sign in to your account to continue'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
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

