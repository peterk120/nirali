'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  // Check if consent has been given on component mount
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after a short delay to allow page to load
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(newPreferences);
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
    
    // Load analytics and marketing scripts if accepted
    loadAnalyticsScripts(newPreferences);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie_consent', 'custom');
    setShowBanner(false);
    setShowModal(false);
    
    // Load analytics and marketing scripts based on preferences
    loadAnalyticsScripts(preferences);
  };

  const loadAnalyticsScripts = (prefs: CookiePreferences) => {
    if (typeof window !== 'undefined') {
      // Load Google Analytics if analytics cookies are accepted
      if (prefs.analytics) {
        // In a real implementation, this would load the GA script
        // For now, we'll just log to demonstrate the functionality
        console.log('Loading Google Analytics...');
      }
      
      // Load Meta Pixel if marketing cookies are accepted
      if (prefs.marketing) {
        // In a real implementation, this would load the Meta Pixel script
        // For now, we'll just log to demonstrate the functionality
        console.log('Loading Meta Pixel...');
      }
    }
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key !== 'essential') { // Essential cookies cannot be toggled off
      setPreferences(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-4"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                We use cookies to improve your experience. See our{' '}
                <a 
                  href="/privacy-policy" 
                  className="text-rose-500 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Cookie Settings</h3>
                
                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div className="flex items-start justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Essential Cookies</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        These cookies are necessary for the website to function and cannot be switched off.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Always Active
                      </span>
                    </div>
                  </div>
                  
                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        These cookies allow us to measure visitors and see how pages are used.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('analytics')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.analytics ? 'bg-rose-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Marketing Cookies */}
                  <div className="flex items-start justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        These cookies may be set through our site by our advertising partners.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('marketing')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.marketing ? 'bg-rose-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieBanner;