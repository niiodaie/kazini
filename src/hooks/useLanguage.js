import { useState, useEffect } from 'react';

// Translation dictionary
const translations = {
  en: {
    // Auth translations
    'auth.welcome': 'Welcome to Kazini',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.magic': 'Magic Link',
    'auth.phone': 'Phone',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.phoneNumber': 'Phone Number',
    'auth.verificationCode': 'Verification Code',
    'auth.continueWithEmail': 'Continue with Email',
    'auth.createAccount': 'Create Account',
    'auth.sendVerificationCode': 'Send Verification Code',
    'auth.verifyCode': 'Verify Code',
    'auth.sendMagicLink': 'Send Magic Link',
    'auth.signingIn': 'Signing In...',
    'auth.creatingAccount': 'Creating Account...',
    'auth.sendingCode': 'Sending Code...',
    'auth.verifying': 'Verifying...',
    'auth.sendingLink': 'Sending Link...',
    
    // Error messages
    'error.emailRequired': 'Email is required',
    'error.invalidEmail': 'Please enter a valid email',
    'error.passwordRequired': 'Password is required',
    'error.passwordTooShort': 'Password must be at least 6 characters',
    'error.passwordsNoMatch': 'Passwords do not match',
    'error.firstNameRequired': 'First name is required',
    'error.lastNameRequired': 'Last name is required',
    'error.phoneRequired': 'Phone number is required',
    'error.otpRequired': 'Verification code is required',
    'error.termsRequired': 'You must accept the terms and conditions',
    
    // Success messages
    'success.accountCreated': 'Account created successfully! Please check your email to verify your account.',
    'success.magicLinkSent': 'Magic link sent! Check your email and click the link to sign in.',
    'success.otpSent': 'Verification code sent to your phone!',
    'success.emailVerificationSent': 'Verification email sent! Please check your inbox.',
    
    // General
    'general.terms': 'Terms',
    'general.privacy': 'Privacy Policy',
    'general.guest': 'Guest',
    'general.google': 'Google',
    'general.resendCode': 'Resend Code',
    'general.resendIn': 'Resend in',
    'general.verified': 'Verified',
    'general.loading': 'Loading...',
  },
  
  fr: {
    // Auth translations
    'auth.welcome': 'Bienvenue sur Kazini',
    'auth.login': 'Connexion',
    'auth.signup': 'S\'inscrire',
    'auth.magic': 'Lien Magique',
    'auth.phone': 'Téléphone',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom',
    'auth.phoneNumber': 'Numéro de téléphone',
    'auth.verificationCode': 'Code de vérification',
    'auth.continueWithEmail': 'Continuer avec l\'email',
    'auth.createAccount': 'Créer un compte',
    'auth.sendVerificationCode': 'Envoyer le code',
    'auth.verifyCode': 'Vérifier le code',
    'auth.sendMagicLink': 'Envoyer le lien',
    'auth.signingIn': 'Connexion...',
    'auth.creatingAccount': 'Création du compte...',
    'auth.sendingCode': 'Envoi du code...',
    'auth.verifying': 'Vérification...',
    'auth.sendingLink': 'Envoi du lien...',
    
    // Error messages
    'error.emailRequired': 'L\'email est requis',
    'error.invalidEmail': 'Veuillez entrer un email valide',
    'error.passwordRequired': 'Le mot de passe est requis',
    'error.passwordTooShort': 'Le mot de passe doit contenir au moins 6 caractères',
    'error.passwordsNoMatch': 'Les mots de passe ne correspondent pas',
    'error.firstNameRequired': 'Le prénom est requis',
    'error.lastNameRequired': 'Le nom est requis',
    'error.phoneRequired': 'Le numéro de téléphone est requis',
    'error.otpRequired': 'Le code de vérification est requis',
    'error.termsRequired': 'Vous devez accepter les conditions d\'utilisation',
    
    // Success messages
    'success.accountCreated': 'Compte créé avec succès ! Veuillez vérifier votre email.',
    'success.magicLinkSent': 'Lien magique envoyé ! Vérifiez votre email.',
    'success.otpSent': 'Code de vérification envoyé !',
    'success.emailVerificationSent': 'Email de vérification envoyé !',
    
    // General
    'general.terms': 'Conditions',
    'general.privacy': 'Politique de confidentialité',
    'general.guest': 'Invité',
    'general.google': 'Google',
    'general.resendCode': 'Renvoyer le code',
    'general.resendIn': 'Renvoyer dans',
    'general.verified': 'Vérifié',
    'general.loading': 'Chargement...',
  },
  
  es: {
    // Auth translations
    'auth.welcome': 'Bienvenido a Kazini',
    'auth.login': 'Iniciar sesión',
    'auth.signup': 'Registrarse',
    'auth.magic': 'Enlace Mágico',
    'auth.phone': 'Teléfono',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.firstName': 'Nombre',
    'auth.lastName': 'Apellido',
    'auth.phoneNumber': 'Número de teléfono',
    'auth.verificationCode': 'Código de verificación',
    'auth.continueWithEmail': 'Continuar con email',
    'auth.createAccount': 'Crear cuenta',
    'auth.sendVerificationCode': 'Enviar código',
    'auth.verifyCode': 'Verificar código',
    'auth.sendMagicLink': 'Enviar enlace',
    'auth.signingIn': 'Iniciando sesión...',
    'auth.creatingAccount': 'Creando cuenta...',
    'auth.sendingCode': 'Enviando código...',
    'auth.verifying': 'Verificando...',
    'auth.sendingLink': 'Enviando enlace...',
    
    // Error messages
    'error.emailRequired': 'El email es requerido',
    'error.invalidEmail': 'Por favor ingrese un email válido',
    'error.passwordRequired': 'La contraseña es requerida',
    'error.passwordTooShort': 'La contraseña debe tener al menos 6 caracteres',
    'error.passwordsNoMatch': 'Las contraseñas no coinciden',
    'error.firstNameRequired': 'El nombre es requerido',
    'error.lastNameRequired': 'El apellido es requerido',
    'error.phoneRequired': 'El número de teléfono es requerido',
    'error.otpRequired': 'El código de verificación es requerido',
    'error.termsRequired': 'Debe aceptar los términos y condiciones',
    
    // Success messages
    'success.accountCreated': '¡Cuenta creada exitosamente! Verifique su email.',
    'success.magicLinkSent': '¡Enlace mágico enviado! Revise su email.',
    'success.otpSent': '¡Código de verificación enviado!',
    'success.emailVerificationSent': '¡Email de verificación enviado!',
    
    // General
    'general.terms': 'Términos',
    'general.privacy': 'Política de privacidad',
    'general.guest': 'Invitado',
    'general.google': 'Google',
    'general.resendCode': 'Reenviar código',
    'general.resendIn': 'Reenviar en',
    'general.verified': 'Verificado',
    'general.loading': 'Cargando...',
  }
};

/**
 * Custom hook for language detection and translation
 */
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [detectedLanguage, setDetectedLanguage] = useState('en');

  // Detect browser language on mount
  useEffect(() => {
    const detectLanguage = () => {
      try {
        // Get browser language
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        
        // Extract language code (e.g., 'en-US' -> 'en')
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        // Check if we support this language
        const supportedLanguage = translations[langCode] ? langCode : 'en';
        
        setDetectedLanguage(supportedLanguage);
        setCurrentLanguage(supportedLanguage);
        
        // Store in localStorage for persistence
        localStorage.setItem('kazini_language', supportedLanguage);
        
        console.log('Detected language:', browserLang, '-> Using:', supportedLanguage);
      } catch (error) {
        console.error('Language detection failed:', error);
        setDetectedLanguage('en');
        setCurrentLanguage('en');
      }
    };

    // Check for saved language preference first
    const savedLanguage = localStorage.getItem('kazini_language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
      setDetectedLanguage(savedLanguage);
    } else {
      detectLanguage();
    }
  }, []);

  // Translation function
  const t = (key, fallback = key) => {
    try {
      const translation = translations[currentLanguage]?.[key];
      return translation || translations['en']?.[key] || fallback;
    } catch (error) {
      console.error('Translation error for key:', key, error);
      return fallback;
    }
  };

  // Change language
  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem('kazini_language', langCode);
    } else {
      console.warn('Unsupported language:', langCode);
    }
  };

  // Get available languages
  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' }
    ];
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    const languages = getAvailableLanguages();
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return {
    currentLanguage,
    detectedLanguage,
    t,
    changeLanguage,
    getAvailableLanguages,
    getCurrentLanguageInfo,
    isSupported: (langCode) => !!translations[langCode]
  };
};

