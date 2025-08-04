import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Globe, MapPin } from 'lucide-react';

// Import modular auth components
import AuthTabs from './auth/AuthTabs';

const Auth = ({ onBack, onAuthSuccess, redirectTo = null }) => {
  const [userLocation, setUserLocation] = useState({ country: '', city: '', flag: '' });

  useEffect(() => {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="absolute left-4 top-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              {userLocation.city && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <Badge variant="secondary" className="text-xs">
                    {userLocation.flag} {userLocation.city}, {userLocation.country}
                  </Badge>
                </div>
              )}
              
              <CardTitle className="text-2xl font-bold text-gray-800">
                Sign in to discover emotional truth
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <AuthTabs 
                onBack={onBack}
                onAuthSuccess={onAuthSuccess}
              />
              
              <div className="text-center text-xs text-gray-500 space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>Global Platform • 50+ Languages</span>
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

