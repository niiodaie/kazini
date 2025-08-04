import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Users, Shield, Star, ArrowRight, Play, MessageCircle, TrendingUp, User, Camera, Calendar, Hash, Sparkles } from 'lucide-react';

import coupleIllustration from '../assets/couple-illustration.jpg';
import romanticCouple from '../assets/romantic-couple.jpg';

const EnhancedHero = ({ 
  handleTruthTest, 
  handleGoLive, 
  handleCoupleMode, 
  handleAIScheduler, 
  handleTruthCircle 
}) => {
  return (
    <div className="relative z-10 container mx-auto px-6 py-20">
      {/* Floating couple silhouettes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-10 w-32 h-32 opacity-10"
        >
          <img 
            src={coupleIllustration} 
            alt="Couple illustration" 
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-10 w-24 h-24 opacity-10"
        >
          <img 
            src={romanticCouple} 
            alt="Romantic couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
      </div>

      <div className="text-center max-w-6xl mx-auto">
        {/* Enhanced Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-4"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-bold text-gray-800">
              Discover{' '}
              <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Emotional Truth
              </span>
            </h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-blue-400 to-pink-500 rounded-full flex items-center justify-center ml-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl text-gray-600 mb-4 leading-relaxed"
          >
            AI-powered relationship insights for{' '}
            <span className="font-semibold text-pink-600">couples</span> who value{' '}
            <span className="font-semibold text-purple-600">authentic connections</span>
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-gray-500 mb-12"
          >
            Build deeper trust, improve communication, and strengthen your bond through emotional truth detection
          </motion.p>
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 max-w-4xl mx-auto"
        >
          {/* Primary CTA - Couple Mode */}
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCoupleMode}
            className="col-span-1 sm:col-span-2 lg:col-span-1 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white px-8 py-6 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Users className="w-6 h-6" />
            </motion.div>
            <span>Start Couple Mode</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
          </motion.button>

          {/* Secondary CTAs */}
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTruthTest}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Truth Test
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoLive}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 relative"
          >
            <Camera className="w-5 h-5" />
            Go Live
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"
            />
          </motion.button>
        </motion.div>

        {/* Additional Feature Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleAIScheduler}
            className="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 border border-gray-200"
          >
            <Calendar className="w-4 h-4 text-blue-500" />
            AI Scheduler
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleTruthCircle}
            className="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 border border-gray-200"
          >
            <Hash className="w-4 h-4 text-orange-500" />
            Truth Circle
          </motion.button>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
            <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-6 relative z-10" />
            <h3 className="text-2xl font-bold mb-4 text-gray-800">AI-Powered Analysis</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced algorithms detect emotional patterns and authenticity in real-time conversations between couples
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-purple-400 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
            <Users className="w-16 h-16 text-purple-500 mx-auto mb-6 relative z-10" />
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Couple Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Build stronger relationships through mutual understanding, transparent communication, and shared growth
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-green-400 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
            <Shield className="w-16 h-16 text-green-500 mx-auto mb-6 relative z-10" />
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Privacy First</h3>
            <p className="text-gray-600 leading-relaxed">
              Your intimate conversations are encrypted and secure. We prioritize your privacy and trust above all
            </p>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">Trusted by 10,000+ couples</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">End-to-end encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-current" />
            <span className="text-sm font-medium">Relationship focused</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedHero;

