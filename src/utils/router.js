/**
 * Router utility for managing navigation and protected routes
 */

// Define route configurations
export const ROUTES = {
  HOME: 'home',
  AUTH: 'auth',
  AUTH_CALLBACK: 'auth/callback',
  DASHBOARD: 'dashboard',
  TRUTH_TEST: 'truth-test',
  TRUTH_TEST_ASYNC: 'truth-test-async',
  COUPLE: 'couple',
  COUPLE_LIVE: 'couple/live',
  COUPLE_ASYNC: 'couple/async',
  COUPLE_SESSION: 'couple-session', // For invited partners
  LIVE_DETECTION: 'live-detection',
  AI_SCHEDULER: 'ai-scheduler',
  TRUTH_CIRCLE: 'truth-circle',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  PRICING: 'pricing',
  HISTORY: 'history',
  TRUST_INDEX: 'trust-index',
  LONG_DISTANCE: 'long-distance'
};

// Define which routes require authentication
export const PROTECTED_ROUTES = [
  ROUTES.COUPLE,
  ROUTES.COUPLE_LIVE,
  ROUTES.COUPLE_ASYNC,
  ROUTES.COUPLE_SESSION,
  ROUTES.PROFILE,
  ROUTES.HISTORY,
  ROUTES.TRUST_INDEX,
  ROUTES.AI_SCHEDULER,
  ROUTES.SETTINGS,
  ROUTES.DASHBOARD
];

// Define which routes require specific plan access
export const PLAN_RESTRICTED_ROUTES = {
  [ROUTES.COUPLE]: 'coupleMode',
  [ROUTES.COUPLE_LIVE]: 'coupleMode',
  [ROUTES.COUPLE_ASYNC]: 'coupleMode',
  [ROUTES.COUPLE_SESSION]: 'coupleMode',
  [ROUTES.AI_SCHEDULER]: 'aiScheduler',
  [ROUTES.HISTORY]: 'history',
  [ROUTES.TRUST_INDEX]: 'trustIndex'
};

// Define routes accessible by user role
export const ROLE_ACCESS_MATRIX = {
  guest: [ROUTES.HOME, ROUTES.TRUTH_TEST, ROUTES.PRICING],
  user: [ROUTES.HOME, ROUTES.TRUTH_TEST, ROUTES.DASHBOARD, ROUTES.PROFILE, ROUTES.SETTINGS, ROUTES.PRICING],
  invited: [ROUTES.COUPLE_SESSION] // Invited partners can only access couple sessions
};

/**
 * Check if a route requires authentication
 */
export const isProtectedRoute = (route) => {
  return PROTECTED_ROUTES.includes(route);
};

/**
 * Check if a route requires a specific plan
 */
export const getRouteFeatureRequirement = (route) => {
  return PLAN_RESTRICTED_ROUTES[route] || null;
};

/**
 * Check if user role can access a route
 */
export const canUserRoleAccessRoute = (userRole, route) => {
  if (!userRole) return false;
  
  const allowedRoutes = ROLE_ACCESS_MATRIX[userRole] || [];
  return allowedRoutes.includes(route);
};

/**
 * Get the appropriate route based on user profile (NEW LOGIC)
 */
export const getRouteForUser = (route, user, checkPlanAccess) => {
  // If no user and route is protected, redirect to auth
  if (isProtectedRoute(route) && !user) {
    return {
      route: ROUTES.AUTH,
      redirect: route
    };
  }

  // If user exists, check role-based access
  if (user) {
    // Guest users can only access specific routes
    if (user.role === 'guest' && !canUserRoleAccessRoute('guest', route)) {
      return {
        route: ROUTES.TRUTH_TEST, // Redirect guests to truth test
        message: 'Please sign up for full access'
      };
    }

    // Invited partners can only access couple sessions
    if (user.role === 'invited' && route !== ROUTES.COUPLE_SESSION) {
      return {
        route: ROUTES.COUPLE_SESSION,
        sessionId: user.partnerSessionId
      };
    }

    // Check plan access for restricted routes
    if (getRouteFeatureRequirement(route)) {
      const feature = getRouteFeatureRequirement(route);
      if (!checkPlanAccess(user.plan, feature)) {
        return {
          route: route,
          showUpgrade: feature
        };
      }
    }
  }

  return {
    route: route
  };
};

/**
 * Handle navigation with authentication and plan checks (UPDATED)
 */
