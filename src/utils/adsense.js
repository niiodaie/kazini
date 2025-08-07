// Google AdSense Utility Functions
// Replace 'ca-pub-XXXXXXXXXX' with your actual AdSense Publisher ID

// Initialize Google AdSense
export const initializeAdSense = () => {
  // Load AdSense script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);

  // Initialize AdSense
  (window.adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: 'ca-pub-XXXXXXXXXX',
    enable_page_level_ads: true
  });
};

// Load ad unit
export const loadAdUnit = (adSlot, adFormat = 'auto', fullWidthResponsive = true) => {
  if (typeof window.adsbygoogle !== 'undefined') {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }
};

// Refresh ads (for SPA navigation)
export const refreshAds = () => {
  if (typeof window.adsbygoogle !== 'undefined') {
    try {
      window.adsbygoogle.forEach((ad) => {
        if (ad && ad.push) {
          ad.push({});
        }
      });
    } catch (error) {
      console.error('AdSense refresh error:', error);
    }
  }
};

// Check if ads are blocked
export const checkAdBlocker = () => {
  return new Promise((resolve) => {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-10000px';
    document.body.appendChild(testAd);
    
    setTimeout(() => {
      const isBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      resolve(isBlocked);
    }, 100);
  });
};

// Ad configuration for different placements
export const adConfigs = {
  header: {
    slot: 'HEADER_AD_SLOT_ID',
    format: 'horizontal',
    size: '728x90'
  },
  sidebar: {
    slot: 'SIDEBAR_AD_SLOT_ID',
    format: 'vertical',
    size: '300x250'
  },
  footer: {
    slot: 'FOOTER_AD_SLOT_ID',
    format: 'horizontal',
    size: '728x90'
  },
  mobile_banner: {
    slot: 'MOBILE_BANNER_AD_SLOT_ID',
    format: 'horizontal',
    size: '320x50'
  },
  in_article: {
    slot: 'IN_ARTICLE_AD_SLOT_ID',
    format: 'fluid',
    size: 'responsive'
  }
};

