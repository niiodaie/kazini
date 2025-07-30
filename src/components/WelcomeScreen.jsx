import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, CheckCircle, User, Sparkles, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const WelcomeScreen = ({ user, onComplete, isNewUser = false, isSocialLogin = false }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      icon: Heart,
      title: "Welcome to Kazini!",
      subtitle: `Hi ${user?.firstName || 'there'}! 💕`,
      description: "You've just joined thousands of couples discovering deeper emotional truth and authentic connections.",
      action: "Get Started",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: Sparkles,
      title: "Your Truth Journey Begins",
      subtitle: "Discover What Makes Love Real",
      description: "Kazini uses advanced AI to help you understand emotional authenticity in your relationships. Every conversation becomes an opportunity for deeper connection.",
      action: "Continue",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Gift,
      title: "Ready to Explore?",
      subtitle: "Choose Your First Experience",
      description: "Start with a Truth Test, connect with your partner in Couple Mode, or explore our community in Truth Circle. Your journey to authentic love starts now!",
      action: "Enter Kazini",
      color: "from-blue-500 to-purple-500"
    }
  ];

  const socialWelcomeSteps = [
    {
      icon: CheckCircle,
      title: "Successfully Connected!",
      subtitle: `Welcome ${user?.firstName || 'there'}! 🎉`,
      description: "Your social account has been connected to Kazini. Now let's personalize your experience for deeper emotional connections.",
      action: "Continue",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: User,
      title: "Choose Your Mode",
      subtitle: "How would you like to use Kazini?",
      description: "Select your preferred way to explore emotional truth and authentic relationships.",
      action: "Individual Mode",
      secondaryAction: "Couple Mode",
      color: "from-blue-500 to-purple-500"
    }
  ];

  const steps = isSocialLogin ? socialWelcomeSteps : welcomeSteps;
  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete('individual');
    }
  };

  const handleCoupleMode = () => {
    onComplete('couple');
  };

  const handleSkip = () => {
    onComplete('skip');
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Welcome Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <div className={`p-4 bg-gradient-to-r ${currentStepData.color} rounded-full`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                    {currentStepData.title}
                  </CardTitle>
                  <p className="text-xl text-gray-600 font-medium">
                    {currentStepData.subtitle}
                  </p>
                </motion.div>

                {/* New User Badge */}
                {isNewUser && currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex justify-center mt-4"
                  >
                    <Badge variant="secondary" className="bg-pink-100 text-pink-800 border-pink-200">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New Member
                    </Badge>
                  </motion.div>
                )}
              </CardHeader>
              
              <CardContent className="text-center">
                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-gray-600 text-lg leading-relaxed mb-8"
                >
                  {currentStepData.description}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-4"
                >
                  {/* Primary Action */}
                  <Button
                    onClick={handleNext}
                    className={`w-full bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white text-lg py-6`}
                  >
                    {currentStepData.action}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  {/* Secondary Action (for social login mode selection) */}
                  {currentStepData.secondaryAction && (
                    <Button
                      onClick={handleCoupleMode}
                      variant="outline"
                      className="w-full text-lg py-6 border-2"
                    >
                      {currentStepData.secondaryAction}
                      <Heart className="w-5 h-5 ml-2" />
                    </Button>
                  )}

                  {/* Skip Option */}
                  {currentStep === 0 && (
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      className="w-full text-gray-500 hover:text-gray-700"
                    >
                      Skip Welcome
                    </Button>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Preview (last step) */}
          {currentStep === steps.length - 1 && !isSocialLogin && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">🔍</div>
                  <h3 className="text-white font-semibold mb-1">Truth Test</h3>
                  <p className="text-white/80 text-sm">AI-powered emotional analysis</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">💑</div>
                  <h3 className="text-white font-semibold mb-1">Couple Mode</h3>
                  <p className="text-white/80 text-sm">Connect with your partner</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">🌐</div>
                  <h3 className="text-white font-semibold mb-1">Truth Circle</h3>
                  <p className="text-white/80 text-sm">Community stories</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

