// Webpack loader to inject 'var exports = {};' at the beginning of CommonJS modules
// that use 'exports' but don't define it
module.exports = function(source) {
  // Check if the module uses 'exports' (but not as a parameter or in comments)
  const usesExports = /(?:^|[^a-zA-Z_$])exports(?:\.|\[|\s*=)/m.test(source);
  
  // Check if exports is already defined in the module
  const definesExports = /(?:^|\s)(?:var|let|const)\s+exports\s*=|exports\s*=\s*\{/m.test(source);
  
  // Check if this is a CommonJS module (has module.exports or exports.something)
  const isCommonJS = /(?:^|\s)exports\.|module\.exports/m.test(source);
  
  if (isCommonJS && usesExports && !definesExports) {
    // Inject exports definition at the very beginning of the module
    // This will be in the module scope, which is what CommonJS expects
    return 'var exports = {};\n' + source;
  }
  
  return source;
};

