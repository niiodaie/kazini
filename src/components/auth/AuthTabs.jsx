import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import EmailLogin from './EmailLogin';
import SignupForm from './SignupForm';
import PhoneLogin from './PhoneLogin';
import MagicLinkLogin from './MagicLinkLogin';
import GoogleOAuthButton from './GoogleOAuthButton';
import GuestLogin from './GuestLogin';
import MagicLinkHandler from './MagicLinkHandler';

const AuthTabs = ({ onBack, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMagicLinkHandler, setShowMagicLinkHandler] = useState(false);

  // Check if we have magic link tokens in URL
  React.useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    if (accessToken) {
      setShowMagicLinkHandler(true);
    }
  }, []);

  const handleSuccess = (user) => {
    setLoading(false);
    setError('');
    onAuthSuccess(user);
  };

  const handleError = (errorMessage) => {
    setLoading(false);
    setError(errorMessage);
  };

  if (showMagicLinkHandler) {
    return (
      <div className="space-y-4">
        <MagicLinkHandler
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="magic">Magic Link</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <EmailLogin
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <SignupForm
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        </TabsContent>

        <TabsContent value="magic" className="space-y-4">
          <MagicLinkLogin
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        </TabsContent>

        <TabsContent value="phone" className="space-y-4">
          <PhoneLogin
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Google OAuth */}
      <GoogleOAuthButton
        onSuccess={handleSuccess}
        onError={handleError}
        loading={loading}
        setLoading={setLoading}
      />

      {/* Guest Login Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">ℹ️</span>
            <span className="font-semibold text-gray-800">Guest Access Features:</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1 ml-6">
            <li>• Try basic truth detection features</li>
            <li>• Limited to free plan features</li>
            <li>• Session expires after 24 hours</li>
            <li>• Create an account to save your progress</li>
          </ul>
        </div>
        
        <GuestLogin
          onSuccess={handleSuccess}
          onError={handleError}
          loading={loading}
          setLoading={setLoading}
        />
        
        <p className="text-center text-sm text-gray-500 mt-4">
          <span className="mr-2">👤</span>
          No account required • Try Kazini risk-free
        </p>
      </div>
    </div>
  );
};

export default AuthTabs;

