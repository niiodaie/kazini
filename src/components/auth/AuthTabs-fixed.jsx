import React, { useState } from 'react';
import EmailLogin from './EmailLogin';
import SignupForm from './SignupForm';
import MagicLinkLogin from './MagicLinkLogin';
import PhoneLogin from './PhoneLogin';
import GoogleOAuthButton from './GoogleOAuthButton';
import GuestLogin from './GuestLogin';

const AuthTabs = ({ onBack, onSuccess, location, language }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tabs = [
    { id: 'login', label: 'Login', icon: '🔑' },
    { id: 'signup', label: 'Sign Up', icon: '📝' },
    { id: 'magic', label: 'Magic Link', icon: '✨' },
    { id: 'phone', label: 'Phone', icon: '📱' }
  ];

  const handleSuccess = (userData) => {
    setLoading(false);
    setError('');
    if (onSuccess) {
      onSuccess(userData);
    }
  };

  const handleError = (errorMessage) => {
    setLoading(false);
    setError(errorMessage);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'login':
        return (
          <EmailLogin
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case 'magic':
        return (
          <MagicLinkLogin
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case 'phone':
        return (
          <PhoneLogin
            onSuccess={handleSuccess}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['💕', '💖', '💗', '💝'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>

        {/* Location Display */}
        {location && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">
                {location.flag} {location.city}, {location.country}
              </span>
            </div>
          </div>
        )}

        {/* Main Auth Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Sign in to discover emotional truth
            </h1>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mb-6">
            {renderTabContent()}
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Google OAuth */}
          <div className="mb-6">
            <GoogleOAuthButton
              onSuccess={handleSuccess}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
          </div>

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

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500 space-y-2">
              <div>
                <a href="/terms" className="text-blue-500 hover:text-blue-600 mr-4">Terms</a>
                <a href="/privacy" className="text-blue-500 hover:text-blue-600">Privacy Policy</a>
              </div>
              <div>
                Visnec Global – Appleton, Wisconsin
              </div>
              <div>
                📞 920-808-1188 | 📧 info@visnec.com
              </div>
              <div className="flex justify-center space-x-4">
                <a href="https://visnec.com" className="text-blue-500 hover:text-blue-600">visnec.com</a>
                <a href="https://visnec.ai" className="text-blue-500 hover:text-blue-600">visnec.ai</a>
              </div>
              <div>
                Support: support@visnec-it.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;