export const navigateWithAuth = (targetRoute, user, checkPlanAccess, setCurrentView, setShowUpgradePrompt, setUpgradeFeature) => {
  const routeResult = getRouteForUser(targetRoute, user, checkPlanAccess);

  if (routeResult.redirect) {
    // Store the intended destination for after auth
    sessionStorage.setItem('kazini_redirect_after_auth', routeResult.redirect);
    setCurrentView(routeResult.route);
  } else if (routeResult.showUpgrade) {
    // Show upgrade prompt for plan-restricted features
    setUpgradeFeature(routeResult.showUpgrade);
    setShowUpgradePrompt(true);
  } else if (routeResult.sessionId) {
    // Handle couple session routing for invited partners
    setCurrentView(`${routeResult.route}/${routeResult.sessionId}`);
  } else {
    // Navigate normally
    setCurrentView(routeResult.route);
  }
};

/**
 * Handle post-authentication redirect (UPDATED)
 */
export const handlePostAuthRedirect = (setCurrentView) => {
  const redirectRoute = sessionStorage.getItem('kazini_redirect_after_auth');
  if (redirectRoute) {
    sessionStorage.removeItem('kazini_redirect_after_auth');
    setCurrentView(redirectRoute);
    return true;
  }
  return false;
};

/**
 * Get the default route for a user based on their profile (NEW LOGIC)
 */
export const getDefaultRoute = (user) => {
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

  // All other authenticated users go to dashboard
  return ROUTES.DASHBOARD;
};

/**
 * Validate route exists
 */
export const isValidRoute = (route) => {
  return Object.values(ROUTES).includes(route);
};

/**
 * Get route title for display
 */
export const getRouteTitle = (route) => {
  const titles = {
    [ROUTES.HOME]: 'Home',
    [ROUTES.AUTH]: 'Sign In',
    [ROUTES.AUTH_CALLBACK]: 'Authenticating...',
    [ROUTES.DASHBOARD]: 'Dashboard',
    [ROUTES.TRUTH_TEST]: 'Truth Test',
    [ROUTES.COUPLE]: 'Couple Mode',
    [ROUTES.COUPLE_LIVE]: 'Live Session',
    [ROUTES.COUPLE_ASYNC]: 'Async Session',
    [ROUTES.COUPLE_SESSION]: 'Couple Session',
    [ROUTES.LIVE_DETECTION]: 'Live Detection',
    [ROUTES.AI_SCHEDULER]: 'AI Scheduler',
    [ROUTES.TRUTH_CIRCLE]: 'Truth Circle',
    [ROUTES.PROFILE]: 'Profile',
    [ROUTES.SETTINGS]: 'Settings',
    [ROUTES.PRICING]: 'Pricing',
    [ROUTES.HISTORY]: 'History',
    [ROUTES.TRUST_INDEX]: 'Trust Index',
    [ROUTES.LONG_DISTANCE]: 'Long Distance'
  };

  return titles[route] || 'Kazini';
};

/**
 * Get breadcrumb path for a route
 */
export const getBreadcrumb = (route) => {
  const breadcrumbs = {
    [ROUTES.HOME]: ['Home'],
    [ROUTES.AUTH]: ['Home', 'Sign In'],
    [ROUTES.DASHBOARD]: ['Dashboard'],
    [ROUTES.TRUTH_TEST]: ['Home', 'Truth Test'],
    [ROUTES.COUPLE]: ['Home', 'Couple Mode'],
    [ROUTES.COUPLE_LIVE]: ['Home', 'Couple Mode', 'Live Session'],
    [ROUTES.COUPLE_ASYNC]: ['Home', 'Couple Mode', 'Async Session'],
    [ROUTES.COUPLE_SESSION]: ['Couple Session'],
    [ROUTES.LIVE_DETECTION]: ['Home', 'Live Detection'],
    [ROUTES.AI_SCHEDULER]: ['Home', 'AI Scheduler'],
    [ROUTES.TRUTH_CIRCLE]: ['Home', 'Truth Circle'],
    [ROUTES.PROFILE]: ['Profile'],
    [ROUTES.SETTINGS]: ['Settings'],
    [ROUTES.PRICING]: ['Home', 'Pricing'],
    [ROUTES.HISTORY]: ['History'],
    [ROUTES.TRUST_INDEX]: ['Trust Index'],
    [ROUTES.LONG_DISTANCE]: ['Home', 'Long Distance']
  };

  return breadcrumbs[route] || ['Home'];
};

