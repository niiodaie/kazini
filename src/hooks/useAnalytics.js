import { useEffect } from 'react';
import { 
  trackPageView, 
  trackEvent, 
  trackAuth, 
  trackPlanSelection,
  trackTruthTest,
  trackUpgrade,
  trackWaitlistSignup,
  trackFeatureUsage,
  trackEngagement,
  trackError,
  trackConversion
} from '../utils/analytics';

export const useAnalytics = () => {
  // Track page views automatically when component mounts
  useEffect(() => {
    trackPageView(window.location.pathname, document.title);
  }, []);

  return {
    // Authentication tracking
    trackLogin: (method, success = true) => trackAuth(method, success),
    trackSignup: (method) => {
      trackAuth(method, true);
      trackConversion('signup');
    },
    
    // Plan and billing tracking
    trackPlanSelect: (planType) => trackPlanSelection(planType),
    trackUpgradeAttempt: (fromPlan, toPlan, value) => trackUpgrade(fromPlan, toPlan, value),
    trackWaitlist: (planType) => trackWaitlistSignup(planType),
    
    // Feature usage tracking
    trackFeature: (featureName, planType) => trackFeatureUsage(featureName, planType),
    trackTruthTestStart: (testType) => trackTruthTest(testType),
    trackTruthTestComplete: (testType, result) => trackTruthTest(testType, result),
    
    // Engagement tracking
    trackButtonClick: (buttonName) => trackEngagement(`click_${buttonName}`, 'ui_interaction'),
    trackFormSubmit: (formName) => trackEngagement(`submit_${formName}`, 'form_interaction'),
    trackVideoPlay: (videoName) => trackEngagement(`play_${videoName}`, 'media_interaction'),
    trackDownload: (fileName) => trackEngagement(`download_${fileName}`, 'download'),
    
    // Error tracking
    trackJSError: (error) => trackError(error.message, 'javascript_error'),
    trackAPIError: (endpoint, error) => trackError(`${endpoint}: ${error}`, 'api_error'),
    
    // Custom event tracking
    trackCustomEvent: (eventName, parameters) => trackEvent(eventName, parameters),
    
    // Conversion tracking
    trackTrialStart: () => trackConversion('trial_start'),
    trackPurchase: (value) => trackConversion('purchase', value),
    trackLead: () => trackConversion('lead_generation')
  };
};

