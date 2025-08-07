import React from 'react';
import AdUnit from './AdUnit';

const AdBanner = ({ 
  position = 'header', 
  className = '',
  showOnFreePlan = true,
  showOnProPlan = false 
}) => {
  const bannerStyles = {
    header: {
      width: '100%',
      maxWidth: '728px',
      margin: '0 auto 20px auto',
      padding: '10px'
    },
    footer: {
      width: '100%',
      maxWidth: '728px',
      margin: '20px auto 0 auto',
      padding: '10px'
    },
    mobile: {
      width: '100%',
      maxWidth: '320px',
      margin: '10px auto',
      padding: '5px'
    }
  };

  const placement = position === 'mobile' ? 'mobile_banner' : position;

  return (
    <div 
      className={`ad-banner ad-banner-${position} ${className}`}
      style={bannerStyles[position]}
    >
      <AdUnit 
        placement={placement}
        showOnFreePlan={showOnFreePlan}
        showOnProPlan={showOnProPlan}
      />
    </div>
  );
};

export default AdBanner;

