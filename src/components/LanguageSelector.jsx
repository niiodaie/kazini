import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

const LanguageSelector = ({ className = '' }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    // Here you would typically update the app's language context
    // For now, we'll just store it in localStorage
    localStorage.setItem('kazini_language', language.code);
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: language.code } 
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-2 hover:bg-white/20 ${className}`}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{selectedLanguage.flag}</span>
          <span className="hidden md:inline">{selectedLanguage.name}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`flex items-center gap-3 cursor-pointer ${
              selectedLanguage.code === language.code ? 'bg-gray-100' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {selectedLanguage.code === language.code && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;

