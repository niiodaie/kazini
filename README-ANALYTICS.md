# KAZINI ANALYTICS & ADSENSE IMPLEMENTATION GUIDE

## 🎯 Overview

This implementation adds comprehensive Google Analytics 4 (GA4) and Google AdSense integration to the Kazini application, providing detailed user behavior tracking and monetization through strategic ad placements.

## 📊 Google Analytics 4 Features

### Automatic Tracking
- **Page Views**: Automatically tracked on route changes
- **User Sessions**: Complete session tracking with user identification
- **Error Tracking**: JavaScript and API errors automatically logged
- **Performance Metrics**: Core Web Vitals and loading times

### Custom Event Tracking
- **Authentication Events**: Login, signup, logout with method tracking
- **Plan Selection**: Free, Pro, Enterprise plan choices
- **Feature Usage**: Truth tests, couple mode, live detection usage
- **Conversion Events**: Signups, upgrades, waitlist submissions
- **Engagement Events**: Button clicks, form submissions, video plays

### E-commerce Tracking
- **Purchase Events**: Complete transaction tracking
- **Upgrade Flows**: Plan upgrade conversion tracking
- **Revenue Attribution**: Revenue tracking by traffic source

## 🎯 Google AdSense Integration

### Ad Placement Strategy
- **Header Ads**: 728x90 banner ads on desktop
- **Sidebar Ads**: 300x250 rectangle ads on content pages
- **In-Article Ads**: Responsive ads within content
- **Mobile Banners**: 320x50 ads optimized for mobile
- **Footer Ads**: Additional monetization opportunity

### Plan-Based Ad Display
- **Free Plan Users**: Show all ad placements
- **Pro Plan Users**: Reduced or no ads (configurable)
- **Guest Users**: Full ad experience
- **Enterprise Users**: No ads (premium experience)

### Ad Blocker Detection
- Automatic detection of ad blockers
- Graceful fallback when ads are blocked
- Optional messaging for ad blocker users

## 🛠️ Implementation Details

### File Structure
```
src/
├── utils/
│   ├── analytics.js          # GA4 tracking functions
│   └── adsense.js            # AdSense utilities
├── hooks/
│   ├── useAnalytics.js       # Analytics hook
│   └── useAdBlocker.js       # Ad blocker detection
├── components/
│   ├── ads/
│   │   ├── AdUnit.jsx        # Base ad component
│   │   ├── AdBanner.jsx      # Header/footer ads
│   │   ├── AdSidebar.jsx     # Sidebar ads
│   │   └── InArticleAd.jsx   # Content ads
│   └── analytics/
│       ├── AnalyticsProvider.jsx    # Context provider
│       └── ConversionTracker.jsx    # Conversion tracking
```

### Configuration Required

#### Google Analytics Setup
1. Replace `GA_MEASUREMENT_ID` in `src/utils/analytics.js` with your actual GA4 Measurement ID
2. Configure enhanced ecommerce in GA4 dashboard
3. Set up conversion goals for key actions

#### Google AdSense Setup
1. Replace `ca-pub-XXXXXXXXXX` in `src/utils/adsense.js` with your AdSense Publisher ID
2. Replace ad slot IDs in `adConfigs` object with your actual ad unit IDs
3. Configure ad sizes and formats in AdSense dashboard

## 📈 Analytics Events Reference

### Authentication Events
```javascript
analytics.trackLogin('google', true);           // Login with Google
analytics.trackSignup('email');                 // Email signup
analytics.trackLogin('guest');                  // Guest access
```

### Plan & Billing Events
```javascript
analytics.trackPlanSelect('pro');               // Plan selection
analytics.trackUpgradeAttempt('free', 'pro', 99); // Upgrade attempt
analytics.trackWaitlist('enterprise');          // Enterprise waitlist
```

### Feature Usage Events
```javascript
analytics.trackFeature('truth_test', 'free');   // Feature usage
analytics.trackTruthTestStart('individual');    // Test start
analytics.trackTruthTestComplete('couple', 'truthful'); // Test completion
```

### Engagement Events
```javascript
analytics.trackButtonClick('start_test');       // Button interactions
analytics.trackFormSubmit('contact_form');      // Form submissions
analytics.trackVideoPlay('demo_video');         // Media interactions
```

## 🎨 Ad Component Usage

### Header Banner
```jsx
<AdBanner 
  position="header" 
  showOnFreePlan={true}
  showOnProPlan={false}
/>
```

### Sidebar Ad
```jsx
<AdSidebar 
  sticky={true}
  showOnFreePlan={true}
  showOnProPlan={false}
/>
```

### In-Article Ad
```jsx
<InArticleAd 
  margin="40px 0"
  showOnFreePlan={true}
  showOnProPlan={false}
/>
```

## 🔧 Customization Options

### Analytics Customization
- Modify event parameters in `src/utils/analytics.js`
- Add custom dimensions and metrics
- Configure enhanced ecommerce parameters
- Set up custom conversion goals

### Ad Customization
- Adjust ad sizes in `src/utils/adsense.js`
- Modify placement rules based on user plan
- Configure responsive ad behavior
- Add custom ad styling

### Plan-Based Configuration
```javascript
// Example: Show ads based on user plan
const showAds = user?.plan === 'free' || user?.plan === 'guest';

<AdBanner showOnFreePlan={true} showOnProPlan={false} />
```

## 📊 Reporting & Insights

### GA4 Reports Available
- **User Acquisition**: Traffic sources and campaign performance
- **Engagement**: Page views, session duration, bounce rate
- **Conversions**: Signup rates, upgrade conversions, revenue
- **Retention**: User retention and lifetime value
- **Real-time**: Live user activity and events

### AdSense Reports Available
- **Revenue**: Daily, monthly revenue tracking
- **Performance**: CTR, RPM, impression data
- **Optimization**: Ad placement performance
- **Audience**: User demographics and interests

## 🚀 Deployment Checklist

### Before Going Live
- [ ] Replace placeholder IDs with actual GA4 and AdSense IDs
- [ ] Test analytics events in GA4 debug mode
- [ ] Verify ad display across different devices
- [ ] Configure conversion goals in GA4
- [ ] Set up AdSense payment information
- [ ] Test ad blocker detection functionality
- [ ] Verify GDPR compliance for EU users

### Post-Launch Monitoring
- [ ] Monitor analytics data flow
- [ ] Check ad revenue and performance
- [ ] Optimize ad placements based on performance
- [ ] A/B test different ad configurations
- [ ] Monitor Core Web Vitals impact
- [ ] Track conversion funnel performance

## 🔒 Privacy & Compliance

### GDPR Compliance
- Implement cookie consent banner
- Allow users to opt-out of tracking
- Provide data deletion options
- Update privacy policy

### Data Protection
- Anonymize IP addresses in GA4
- Respect Do Not Track headers
- Secure data transmission
- Regular privacy audits

## 📞 Support & Troubleshooting

### Common Issues
- **Analytics not tracking**: Check GA4 Measurement ID
- **Ads not displaying**: Verify AdSense Publisher ID and ad slots
- **Ad blocker detection**: Test with different ad blockers
- **Mobile ad issues**: Check responsive ad configuration

### Debug Mode
Enable GA4 debug mode for testing:
```javascript
gtag('config', 'GA_MEASUREMENT_ID', {
  debug_mode: true
});
```

This implementation provides a solid foundation for analytics and monetization while maintaining excellent user experience across all plan tiers.

