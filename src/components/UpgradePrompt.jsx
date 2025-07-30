import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, X, Star, Check, Zap, Heart, Users, 
  BarChart3, Download, Shield, Sparkles 
} from 'lucide-react';

const UpgradePrompt = ({ 
  isOpen, 
  onClose, 
  feature, 
  onUpgrade,
  currentPlan = 'free' 
}) => {
  if (!isOpen) return null;

  const featureDetails = {
    coupleMode: {
      title: 'Couple Mode',
      description: 'Connect with your partner for live truth sessions and async questioning',
      icon: <Users className="w-8 h-8 text-pink-500" />,
      benefits: [
        'Live real-time sessions with your partner',
        'Async link sharing for delayed responses',
        'Shared session history and insights',
        'Couple-specific AI analysis'
      ]
    },
    fullHistory: {
      title: 'Full History & Analytics',
      description: 'Access your complete truth test history with detailed analytics',
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      benefits: [
        'Unlimited history access',
        'Detailed analytics and trends',
        'Progress tracking over time',
        'Advanced filtering and search'
      ]
    },
    export: {
      title: 'Export Reports',
      description: 'Download and share your truth test results',
      icon: <Download className="w-8 h-8 text-green-500" />,
      benefits: [
        'PDF report generation',
        'CSV data export',
        'Shareable insights',
        'Professional formatting'
      ]
    },
    trustIndex: {
      title: 'Trust Index Dashboard',
      description: 'Visual trust scoring and relationship insights',
      icon: <Heart className="w-8 h-8 text-red-500" />,
      benefits: [
        'Interactive trust scoring',
        'Relationship health metrics',
        'Visual charts and graphs',
        'Trend analysis over time'
      ]
    },
    unlimitedTests: {
      title: 'Unlimited Truth Tests',
      description: 'Remove the 3 tests per month limit',
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      benefits: [
        'Unlimited truth tests',
        'No monthly restrictions',
        'Advanced AI analysis',
        'Priority processing'
      ]
    }
  };

  const currentFeature = featureDetails[feature] || featureDetails.unlimitedTests;

  const handleUpgrade = (plan) => {
    if (onUpgrade) {
      onUpgrade(plan);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center mb-4">
            {currentFeature.icon}
            <div className="ml-4">
              <h2 className="text-2xl font-bold">{currentFeature.title}</h2>
              <p className="text-white/90">{currentFeature.description}</p>
            </div>
          </div>
          
          <Badge className="bg-white/20 text-white border-white/30">
            <Crown className="w-4 h-4 mr-1" />
            Pro Feature
          </Badge>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Limitation */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              You're currently on the Free plan
            </h3>
            <p className="text-gray-600 text-sm">
              Upgrade to Pro to unlock {currentFeature.title.toLowerCase()} and many more features.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              What you'll get with Pro:
            </h3>
            <ul className="space-y-3">
              {currentFeature.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Pro Monthly */}
            <Card className="border-2 border-gray-200 hover:border-pink-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pro Monthly</CardTitle>
                </div>
                <div className="text-2xl font-bold">$9.99<span className="text-sm font-normal text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => handleUpgrade('pro_monthly')}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  Upgrade to Pro Monthly
                </Button>
              </CardContent>
            </Card>

            {/* Pro Yearly */}
            <Card className="border-2 border-pink-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Best Value
                </Badge>
              </div>
              <CardHeader className="pb-3 pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pro Yearly</CardTitle>
                  <Badge className="bg-green-100 text-green-800 text-xs">Save 17%</Badge>
                </div>
                <div className="text-2xl font-bold">$99<span className="text-sm font-normal text-gray-500">/year</span></div>
                <div className="text-sm text-gray-500">$8.25/month billed annually</div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => handleUpgrade('pro_yearly')}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  Upgrade to Pro Yearly
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Benefits */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Sparkles className="w-5 h-5 text-pink-500 mr-2" />
              <span className="font-semibold text-gray-900">Pro includes everything:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div>• Unlimited Truth Tests</div>
              <div>• Couple Mode (Live & Async)</div>
              <div>• Full History & Analytics</div>
              <div>• Trust Index Dashboard</div>
              <div>• Export Reports</div>
              <div>• Priority Support</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              30-day money-back guarantee • Cancel anytime • Secure payments
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradePrompt;

