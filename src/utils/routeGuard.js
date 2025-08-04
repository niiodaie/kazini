import { ROUTES, PROTECTED_ROUTES, PLAN_RESTRICTED_ROUTES, ROLE_ACCESS_MATRIX } from './router';

/**
 * Route Guard utility for protecting routes based on authentication, role, and plan
 */

/**
 * Check if user can access a specific route
 * @param {Object} user - User object
 * @param {string} route - Route to check
 * @param {Function} checkPlanAccess - Function to check plan access
 * @returns {Object} - Access result with route, redirect, or error info
 */
export const checkRouteAccess = (user, route, checkPlanAccess) => {
  // Check if route exists
  if (!Object.values(ROUTES).includes(route)) {
    return {
      allowed: false,
      redirect: ROUTES.HOME,
      reason: 'Route not found'
    };
  }

  // Public routes (always accessible)
  const publicRoutes = [ROUTES.HOME, ROUTES.PRICING, ROUTES.AUTH];
  if (publicRoutes.includes(route)) {
    return { allowed: true };
  }

  // Truth test is accessible to all users (including guests)
  if (route === ROUTES.TRUTH_TEST) {
    return { allowed: true };
  }

  // Check authentication for protected routes
  if (PROTECTED_ROUTES.includes(route) && !user) {
    return {
      allowed: false,
      redirect: ROUTES.AUTH,
      reason: 'Authentication required',
      returnTo: route
    };
  }

  // If user exists, check role-based access
  if (user) {
    // Guest users have limited access
    if (user.role === 'guest') {
      const guestAllowedRoutes = ROLE_ACCESS_MATRIX.guest || [];
      if (!guestAllowedRoutes.includes(route)) {
        return {
          allowed: false,
          redirect: ROUTES.TRUTH_TEST,
          reason: 'Guest access limited',
          showUpgrade: true
        };
      }
    }

    // Invited partners can only access couple sessions
    if (user.role === 'invited') {
      if (route !== ROUTES.COUPLE_SESSION) {
        return {
          allowed: false,
          redirect: ROUTES.COUPLE_SESSION,
          reason: 'Invited partner access limited',
          sessionId: user.partnerSessionId
        };
      }
    }

    // Check plan-based restrictions
    const requiredFeature = PLAN_RESTRICTED_ROUTES[route];
    if (requiredFeature && checkPlanAccess) {
      if (!checkPlanAccess(user.plan, requiredFeature)) {
        return {
          allowed: false,
          redirect: route, // Stay on same route but show upgrade
          reason: 'Plan upgrade required',
          showUpgrade: requiredFeature
        };
      }
    }
  }

  return { allowed: true };
};

/**
 * Route guard middleware for navigation
 * @param {string} targetRoute - Route user wants to navigate to
 * @param {Object} user - Current user object
 * @param {Function} checkPlanAccess - Plan access checker
 * @param {Function} setCurrentView - Function to set current view
 * @param {Function} setShowUpgradePrompt - Function to show upgrade prompt
 * @param {Function} setUpgradeFeature - Function to set upgrade feature
 * @returns {boolean} - Whether navigation was allowed
 */
export const guardRoute = (
  targetRoute, 
  user, 
  checkPlanAccess, 
  setCurrentView, 
  setShowUpgradePrompt, 
  setUpgradeFeature
) => {
  const accessResult = checkRouteAccess(user, targetRoute, checkPlanAccess);

  if (accessResult.allowed) {
    setCurrentView(targetRoute);
    return true;
  }

  // Handle different types of access denial
  if (accessResult.returnTo) {
    // Store intended destination for after auth
    sessionStorage.setItem('kazini_redirect_after_auth', accessResult.returnTo);
  }

  if (accessResult.showUpgrade && setShowUpgradePrompt && setUpgradeFeature) {
    // Show upgrade prompt
    setUpgradeFeature(accessResult.showUpgrade);
    setShowUpgradePrompt(true);
    return false;
  }

  if (accessResult.sessionId) {
    // Redirect to specific session
    setCurrentView(`${accessResult.redirect}/${accessResult.sessionId}`);
    return false;
  }

  // Default redirect
  setCurrentView(accessResult.redirect);
  return false;
};

/**
 * Get allowed routes for a user
 * @param {Object} user - User object
 * @param {Function} checkPlanAccess - Plan access checker
 * @returns {Array} - Array of allowed routes
 */
export const getAllowedRoutes = (user, checkPlanAccess) => {
  const allRoutes = Object.values(ROUTES);
  const allowedRoutes = [];

  for (const route of allRoutes) {
    const accessResult = checkRouteAccess(user, route, checkPlanAccess);
    if (accessResult.allowed) {
      allowedRoutes.push(route);
    }
  }

  return allowedRoutes;
};

/**
 * Check if user needs to upgrade for a specific feature
 * @param {Object} user - User object
 * @param {string} feature - Feature to check
 * @param {Function} checkPlanAccess - Plan access checker
 * @returns {boolean} - Whether upgrade is needed
 */
export const needsUpgradeForFeature = (user, feature, checkPlanAccess) => {
  if (!user || !checkPlanAccess) return true;
  
  return !checkPlanAccess(user.plan, feature);
};

/**
 * Get user's accessible navigation items
 * @param {Object} user - User object
 * @param {Function} checkPlanAccess - Plan access checker
 * @returns {Array} - Array of navigation items user can access
 */
export const getAccessibleNavItems = (user, checkPlanAccess) => {
  const navItems = [
    { route: ROUTES.HOME, label: 'Home', icon: 'Home' },
    { route: ROUTES.TRUTH_TEST, label: 'Truth Test', icon: 'MessageCircle' },
    { route: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'LayoutDashboard' },
    { route: ROUTES.COUPLE, label: 'Couple Mode', icon: 'Users' },
    { route: ROUTES.LIVE_DETECTION, label: 'Go Live', icon: 'Camera' },
    { route: ROUTES.AI_SCHEDULER, label: 'AI Scheduler', icon: 'Calendar' },
    { route: ROUTES.TRUTH_CIRCLE, label: 'Truth Circle', icon: 'Hash' },
    { route: ROUTES.HISTORY, label: 'History', icon: 'History' },
    { route: ROUTES.TRUST_INDEX, label: 'Trust Index', icon: 'TrendingUp' },
    { route: ROUTES.PROFILE, label: 'Profile', icon: 'User' },
    { route: ROUTES.SETTINGS, label: 'Settings', icon: 'Settings' },
    { route: ROUTES.PRICING, label: 'Pricing', icon: 'CreditCard' }
  ];

  return navItems.filter(item => {
    const accessResult = checkRouteAccess(user, item.route, checkPlanAccess);
    return accessResult.allowed;
  });
};

/**
 * Redirect user to appropriate route based on their profile
 * @param {Object} user - User object
 * @returns {string} - Route to redirect to
 */
export const getRedirectRoute = (user) => {
  if (!user) {
    return ROUTES.HOME;
  }

  // Guest users go to truth test
  if (user.role === 'guest') {
    return ROUTES.TRUTH_TEST;
  }

  // Invited partners go to their couple session
  if (user.role === 'invited' && user.partnerSessionId) {
    return `${ROUTES.COUPLE_SESSION}/${user.partnerSessionId}`;
  }

  // Regular users go to dashboard
  return ROUTES.DASHBOARD;
};

export default {
  checkRouteAccess,
  guardRoute,
  getAllowedRoutes,
  needsUpgradeForFeature,
  getAccessibleNavItems,
  getRedirectRoute
};

