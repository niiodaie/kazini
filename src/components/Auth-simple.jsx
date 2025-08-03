import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

const AuthSimple = ({ onBack, onAuthSuccess, redirectTo = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestLogin = () => {
    const guestData = {
      id: 'guest_' + Date.now(),
      displayName: 'Guest',
      plan: 'free',
      authMethod: 'guest',
      emailConfirmed: true
    };
    
    // Simulate login success
    if (onAuthSuccess) {
      onAuthSuccess(guestData, '/truth-test');
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      const userData = {
        id: 'user_' + Date.now(),
        email: formData.email,
        displayName: formData.email.split('@')[0],
        plan: 'free',
        authMethod: 'email',
        emailConfirmed: true
      };
      
      setIsLoading(false);
      if (onAuthSuccess) {
        onAuthSuccess(userData, '/truth-test');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm text-gray-500">
                🌍 New York, US
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Welcome to Kazini
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to discover emotional truth
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Continue with Email'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Guest Login */}
            <Button
              onClick={handleGuestLogin}
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50"
            >
              <User className="w-4 h-4 mr-2" />
              Continue as Guest
            </Button>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 space-x-4">
              <a href="/terms" className="hover:text-pink-500 transition-colors">
                Terms
              </a>
              <a href="/privacy" className="hover:text-pink-500 transition-colors">
                Privacy Policy
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthSimple;

