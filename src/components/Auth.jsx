import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Globe, MapPin } from 'lucide-react';

// Import modular auth components
import AuthTabs from './auth/AuthTabs';
import MagicLinkHandler from './auth/MagicLinkHandler';

const Auth = ({ onBack, onAuthSuccess, redirectTo = null }) => {
  const [userLocation, setUserLocation] = useState({ country: '', city: '', flag: '' });
  const [isMagicLinkFlow, setIsMagicLinkFlow] = useState(false);

  useEffect(() => {
    // Check if this is a magic link callback
    const hash = window.location.hash;
    if (hash.includes('access_token') || hash.includes('type=magiclink')) {
      setIsMagicLinkFlow(true);
    }

    // Detect user location
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserLocation({ 
          country: data.country_name || 'United States', 
          city: data.city || 'New York',
          flag: data.country_code ? `https://flagcdn.com/16x12/${data.country_code.toLowerCase()}.png` : '🇺🇸'
        });
      } catch (error) {
        console.error('Location detection failed:', error);
        setUserLocation({ country: 'United States', city: 'New York', flag: '🇺🇸' });
      }
    };
    detectLocation();
  }, []);

  const handleAuthSuccess = (userData, isNewUser = false, showWelcome = false) => {
    onAuthSuccess(userData, isNewUser, showWelcome);
  };

  const handleAuthError = (error) => {
    console.error('Auth error:', error);
  };

  const handleMagicLinkSuccess = (userData) => {
    setIsMagicLinkFlow(false);
    handleAuthSuccess(userData, false, false);
  };

  const handleMagicLinkError = (error) => {
    setIsMagicLinkFlow(false);
    handleAuthError(error);
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

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Kazini
            </span>
          </h1>
          <p className="text-gray-600">Discover emotional truth in your relationships</p>
          
          {/* Location Badge */}
          {userLocation.country && (
            <div className="flex items-center justify-center mt-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                {userLocation.flag && (
                  <img 
                    src={userLocation.flag} 
                    alt={userLocation.country}
                    className="w-4 h-3"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <span className="text-xs">
                  {userLocation.city}, {userLocation.country}
                </span>
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Auth Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isMagicLinkFlow ? (
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle>Processing Magic Link</CardTitle>
              </CardHeader>
              <CardContent>
                <MagicLinkHandler
                  onSuccess={handleMagicLinkSuccess}
                  onError={handleMagicLinkError}
                />
              </CardContent>
            </Card>
          ) : (
            <AuthTabs
              onAuthSuccess={handleAuthSuccess}
              onError={handleAuthError}
              onBack={onBack}
            />
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

