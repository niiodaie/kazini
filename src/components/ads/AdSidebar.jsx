import React from 'react';
import AdUnit from './AdUnit';

const AdSidebar = ({ 
  className = '',
  showOnFreePlan = true,
  showOnProPlan = false,
  sticky = true 
}) => {
  const sidebarStyles = {
    width: '300px',
    minHeight: '250px',
    margin: '20px 0',
    ...(sticky && {
      position: 'sticky',
      top: '20px'
    })
  };

  return (
    <div 
      className={`ad-sidebar ${className}`}
      style={sidebarStyles}
    >
      <AdUnit 
        placement="sidebar"
        showOnFreePlan={showOnFreePlan}
        showOnProPlan={showOnProPlan}
      />
    </div>
  );
};

export default AdSidebar;

