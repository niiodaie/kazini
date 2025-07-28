import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Globe, 
  Clock, 
  MapPin, 
  Languages, 
  ArrowLeft,
  Check,
  Palette,
  Volume2,
  Moon,
  Sun
} from 'lucide-react';

const GlobalSettings = ({ onBack, user, onSettingsUpdate }) => {
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    theme: 'auto',
    culturalContext: 'western',
    voiceLanguage: 'en-US',
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user's saved settings
    const savedSettings = localStorage.getItem('kazini_global_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
    { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
    { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', native: 'Русский' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', native: '한국어' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' }
  ];

  const timezones = [
    { value: 'UTC-12', label: 'Baker Island Time (UTC-12)' },
    { value: 'UTC-11', label: 'Hawaii Standard Time (UTC-11)' },
    { value: 'UTC-10', label: 'Alaska Standard Time (UTC-10)' },
    { value: 'UTC-9', label: 'Pacific Standard Time (UTC-9)' },
    { value: 'UTC-8', label: 'Pacific Standard Time (UTC-8)' },
    { value: 'UTC-7', label: 'Mountain Standard Time (UTC-7)' },
    { value: 'UTC-6', label: 'Central Standard Time (UTC-6)' },
    { value: 'UTC-5', label: 'Eastern Standard Time (UTC-5)' },
    { value: 'UTC-4', label: 'Atlantic Standard Time (UTC-4)' },
    { value: 'UTC-3', label: 'Argentina Time (UTC-3)' },
    { value: 'UTC-2', label: 'South Georgia Time (UTC-2)' },
    { value: 'UTC-1', label: 'Azores Time (UTC-1)' },
    { value: 'UTC+0', label: 'Greenwich Mean Time (UTC+0)' },
    { value: 'UTC+1', label: 'Central European Time (UTC+1)' },
    { value: 'UTC+2', label: 'Eastern European Time (UTC+2)' },
    { value: 'UTC+3', label: 'Moscow Time (UTC+3)' },
    { value: 'UTC+4', label: 'Gulf Standard Time (UTC+4)' },
    { value: 'UTC+5', label: 'Pakistan Standard Time (UTC+5)' },
    { value: 'UTC+6', label: 'Bangladesh Standard Time (UTC+6)' },
    { value: 'UTC+7', label: 'Indochina Time (UTC+7)' },
    { value: 'UTC+8', label: 'China Standard Time (UTC+8)' },
    { value: 'UTC+9', label: 'Japan Standard Time (UTC+9)' },
    { value: 'UTC+10', label: 'Australian Eastern Time (UTC+10)' },
    { value: 'UTC+11', label: 'Solomon Islands Time (UTC+11)' },
    { value: 'UTC+12', label: 'New Zealand Standard Time (UTC+12)' }
  ];

  const culturalContexts = [
    { value: 'western', label: 'Western', description: 'Direct communication, individualistic' },
    { value: 'eastern', label: 'Eastern', description: 'Indirect communication, collectivistic' },
    { value: 'latin', label: 'Latin American', description: 'Expressive, relationship-focused' },
    { value: 'middle_eastern', label: 'Middle Eastern', description: 'Respectful, family-oriented' },
    { value: 'african', label: 'African', description: 'Community-centered, storytelling' },
    { value: 'nordic', label: 'Nordic', description: 'Egalitarian, consensus-building' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Save settings to localStorage
      localStorage.setItem('kazini_global_settings', JSON.stringify(settings));
      
      // In real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSettingsUpdate) {
        onSettingsUpdate(settings);
      }
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateAccessibility = (key, value) => {
    setSettings(prev => ({
      ...prev,
      accessibility: { ...prev.accessibility, [key]: value }
    }));
  };

  return (
    <div className="min-h-screen romantic-bg">
      {/* Floating emotional motifs */}
      <div className="emotional-motifs">
        <div className="motif">💔</div>
        <div className="motif">💑</div>
        <div className="motif">💬</div>
        <div className="motif">💍</div>
        <div className="motif">❤️</div>
        <div className="motif">💕</div>
      </div>
      
      {/* Dynamic light movement */}
      <div className="light-movement"></div>

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Badge className="bg-white/20 text-white border-white/30">
              <Globe className="w-3 h-3 mr-1" />
              Global Ready
            </Badge>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Globe className="w-6 h-6" />
                  Global Settings
                </CardTitle>
                <p className="text-gray-600">
                  Customize Kazini for your language, culture, and preferences
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Language Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Language & Localization
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => updateSetting('language', lang.code)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          settings.language === lang.code
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{lang.flag}</span>
                          <div className="text-left">
                            <div className="font-medium text-sm">{lang.name}</div>
                            <div className="text-xs text-gray-500">{lang.native}</div>
                          </div>
                          {settings.language === lang.code && (
                            <Check className="w-4 h-4 text-purple-500 ml-auto" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timezone Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Time & Date
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Format</label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) => updateSetting('dateFormat', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                        <option value="DD.MM.YYYY">DD.MM.YYYY (German)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time Format</label>
                      <select
                        value={settings.timeFormat}
                        onChange={(e) => updateSetting('timeFormat', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="12h">12-hour (AM/PM)</option>
                        <option value="24h">24-hour</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => updateSetting('currency', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CNY">CNY (¥)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="AUD">AUD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cultural Context */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Cultural Context
                  </h3>
                  <p className="text-sm text-gray-600">
                    This helps our AI understand cultural communication patterns for more accurate analysis.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    {culturalContexts.map((context) => (
                      <button
                        key={context.value}
                        onClick={() => updateSetting('culturalContext', context.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          settings.culturalContext === context.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{context.label}</div>
                            <div className="text-sm text-gray-500 mt-1">{context.description}</div>
                          </div>
                          {settings.culturalContext === context.value && (
                            <Check className="w-4 h-4 text-purple-500 mt-1" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme & Appearance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme & Appearance
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                      { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                      { value: 'auto', label: 'Auto', icon: <Globe className="w-4 h-4" /> }
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => updateSetting('theme', theme.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          settings.theme === theme.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {theme.icon}
                          <span className="text-sm font-medium">{theme.label}</span>
                          {settings.theme === theme.value && (
                            <Check className="w-4 h-4 text-purple-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice & Audio */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Voice & Audio
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Voice Language</label>
                    <select
                      value={settings.voiceLanguage}
                      onChange={(e) => updateSetting('voiceLanguage', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es-ES">Spanish (Spain)</option>
                      <option value="es-MX">Spanish (Mexico)</option>
                      <option value="fr-FR">French (France)</option>
                      <option value="de-DE">German (Germany)</option>
                      <option value="it-IT">Italian (Italy)</option>
                      <option value="pt-BR">Portuguese (Brazil)</option>
                      <option value="ru-RU">Russian (Russia)</option>
                      <option value="zh-CN">Chinese (Mandarin)</option>
                      <option value="ja-JP">Japanese (Japan)</option>
                      <option value="ko-KR">Korean (Korea)</option>
                    </select>
                  </div>
                </div>

                {/* Accessibility */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Accessibility</h3>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'highContrast', label: 'High Contrast Mode', description: 'Increase contrast for better visibility' },
                      { key: 'largeText', label: 'Large Text', description: 'Increase font size throughout the app' },
                      { key: 'reducedMotion', label: 'Reduced Motion', description: 'Minimize animations and transitions' }
                    ].map((option) => (
                      <div key={option.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.accessibility[option.key]}
                          onChange={(e) => updateAccessibility(option.key, e.target.checked)}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving Settings...
                      </div>
                    ) : (
                      'Save Global Settings'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;

