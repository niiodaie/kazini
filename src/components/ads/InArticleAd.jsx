import React from 'react';
import AdUnit from './AdUnit';

const InArticleAd = ({ 
  className = '',
  showOnFreePlan = true,
  showOnProPlan = false,
  margin = '30px 0' 
}) => {
  const articleAdStyles = {
    width: '100%',
    margin: margin,
    padding: '20px 0',
    borderTop: '1px solid #e5e5e5',
    borderBottom: '1px solid #e5e5e5'
  };

  return (
    <div 
      className={`in-article-ad ${className}`}
      style={articleAdStyles}
    >
      <AdUnit 
        placement="in_article"
        showOnFreePlan={showOnFreePlan}
        showOnProPlan={showOnProPlan}
      />
    </div>
  );
};

export default InArticleAd;

