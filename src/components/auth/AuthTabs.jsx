import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

// Import all auth components
import EmailLogin from './EmailLogin';
import SignupForm from './SignupForm';
import PhoneLogin from './PhoneLogin';
import MagicLinkLogin from './MagicLinkLogin';
import GoogleOAuthButton from './GoogleOAuthButton';
import GuestLogin from './GuestLogin';

const AuthTabs = ({ onBack, onSuccess, onError, location, language = 'en' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Translation dictionary
  const translations = {
    en: {
      title: 'Welcome to Kazini',
      subtitle: 'Sign in to discover emotional truth',
      login: 'Login',
      signup: 'Sign Up',
      magicLink: 'Magic Link',
      phone: 'Phone',
      or: 'or',
      back: 'Back'
    },
    fr: {
      title: 'Bienvenue à Kazini',
      subtitle: 'Connectez-vous pour découvrir la vérité émotionnelle',
      login: 'Connexion',
      signup: 'Inscription',
      magicLink: 'Lien Magique',
      phone: 'Téléphone',
      or: 'ou',
      back: 'Retour'
    },
    es: {
      title: 'Bienvenido a Kazini',
      subtitle: 'Inicia sesión para descubrir la verdad emocional',
      login: 'Iniciar Sesión',
      signup: 'Registrarse',
      magicLink: 'Enlace Mágico',
      phone: 'Teléfono',
      or: 'o',
      back: 'Atrás'
    }
  };

  const t = (key) => translations[language]?.[key] || translations.en[key];

  const handleAuthSuccess = (userData) => {
    setIsLoading(false);
    if (onSuccess) {
      onSuccess(userData);
    }
  };

  const handleAuthError = (error) => {
    setIsLoading(false);
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
        )}

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-2">
            {/* Location Display */}
            {location && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                <span>{location.flag}</span>
                <span>{location.city}, {location.country}</span>
              </div>
            )}

            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t('subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="login" className="text-xs">
                  {t('login')}
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-xs">
                  {t('signup')}
                </TabsTrigger>
                <TabsTrigger value="magic" className="text-xs">
                  {t('magicLink')}
                </TabsTrigger>
                <TabsTrigger value="phone" className="text-xs">
                  {t('phone')}
                </TabsTrigger>
              </TabsList>

              {/* Email Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <EmailLogin
                  onSuccess={handleAuthSuccess}
                  onError={handleAuthError}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4">
                <SignupForm
                  onSuccess={handleAuthSuccess}
                  onError={handleAuthError}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </TabsContent>

              {/* Magic Link Tab */}
              <TabsContent value="magic" className="space-y-4">
                <MagicLinkLogin
                  onSuccess={handleAuthSuccess}
                  onError={handleAuthError}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </TabsContent>

              {/* Phone Tab */}
              <TabsContent value="phone" className="space-y-4">
                <PhoneLogin
                  onSuccess={handleAuthSuccess}
                  onError={handleAuthError}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </TabsContent>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('or')}</span>
                </div>
              </div>

              {/* Google OAuth */}
              <GoogleOAuthButton
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />

              {/* Guest Login */}
              <GuestLogin
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </Tabs>

            {/* Footer Links */}
            <div className="mt-6 text-center space-x-4 text-sm">
              <a
                href="/terms"
                className="text-gray-500 hover:text-gray-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="text-gray-500 hover:text-gray-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="space-y-1">
            <p className="font-medium">Visnec Global – Appleton, Wisconsin</p>
            <p>📞 920-808-1188 | ✉️ info@visnec.com</p>
            <div className="space-x-2">
              <a href="https://visnec.com" className="hover:text-gray-700 underline">visnec.com</a>
              <span>|</span>
              <a href="https://visnec.ai" className="hover:text-gray-700 underline">visnec.ai</a>
            </div>
            <p>Support: support@visnec-it.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;

