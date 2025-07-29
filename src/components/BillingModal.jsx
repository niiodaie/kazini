import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Zap, Crown, Shield, Users, TrendingUp } from 'lucide-react';

const BillingModal = ({ isOpen, onClose, onUpgrade }) => {
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'

  const plans = {
    pro: {
      name: 'Kazini Pro',
      monthly: { price: 9.99, originalPrice: null },
      yearly: { price: 99, originalPrice: 119.88, savings: '17% off' },
      features: [
        'Unlimited Truth Tests',
        'Advanced AI Analysis',
        'Couple Mode (Live & Async)',
        'Trust Index Dashboard',
        'History & Analytics',
        'Priority Support',
        'Export Reports',
        'Mobile App Access'
      ],
      popular: true,
      color: 'from-purple-500 to-pink-500',
      icon: <Crown className="w-6 h-6" />
    },
    enterprise: {
      name: 'Kazini Enterprise',
      monthly: { price: 49.99, originalPrice: null },
      yearly: { price: 499, originalPrice: 599.88, savings: '17% off' },
      features: [
        'Everything in Pro',
        'Team Management (up to 10 users)',
        'Advanced Analytics & Insights',
        'Custom Branding',
        'API Access',
        'Dedicated Account Manager',
        'Custom Integrations',
        'Enterprise Security',
        'Training & Onboarding'
      ],
      popular: false,
      color: 'from-blue-500 to-indigo-500',
      icon: <Shield className="w-6 h-6" />
    }
  };

  const handleSubscribe = (planType) => {
    // In production, this would redirect to Lemon Squeezy checkout
    const plan = plans[planType];
    const pricing = plan[billingCycle];
    
    // Placeholder for Lemon Squeezy integration
    const checkoutUrl = `https://kazini.lemonsqueezy.com/checkout/${planType}-${billingCycle}`;
    
    // For now, show a modal or alert
    alert(`Redirecting to Lemon Squeezy checkout for ${plan.name} (${billingCycle}): $${pricing.price}`);
    
    // In production:
    // window.location.href = checkoutUrl;
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
                <p className="text-gray-600">Unlock the full power of emotional truth detection</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mt-6">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Yearly
                  <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(plans).map(([key, plan]) => {
                const pricing = plan[billingCycle];
                const isPopular = plan.popular && billingCycle === 'yearly';
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: key === 'pro' ? 0 : 0.1 }}
                    className={`relative bg-white border-2 rounded-xl p-6 ${
                      isPopular 
                        ? 'border-purple-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    } transition-all duration-300`}
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                        {plan.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      
                      {/* Pricing */}
                      <div className="mb-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-4xl font-bold text-gray-900">
                            ${pricing.price}
                          </span>
                          <div className="text-left">
                            <div className="text-gray-600">
                              /{billingCycle === 'yearly' ? 'year' : 'month'}
                            </div>
                            {pricing.originalPrice && (
                              <div className="text-sm text-gray-400 line-through">
                                ${pricing.originalPrice}
                              </div>
                            )}
                          </div>
                        </div>
                        {pricing.savings && (
                          <div className="text-green-600 font-medium text-sm mt-1">
                            {pricing.savings}
                          </div>
                        )}
                        {billingCycle === 'yearly' && (
                          <div className="text-gray-600 text-sm mt-1">
                            ${(pricing.price / 12).toFixed(2)}/month billed annually
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSubscribe(key)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        isPopular
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Subscribe to {plan.name}
                    </button>
                    
                    <div className="text-center mt-3">
                      <button className="text-sm text-gray-500 hover:text-gray-700 underline">
                        Learn More
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Shield className="w-8 h-8 text-green-500 mb-2" />
                  <div className="text-sm font-medium text-gray-900">Secure Payments</div>
                  <div className="text-xs text-gray-600">256-bit SSL encryption</div>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="w-8 h-8 text-blue-500 mb-2" />
                  <div className="text-sm font-medium text-gray-900">10,000+ Users</div>
                  <div className="text-xs text-gray-600">Trusted worldwide</div>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
                  <div className="text-sm font-medium text-gray-900">99.9% Uptime</div>
                  <div className="text-xs text-gray-600">Always available</div>
                </div>
                <div className="flex flex-col items-center">
                  <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                  <div className="text-sm font-medium text-gray-900">Instant Access</div>
                  <div className="text-xs text-gray-600">Start immediately</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Cancel anytime. No hidden fees. 30-day money-back guarantee.</p>
              <p className="mt-1">
                Powered by{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                  Lemon Squeezy
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BillingModal;

