import React, { createContext, useContext, useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const AnalyticsContext = createContext();

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const analytics = useAnalytics();

  // Track JavaScript errors globally
  useEffect(() => {
    const handleError = (event) => {
      analytics.trackJSError(event.error);
    };

    const handleUnhandledRejection = (event) => {
      analytics.trackJSError(new Error(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [analytics]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};

