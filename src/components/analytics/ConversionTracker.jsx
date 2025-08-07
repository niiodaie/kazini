import React, { useEffect } from 'react';
import { useAnalyticsContext } from './AnalyticsProvider';

const ConversionTracker = ({ 
  conversionType, 
  value = 0, 
  trigger = 'mount',
  children 
}) => {
  const analytics = useAnalyticsContext();

  useEffect(() => {
    if (trigger === 'mount') {
      switch (conversionType) {
        case 'signup':
          analytics.trackSignup('email');
          break;
        case 'trial_start':
          analytics.trackTrialStart();
          break;
        case 'purchase':
          analytics.trackPurchase(value);
          break;
        case 'lead':
          analytics.trackLead();
          break;
        default:
          analytics.trackConversion(conversionType, value);
      }
    }
  }, [conversionType, value, trigger, analytics]);

  const handleClick = () => {
    if (trigger === 'click') {
      analytics.trackConversion(conversionType, value);
    }
  };

  if (children) {
    return (
      <div onClick={handleClick}>
        {children}
      </div>
    );
  }

  return null;
};

export default ConversionTracker;

