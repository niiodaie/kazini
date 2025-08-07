// Google Analytics 4 (GA4) Utility Functions
// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics Measurement ID

// Initialize Google Analytics
export const initializeGA = () => {
  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
};

// Track user authentication events
export const trackAuth = (method, success = true) => {
  trackEvent('login', {
    method: method, // 'google', 'email', 'phone', 'magic_link', 'guest'
    success: success
  });
};

// Track plan selection events
export const trackPlanSelection = (planType) => {
  trackEvent('select_plan', {
    plan_type: planType, // 'free', 'pro', 'enterprise'
    value: planType === 'pro' ? 99 : 0
  });
};

// Track truth test events
export const trackTruthTest = (testType, result = null) => {
  trackEvent('truth_test', {
    test_type: testType, // 'individual', 'couple', 'live'
    result: result // 'truthful', 'deceptive', 'inconclusive'
  });
};

// Track upgrade events
export const trackUpgrade = (fromPlan, toPlan, value) => {
  trackEvent('purchase', {
    transaction_id: Date.now().toString(),
    value: value,
    currency: 'USD',
    items: [{
      item_id: `kazini_${toPlan}`,
      item_name: `Kazini ${toPlan.charAt(0).toUpperCase() + toPlan.slice(1)} Plan`,
      category: 'subscription',
      quantity: 1,
      price: value
    }]
  });
};

// Track waitlist signups
export const trackWaitlistSignup = (planType) => {
  trackEvent('generate_lead', {
    currency: 'USD',
    value: planType === 'enterprise' ? 499 : 0,
    lead_type: 'waitlist',
    plan_type: planType
  });
};

// Track feature usage
export const trackFeatureUsage = (featureName, planType) => {
  trackEvent('feature_usage', {
    feature_name: featureName, // 'couple_mode', 'live_detection', 'ai_scheduler', etc.
    plan_type: planType,
    timestamp: new Date().toISOString()
  });
};

// Track user engagement
export const trackEngagement = (action, category = 'engagement') => {
  trackEvent(action, {
    event_category: category,
    engagement_time_msec: Date.now()
  });
};

// Track errors
export const trackError = (errorMessage, errorCategory = 'javascript_error') => {
  trackEvent('exception', {
    description: errorMessage,
    fatal: false,
    error_category: errorCategory
  });
};

// Track conversion events
export const trackConversion = (conversionType, value = 0) => {
  trackEvent('conversion', {
    conversion_type: conversionType, // 'signup', 'upgrade', 'trial_start'
    value: value,
    currency: 'USD'
  });
};

