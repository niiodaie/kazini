import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Lock, Crown, Zap, Star } from 'lucide-react';

const PlanGating = ({ feature, userPlan, onUpgrade, onClose }) => {
  const getFeatureRequirements = (feature) => {
    const requirements = {
      'couple-mode': {
        title: 'Couple Mode',
        description: 'Connect with your partner for real-time truth testing',
        requiredPlan: 'pro',
        icon: <Crown className="w-6 h-6" />,
        benefits: [
          'Live truth sessions with your partner',
          'Async question sharing',
          'Relationship insights dashboard',
          'Trust index tracking'
        ]
      },
      'history': {
        title: 'Test History',
        description: 'Access your complete truth test history and analytics',
        requiredPlan: 'pro',
        icon: <Star className="w-6 h-6" />,
        benefits: [
          'Unlimited test history',
          'Advanced analytics',
          'Export reports',
          'Progress tracking'
        ]
      },
      'export': {
        title: 'Export Reports',
        description: 'Download and share your truth test results',
        requiredPlan: 'pro',
        icon: <Zap className="w-6 h-6" />,
        benefits: [
          'PDF report generation',
          'CSV data export',
          'Share with professionals',
          'Print-friendly formats'
        ]
      },
      'unlimited-tests': {
        title: 'Unlimited Tests',
        description: 'Take unlimited truth tests without restrictions',
        requiredPlan: 'pro',
        icon: <Crown className="w-6 h-6" />,
        benefits: [
          'Unlimited truth tests per month',
          'No daily limits',
          'Advanced AI analysis',
          'Priority support'
        ]
      }
    };

    return requirements[feature] || {
      title: 'Premium Feature',
      description: 'This feature requires a Pro subscription',
      requiredPlan: 'pro',
      icon: <Lock className="w-6 h-6" />,
      benefits: ['Access to premium features']
    };
  };

  const featureInfo = getFeatureRequirements(feature);
  const isPlanSufficient = userPlan === 'pro' || userPlan === 'enterprise';

  if (isPlanSufficient) {
    return null; // Don't show gating if user has sufficient plan
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {featureInfo.icon}
            </div>
            <CardTitle className="text-xl mb-2">{featureInfo.title}</CardTitle>
            <p className="text-gray-600 text-sm">{featureInfo.description}</p>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-auto">
              <Crown className="w-3 h-3 mr-1" />
              Pro Feature
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">What you'll get:</h4>
              <ul className="space-y-1">
                {featureInfo.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Current Plan:</p>
                <Badge variant="secondary" className="mb-3">
                  {userPlan === 'free' ? 'Free' : userPlan}
                </Badge>
                <p className="text-xs text-gray-500">
                  Upgrade to Pro for unlimited access to all features
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                onClick={onUpgrade}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              30-day money-back guarantee • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PlanGating;

