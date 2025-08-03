import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PLANS } from '../plans';
import {
  Crown, Check, X, ArrowLeft, Star, Zap, Shield,
  Heart, Users, Video, Download, Headphones, Globe, Sparkles
} from 'lucide-react';

const Pricing = ({ onBack, onUpgrade }) => {
  const [billingCycle, setBillingCycle] = useState('yearly');
  
  // Get current user plan (default to free for new users)
  const user = JSON.parse(localStorage.getItem('kazini_user') || '{}');
  const currentPlan = user.plan || 'free';

  // Handle back to home
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    if (plan.id === 'free') {
      // For free plan, just update user plan
      const updatedUser = { ...user, plan: 'free' };
      localStorage.setItem('kazini_user', JSON.stringify(updatedUser));
      window.location.href = '/';
    } else if (onUpgrade) {
      onUpgrade(plan);
    } else {
      // Open billing modal or redirect to payment
      window.open(plan.link, '_blank');
    }
  };

  // Get plans to display based on billing cycle
  const getDisplayPlans = () => {
    const plans = [];
    
    // Always show Free plan
    plans.push(PLANS.free);
    
    // Add Pro plan based on billing cycle
    if (billingCycle === 'yearly') {
      plans.push(PLANS.pro_yearly);
      plans.push(PLANS.enterprise_yearly);
    } else {
      plans.push(PLANS.pro_monthly);
      plans.push(PLANS.enterprise_monthly);
    }
    
    return plans;
  };

  const displayPlans = getDisplayPlans();

  return (
    <div className="min-h-screen romantic-bg">
      {/* Floating motifs */}
      <div className="emotional-motifs">
        <div className="motif">💘</div>
        <div className="motif">❣️</div>
        <div className="motif">💖</div>
        <div className="motif">💓</div>
        <div className="motif">💞</div>
        <div className="motif">❤️</div>
      </div>

      {/* Light overlay */}
      <div className="light-movement"></div>

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {currentPlan && (
              <Badge className="bg-white/20 text-white border-white/30">
                Current: {currentPlan === 'free' ? 'Free' : currentPlan === 'pro' ? 'Pro' : 'Enterprise'}
              </Badge>
            )}
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Start free and upgrade as your relationship journey grows
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 rounded-lg p-1 backdrop-blur-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Yearly
                <Badge className="ml-2 bg-green-500 text-white text-xs">
                  Save 17%
                </Badge>
              </button>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full bg-white/10 backdrop-blur-sm border-white/20 text-white relative overflow-hidden ${
                  plan.popular ? 'ring-2 ring-yellow-400/50' : ''
                } ${currentPlan === plan.id.replace('_yearly', '').replace('_monthly', '') ? 'ring-2 ring-green-400/50' : ''}`}>
                  
                  {/* Plan Header */}
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-2">
                      {plan.id === 'free' && <Heart className="w-6 h-6 mr-2 text-gray-400" />}
                      {plan.name.includes('Pro') && <Crown className="w-6 h-6 mr-2 text-yellow-400" />}
                      {plan.name.includes('Enterprise') && <Shield className="w-6 h-6 mr-2 text-blue-400" />}
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    </div>
                    
                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="text-4xl font-bold mb-1">
                        {plan.price}
                        {plan.id !== 'free' && (
                          <span className="text-lg font-normal text-white/70">
                            /{plan.period}
                          </span>
                        )}
                      </div>
                      
                      {plan.discount && (
                        <div className="text-sm text-green-400 font-semibold">
                          {plan.discount}
                        </div>
                      )}
                      
                      {plan.monthlyPrice && plan.period === 'year' && (
                        <div className="text-sm text-white/70">
                          ${plan.monthlyPrice}/month billed annually
                        </div>
                      )}
                      
                      {plan.originalPrice && (
                        <div className="text-sm text-white/50 line-through">
                          Was {plan.originalPrice}/year
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  {/* Features */}
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-white/90">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <Button
                      onClick={() => handlePlanSelect(plan)}
                      disabled={currentPlan === plan.id.replace('_yearly', '').replace('_monthly', '')}
                      className={`w-full py-3 font-semibold transition-all ${plan.buttonClass} ${
                        currentPlan === plan.id.replace('_yearly', '').replace('_monthly', '')
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-105'
                      }`}
                    >
                      {currentPlan === plan.id.replace('_yearly', '').replace('_monthly', '')
                        ? 'Current Plan'
                        : plan.buttonText
                      }
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <div className="text-center mt-16">
            <p className="text-white/70 text-sm">
              All plans include 30-day money-back guarantee • Cancel anytime • Secure payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
