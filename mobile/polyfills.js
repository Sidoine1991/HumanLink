// Global polyfills for web to fix react-native internal module resolution
// This must run before any CommonJS modules are loaded

// Polyfill exports for CommonJS modules (needed for @react-navigation/native)
// This needs to be in the global scope, not just window
(function() {
  'use strict';
  
  // Define in global scope (works in both Node and browser)
  var globalObj = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;
  
  // Polyfill exports - must be available in module scope
  // Note: This won't work for module-scoped exports, but webpack should handle that
  // This is a fallback for cases where webpack doesn't transform properly
  
  // Polyfill Platform before any react-native code loads
  if (typeof window !== 'undefined' && !window.__RN_PLATFORM_POLYFILLED) {
    window.__RN_PLATFORM_POLYFILLED = true;
    
    // Create a mock Platform module that react-native-web can use
    const Platform = {
      OS: 'web',
      Version: 0,
      select: (obj) => obj.web || obj.default,
    };
    
    // Make it available globally
    if (typeof global !== 'undefined') {
      global.Platform = Platform;
    }
    if (typeof window !== 'undefined') {
      window.Platform = Platform;
    }
  }
})();

