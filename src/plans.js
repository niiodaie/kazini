// src/plans.js
export const PLANS = {
  free: {
    id: 'free',
    name: 'Kazini Free',
    price: '$0',
    period: 'year',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    originalPrice: null,
    discount: null,
    features: [
      '3 Truth Tests per month',
      'Solo Mode only (no Couple Mode)',
      'Limited Trust Report',
      'View Last 3 Test Results',
      'No Export / No History Access',
      'Upgrade prompts for locked features'
    ],
    limitations: {
      truthTestsPerMonth: 3,
      coupleMode: false,
      fullHistory: false,
      export: false,
      trustIndex: false,
      prioritySupport: false
    },
    buttonText: 'Start Free',
    buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white',
    popular: false
  },
  pro_monthly: {
    id: '047ff453-e2b2-4071-a3c5-75877848d213',
    name: 'Kazini Pro',
    price: '$9.99/month',
    period: 'month',
    monthlyPrice: '$9.99',
    yearlyPrice: '$99',
    originalPrice: '$119.88',
    discount: '17% off',
    features: [
      'Unlimited Truth Tests',
      'Advanced AI Analysis',
      'Couple Mode (Live & Async)',
      'Trust Index Dashboard',
      'Full History & Analytics',
      'Priority Support',
      'Export Reports',
      'Mobile App Access'
    ],
    limitations: {},
    buttonText: 'Subscribe to Kazini Pro',
    buttonClass: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white',
    popular: false,
    link: 'https://visnec.lemonsqueezy.com/buy/047ff453-e2b2-4071-a3c5-75877848d213',
  },
  pro_yearly: {
    id: '418427af-f316-480b-9d8b-a16e40a3ee5c',
    name: 'Kazini Pro',
    price: '$99/year',
    period: 'year',
    monthlyPrice: '$8.25',
    yearlyPrice: '$99',
    originalPrice: '$119.88',
    discount: '17% off',
    features: [
      'Unlimited Truth Tests',
      'Advanced AI Analysis',
      'Couple Mode (Live & Async)',
      'Trust Index Dashboard',
      'Full History & Analytics',
      'Priority Support',
      'Export Reports',
      'Mobile App Access'
    ],
    limitations: {},
    buttonText: 'Subscribe to Kazini Pro',
    buttonClass: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white',
    popular: true,
    link: 'https://visnec.lemonsqueezy.com/buy/418427af-f316-480b-9d8b-a16e40a3ee5c',
  },
  enterprise_monthly: {
    id: '2c55c026-f136-4f19-9492-a178b7c5b5a0',
    name: 'Kazini Enterprise',
    price: '$49.99/month',
    period: 'month',
    monthlyPrice: '$49.99',
    yearlyPrice: '$499',
    originalPrice: '$599.88',
    discount: '17% off',
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
    limitations: {},
    buttonText: 'Subscribe to Kazini Enterprise',
    buttonClass: 'bg-gray-900 hover:bg-gray-800 text-white',
    popular: false,
    link: 'https://visnec.lemonsqueezy.com/buy/2c55c026-f136-4f19-9492-a178b7c5b5a0',
  },
  enterprise_yearly: {
    id: '3d68f498-3793-4a5c-be22-62d0dfe94376',
    name: 'Kazini Enterprise',
    price: '$499/year',
    period: 'year',
    monthlyPrice: '$41.58',
    yearlyPrice: '$499',
    originalPrice: '$599.88',
    discount: '17% off',
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
    limitations: {},
    buttonText: 'Subscribe to Kazini Enterprise',
    buttonClass: 'bg-gray-900 hover:bg-gray-800 text-white',
    popular: false,
    link: 'https://visnec.lemonsqueezy.com/buy/3d68f498-3793-4a5c-be22-62d0dfe94376',
  },
};

// Plan access utilities
export const PLAN_FEATURES = {
  TRUTH_TESTS: 'truthTests',
  COUPLE_MODE: 'coupleMode',
  FULL_HISTORY: 'fullHistory',
  EXPORT: 'export',
  TRUST_INDEX: 'trustIndex',
  PRIORITY_SUPPORT: 'prioritySupport'
};

export const checkPlanAccess = (userPlan, feature) => {
  if (!userPlan) return false;
  
  const planConfig = Object.values(PLANS).find(plan => 
    plan.name.toLowerCase().includes(userPlan.toLowerCase()) || 
    plan.id === userPlan
  );
  
  if (!planConfig) return false;
  
  // Free plan limitations
  if (userPlan === 'free') {
    switch (feature) {
      case PLAN_FEATURES.COUPLE_MODE:
      case PLAN_FEATURES.FULL_HISTORY:
      case PLAN_FEATURES.EXPORT:
      case PLAN_FEATURES.TRUST_INDEX:
      case PLAN_FEATURES.PRIORITY_SUPPORT:
        return false;
      case PLAN_FEATURES.TRUTH_TESTS:
        return true; // Limited to 3 per month, handled separately
      default:
        return false;
    }
  }
  
  // Pro and Enterprise have access to all features
  return userPlan === 'pro' || userPlan === 'enterprise';
};

export const getPlanDisplayName = (planId) => {
  const plan = Object.values(PLANS).find(p => p.id === planId);
  return plan ? plan.name : 'Free';
};
