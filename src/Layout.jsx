import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, PlaneTakeoff, Shield, Bell, Menu, X, LogOut, User, ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import MetaPixel from "./components/analytics/MetaPixel";
import { openExternalLink } from "./components/utils/openExternalLink";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle hardware back button from React Native
  React.useEffect(() => {
    const handleNativeMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'HARDWARE_BACK_PRESS') {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate(createPageUrl("Dashboard"));
          }
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };
    
    if (window.ReactNativeWebView) {
      window.addEventListener('message', handleNativeMessage);
      return () => window.removeEventListener('message', handleNativeMessage);
    }
  }, [navigate]);
  
  // Tab navigation history management
  const [tabHistory, setTabHistory] = React.useState({
    '/dashboard': ['/dashboard'],
    '/mytrips': ['/mytrips'],
    '/alerts': ['/alerts'],
    '/travelaides': ['/travelaides']
  });
  const [currentTab, setCurrentTab] = React.useState(location.pathname.toLowerCase());

  // Public pages that don't need the layout
  const publicPages = ['Home', 'PrivacyPolicy', 'TermsOfService', 'Legal'];
  if (publicPages.includes(currentPageName)) {
    return (
      <>
        <MetaPixel />
        {children}
      </>
    );
    }

    React.useEffect(() => {
      base44.auth.me().then(setUser).catch(() => setUser(null));
    }, []);

    const [subscriptionTier, setSubscriptionTier] = React.useState('free');

    React.useEffect(() => {
      if (user?.email) {
        base44.entities.UserNotificationPreferences.list()
          .then(prefs => {
            const userPref = prefs.find(p => p.user_email === user.email);
            if (userPref?.subscription_tier) {
              setSubscriptionTier(userPref.subscription_tier);
            }
          })
          .catch(() => setSubscriptionTier('free'));
      }
    }, [user]);

  React.useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Only update if scroll position changed significantly (> 20px difference)
      if (Math.abs(currentScrollY - lastScrollY) > 20) {
        setScrolled(currentScrollY > 20);
        lastScrollY = currentScrollY;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavItems = [
    { name: "Dashboard", path: createPageUrl("Dashboard"), icon: Home, key: '/dashboard' },
    { name: "My Trips", path: createPageUrl("MyTrips"), icon: PlaneTakeoff, key: '/mytrips' },
    { name: "Alerts", path: createPageUrl("Alerts"), icon: Bell, key: '/alerts' },
    { name: "Travel Aides", path: createPageUrl("TravelAides"), icon: Briefcase, key: '/travelaides' },
  ];

  const adminNavItems = user?.role === 'admin' ? [
    { name: "Admin Analytics", path: createPageUrl("AdminDashboard"), icon: Shield }
  ] : [];

  const isActive = (path) => location.pathname === path;

  const isMainPage = mainNavItems.some(item => item.path === location.pathname);
  const shouldShowBackButton = !isMainPage && !publicPages.includes(currentPageName);

  // Track navigation for tab history
  React.useEffect(() => {
    const currentPath = location.pathname.toLowerCase();
    const activeTab = mainNavItems.find(item => item.key === currentPath);
    
    if (activeTab) {
      setCurrentTab(activeTab.key);
      // Update history for this tab
      setTabHistory(prev => ({
        ...prev,
        [activeTab.key]: [activeTab.key]
      }));
    } else if (currentTab) {
      // Sub-page navigation - add to current tab's history
      setTabHistory(prev => ({
        ...prev,
        [currentTab]: [...(prev[currentTab] || []), currentPath]
      }));
    }
  }, [location.pathname]);

  const handleTabNavigation = (tabKey, tabPath) => {
    if (tabKey === currentTab) {
      // Clicking the current tab - always go to root of that tab
      navigate(tabPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Switching tabs - restore last page in that tab's history
      const history = tabHistory[tabKey] || [tabKey];
      const lastPage = history[history.length - 1];
      navigate(lastPage === tabKey ? tabPath : lastPage);
      setCurrentTab(tabKey);
    }
  };

  return (
    <>
      <MetaPixel />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <style>{`
        :root {
          --primary-50: #eff6ff;
          --primary-100: #dbeafe;
          --primary-200: #bfdbfe;
          --primary-500: #3b82f6;
          --primary-600: #2563eb;
          --primary-700: #1d4ed8;
          --teal-500: #14b8a6;
          --teal-600: #0d9488;
        }
      `}</style>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back Button for sub-pages on mobile */}
            {shouldShowBackButton && (
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate(createPageUrl("Dashboard"));
                  }
                }}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}

            {/* Logo */}
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
                  alt="WanderSure Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                WanderSure
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
              {adminNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium'
                      : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={createPageUrl("Profile")} className="flex items-center w-full">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={createPageUrl("NotificationSettings")} className="flex items-center w-full">
                        <Bell className="w-4 h-4 mr-2" />
                        {subscriptionTier === 'elite' ? 'Globetrotter Plan' : subscriptionTier === 'premium' ? 'Explorer Plan' : 'Basic Alerts'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        base44.auth.logout();
                        window.location.href = createPageUrl("Home");
                      }}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={createPageUrl("Profile")} className="flex items-center w-full">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={createPageUrl("NotificationSettings")} className="flex items-center w-full">
                        <Bell className="w-4 h-4 mr-2" />
                        {subscriptionTier === 'elite' ? 'Globetrotter Plan' : subscriptionTier === 'premium' ? 'Explorer Plan' : 'Basic Alerts'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        base44.auth.logout();
                        window.location.href = createPageUrl("Home");
                      }}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
            <div className="px-4 py-3 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              {adminNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium'
                      : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              </div>
              </div>
              )}
              </nav>

              {/* Bottom Tab Bar - Mobile Only */}
              <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 z-40"
                   style={{
                     paddingBottom: 'env(safe-area-inset-bottom)'
                   }}>
                <div className="flex justify-around items-center h-16">
                  {mainNavItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleTabNavigation(item.key, item.path)}
                      className={`flex flex-col items-center justify-center flex-1 h-full transition-colors min-h-[44px] ${
                        isActive(item.path)
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <item.icon className="w-6 h-6" />
                      <span className="text-xs mt-1">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <AnimatePresence mode="wait">
                <motion.main 
                  key={location.pathname}
                  className="main-content"
                  style={{
                    paddingTop: 'calc(4rem + env(safe-area-inset-top))'
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.main>
              </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 mt-20"
              style={{
                paddingBottom: 'env(safe-area-inset-bottom)'
              }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
                alt="WanderSure"
                className="w-5 h-5 object-contain"
              />
              <span className="text-gray-600 dark:text-gray-400">© 2024 WanderSure. Your journey, protected.</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                <Link to={createPageUrl("Legal")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy & Terms</Link>
                <a href="mailto:support@wandersure.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a>
              </div>
              <div className="flex gap-2 ml-4 border-l pl-4 border-gray-300">
                    <button
                      onClick={() => openExternalLink('https://www.facebook.com/profile.php?id=61586342544620')}
                      className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      </button>
                      <button
                      onClick={() => openExternalLink('https://www.instagram.com/wandersureapp/')}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 flex items-center justify-center transition-colors"
                      >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      </button>
                      </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
      </>
      );
      }