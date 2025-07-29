import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Link, ArrowLeft, Zap, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const CoupleModeSelector = ({ onBack, onNavigate, user }) => {
  const handleModeSelect = (mode) => {
    if (mode === 'live') {
      onNavigate('couple-live');
    } else if (mode === 'async') {
      onNavigate('couple-async');
    }
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
        <div className="max-w-4xl mx-auto pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-3 h-3 mr-1" />
              Couple Mode
            </Badge>
          </div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your
              <span className="block text-yellow-300">Truth Journey</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Discover emotional authenticity together. Choose how you and your partner want to explore truth.
            </p>
          </motion.div>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Live Mode */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => handleModeSelect('live')}
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl h-full hover:shadow-3xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Live Mode
                  </CardTitle>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    Real-time Together
                  </Badge>
                </CardHeader>
                
                <CardContent className="p-6 pt-0">
                  <p className="text-gray-600 mb-6 text-center">
                    Both partners online at the same time for immediate truth testing and real-time emotional analysis.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Instant feedback and results</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Live emotional analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Shared room with unique code</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Perfect for deep conversations</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                    onClick={() => handleModeSelect('live')}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Start Live Session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Async Mode */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => handleModeSelect('async')}
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl h-full hover:shadow-3xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Async Mode
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    At Your Own Pace
                  </Badge>
                </CardHeader>
                
                <CardContent className="p-6 pt-0">
                  <p className="text-gray-600 mb-6 text-center">
                    Create a shareable link for your partner to answer questions at their convenience, perfect for busy schedules.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Flexible timing for both partners</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Shareable session links</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Thoughtful, considered responses</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Great for long-distance couples</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    onClick={() => handleModeSelect('async')}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Create Async Session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-white/60 text-sm">
              Both modes use advanced AI to analyze emotional authenticity and provide insights for deeper connections.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoupleModeSelector;

