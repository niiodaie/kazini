import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PLANS } from '@/plans';
import {
  ArrowLeft,
  Sparkles,
  Shield,
  Star,
  Video,
  Users,
  Download,
  Globe,
  Headphones,
  Heart,
  Zap,
  Crown,
  Check,
  X
} from 'lucide-react';

const Pricing = ({ user }) => {
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const getDiscountPercentage = (plan) => {
    if (!plan.price || plan.price.yearly === 0) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyPrice = plan.price.yearly;
    return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
  };

  // Transform PLANS data to match expected format
  const transformedPlans = {
    basic: {
      name: 'Basic',
      price: { monthly: 0, yearly: 0 },
      features: ['5 truth tests per month', 'Basic AI analysis', 'Community support']
    },
    pro: {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.00 },
      features: ['Unlimited truth tests', 'Advanced AI analysis', 'Video emotion detection', 'Priority support'],
      link: PLANS.pro_monthly.link
    },
    enterprise: {
      name: 'Enterprise',
      price: { monthly: 49.99, yearly: 499.00 },
      features: ['Everything in Pro', 'Team management', 'API access', 'Custom deployment', '24/7 support'],
      link: PLANS.enterprise_monthly.link
    }
  };

  return (
    <div className="min-h-screen romantic-bg">
      {/* Floating emotional motifs */}
      <div className="emotional-motifs">
        <div className="motif">💘</div>
        <div className="motif">❣️</div>
        <div className="motif">💖</div>
        <div className="motif">💓</div>
        <div className="motif">💞</div>
        <div className="motif">❤️</div>
      </div>

      {/* Dynamic light movement */}
      <div className="light-movement"></div>

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {user && (
              <Badge className="bg-white/20 text-white border-white/30">
                Current: {user.plan === 'pro' ? 'Pro' : user.plan === 'enterprise' ? 'Enterprise' : 'Basic'}
              </Badge>
            )}
          </div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Choose Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Truth Journey
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Unlock deeper emotional insights with our advanced AI-powered analysis. 
              Start free, upgrade when you're ready for more.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(transformedPlans).map(([key, plan]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: Object.keys(transformedPlans).indexOf(key) * 0.1 }}
                className={key === 'pro' ? 'md:-mt-4 md:mb-4' : ''}
              >
                <Card className={`bg-white/95 backdrop-blur-sm border-0 shadow-xl h-full ${
                  key === 'pro' ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}>
                  {key === 'pro' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      {key === 'basic' && <Heart className="w-12 h-12 text-gray-500" />}
                      {key === 'pro' && <Crown className="w-12 h-12 text-purple-500" />}
                      {key === 'enterprise' && <Sparkles className="w-12 h-12 text-blue-500" />}
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    
                    <div className="mt-4">
                      <div className="text-4xl font-bold text-gray-900">
                        ${plan.price.monthly}
                        {plan.price.monthly > 0 && (
                          <span className="text-lg font-normal text-gray-500">/month</span>
                        )}
                      </div>
                      
                      {plan.price.yearly > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          Save {getDiscountPercentage(plan)}% annually
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-900">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6">
                      <Button
                        onClick={() => plan.link && (window.location.href = plan.link)}
                        disabled={key === 'basic'}
                        className={`w-full ${
                          key === 'pro'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                            : key === 'enterprise'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        {key === 'basic' ? 'Current Plan' : 'Subscribe Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
