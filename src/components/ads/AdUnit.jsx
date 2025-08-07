import React, { useEffect, useRef } from 'react';
import { loadAdUnit, adConfigs } from '../../utils/adsense';

const AdUnit = ({ 
  placement = 'sidebar', 
  className = '', 
  style = {},
  showOnFreePlan = true,
  showOnProPlan = false 
}) => {
  const adRef = useRef(null);
  const config = adConfigs[placement];

  useEffect(() => {
    // Load ad unit when component mounts
    if (adRef.current && config) {
      loadAdUnit(config.slot, config.format);
    }
  }, [config]);

  // Don't show ads if configuration doesn't allow it
  if (!showOnFreePlan && !showOnProPlan) {
    return null;
  }

  if (!config) {
    console.warn(`AdUnit: Unknown placement "${placement}"`);
    return null;
  }

  return (
    <div 
      className={`ad-container ${className}`}
      style={{
        textAlign: 'center',
        margin: '20px 0',
        ...style
      }}
    >
      <div className="ad-label" style={{ 
        fontSize: '10px', 
        color: '#666', 
        marginBottom: '5px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Advertisement
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: config.format === 'fluid' ? '100%' : 'auto',
          height: config.format === 'fluid' ? 'auto' : config.size.split('x')[1] + 'px'
        }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={config.slot}
        data-ad-format={config.format}
        data-full-width-responsive={config.format === 'fluid' ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdUnit;

