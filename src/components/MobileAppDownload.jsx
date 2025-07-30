import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Smartphone, 
  Download, 
  MessageSquare, 
  Apple, 
  Play,
  X,
  Check,
  Send
} from 'lucide-react';
import { sendMobileAppSMS } from '../utils/authUtils';

const MobileAppDownload = ({ onClose }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendSMS = async () => {
    if (!phone.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await sendMobileAppSMS(phone);
      setIsSent(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to send SMS. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    setError('');
  };

  if (isSent) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        >
          <Card className="border-0 shadow-none">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SMS Sent Successfully!</h3>
              <p className="text-gray-600 text-sm">
                Check your phone for download links to the Kazini mobile app.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardTitle className="text-xl mb-2">Download Kazini Mobile</CardTitle>
            <p className="text-gray-600 text-sm">
              Get the full Kazini experience on your mobile device
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Direct Download Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Download directly:</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-12"
                  onClick={() => window.open('https://apps.apple.com/app/kazini', '_blank')}
                >
                  <Apple className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-12"
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=com.kazini.app', '_blank')}
                >
                  <Play className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* SMS Option */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <h4 className="font-semibold text-sm text-gray-700">Or send links via SMS:</h4>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={14}
                    className={error ? 'border-red-300' : ''}
                  />
                  {error && (
                    <p className="text-red-500 text-xs">{error}</p>
                  )}
                </div>

                <Button
                  onClick={handleSendSMS}
                  disabled={isLoading || !phone.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Download Links
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Mobile app features:</h4>
              <ul className="space-y-1">
                {[
                  'Real-time truth testing',
                  'Couple mode synchronization',
                  'Push notifications',
                  'Offline result viewing'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Standard messaging rates may apply for SMS
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MobileAppDownload;

