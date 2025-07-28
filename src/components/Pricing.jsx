import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Crown, 
  Check, 
  X, 
  ArrowLeft, 
  Star, 
  Zap, 
  Shield, 
  Heart,
  Users,
  Video,
  Download,
  Headphones,
  Globe,
  Sparkles
} from 'lucide-react';

const Pricing = ({ onBack, user, onUpgrade }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out Kazini',
      badge: null,
      features: [
        { text: '5 truth tests per month', included: true },
        { text: 'Basic AI analysis', included: true },
        { text: 'Text-based conversations', included: true },
        { text: 'Basic trust index', included: true },
        { text: 'Limited history (7 days)', included: true },
        { text: 'Community support', included: true },
        { text: 'Video emotion detection', included: false },
        { text: 'Advanced AI insights', included: false },
        { text: 'Couple mode premium features', included: false },
        { text: 'Export reports', included: false },
        { text: 'Priority support', included: false },
        { text: 'Long-distance features', included: false }
      ],
      cta: 'Current Plan',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'For individuals seeking deeper insights',
      badge: { text: 'Most Popular', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
      features: [
        { text: 'Unlimited truth tests', included: true },
        { text: 'Advanced AI analysis with GPT-4', included: true },
        { text: 'Video emotion detection', included: true },
        { text: 'Voice analysis', included: true },
        { text: 'Advanced trust index with trends', included: true },
        { text: 'Unlimited history & search', included: true },
        { text: 'Export detailed reports (PDF/CSV)', included: true },
        { text: 'Couple mode premium features', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Custom AI training', included: true },
        { text: 'Long-distance relationship tools', included: true },
        { text: 'API access', included: false }
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 49.99, yearly: 499.99 },
      description: 'For teams and organizations',
      badge: { text: 'Enterprise', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Team management dashboard', included: true },
        { text: 'Multi-user accounts (up to 10)', included: true },
        { text: 'Advanced analytics & reporting', included: true },
        { text: 'Custom AI model training', included: true },
        { text: 'API access & integrations', included: true },
        { text: 'White-label options', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'Custom deployment options', included: true },
        { text: 'HIPAA compliance', included: true },
        { text: 'Advanced security features', included: true }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const handlePlanSelect = async (planId) => {
    if (planId === 'free') return;
    
    setSelectedPlan(planId);
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (planId === 'enterprise') {
        // For enterprise, show contact form
        alert('Thank you for your interest! Our sales team will contact you within 24 hours.');
      } else {
        // For pro plan, simulate successful upgrade
        const updatedUser = { ...user, plan: planId };
        localStorage.setItem('kazini_user', JSON.stringify(updatedUser));
        
        if (onUpgrade) {
          onUpgrade(updatedUser);
        }
        
        alert('Congratulations! You have successfully upgraded to Pro. Welcome to the premium experience!');
      }
    } catch (error) {
      alert('Payment failed. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const getDiscountPercentage = (plan) => {
    if (plan.price.yearly === 0) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyPrice = plan.price.yearly;
    return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {user && (
              <Badge className="bg-white/20 text-white border-white/30">
                Current: {user.plan === 'pro' ? 'Pro' : user.plan === 'enterprise' ? 'Enterprise' : 'Free'}
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
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-white ${billingCycle === 'monthly' ? 'font-semibold' : 'opacity-70'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-white/20 rounded-full transition-colors duration-200"
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-white ${billingCycle === 'yearly' ? 'font-semibold' : 'opacity-70'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge className="bg-green-500 text-white ml-2">
                  Save up to 17%
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                <Card className={`bg-white/95 backdrop-blur-sm border-0 shadow-xl h-full ${
                  plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className={`${plan.badge.color} text-white px-4 py-1`}>
                        {plan.badge.text}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      {plan.id === 'free' && <Heart className="w-12 h-12 text-gray-500" />}
                      {plan.id === 'pro' && <Crown className="w-12 h-12 text-purple-500" />}
                      {plan.id === 'enterprise' && <Sparkles className="w-12 h-12 text-blue-500" />}
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                    
                    <div className="mt-4">
                      <div className="text-4xl font-bold text-gray-900">
                        ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                        {plan.price.monthly > 0 && (
                          <span className="text-lg font-normal text-gray-500">
                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                          </span>
                        )}
                      </div>
                      
                      {billingCycle === 'yearly' && plan.price.yearly > 0 && (
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
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6">
                      <Button
                        onClick={() => handlePlanSelect(plan.id)}
                        disabled={
                          isProcessing || 
                          (user && user.plan === plan.id) ||
                          (plan.id === 'free')
                        }
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                            : plan.id === 'enterprise'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        {isProcessing && selectedPlan === plan.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : user && user.plan === plan.id ? (
                          'Current Plan'
                        ) : (
                          plan.cta
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Features Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Why Upgrade to Pro?</CardTitle>
                <p className="text-center text-gray-600">
                  Unlock the full potential of emotional truth detection
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: <Video className="w-8 h-8 text-purple-500" />,
                      title: "Video Analysis",
                      description: "Analyze facial expressions and micro-emotions in video calls"
                    },
                    {
                      icon: <Zap className="w-8 h-8 text-yellow-500" />,
                      title: "Advanced AI",
                      description: "GPT-4 powered insights with 95% accuracy in emotion detection"
                    },
                    {
                      icon: <Download className="w-8 h-8 text-blue-500" />,
                      title: "Export Reports",
                      description: "Download detailed analysis reports in PDF or CSV format"
                    },
                    {
                      icon: <Headphones className="w-8 h-8 text-green-500" />,
                      title: "Priority Support",
                      description: "Get help when you need it with dedicated customer support"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">What Pro Users Say</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Jessica M.",
                  role: "Relationship Coach",
                  text: "The video analysis feature has revolutionized how I help my clients understand non-verbal communication.",
                  rating: 5
                },
                {
                  name: "David & Sarah",
                  role: "Long-distance Couple",
                  text: "The long-distance tools in Pro have helped us stay emotionally connected across continents.",
                  rating: 5
                },
                {
                  name: "Dr. Michael Chen",
                  role: "Therapist",
                  text: "The detailed reports and advanced AI insights provide invaluable data for my practice.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      question: "Can I cancel anytime?",
                      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
                    },
                    {
                      question: "Is my data secure?",
                      answer: "Absolutely. All conversations are encrypted end-to-end and we never share your personal data with third parties."
                    },
                    {
                      question: "Do you offer refunds?",
                      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment."
                    },
                    {
                      question: "Can I upgrade or downgrade?",
                      answer: "Yes, you can change your plan at any time. Changes take effect immediately and we'll prorate the billing."
                    }
                  ].map((faq, index) => (
                    <div key={index}>
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

