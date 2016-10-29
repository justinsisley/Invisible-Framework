// Return empty string for CSS modules to avoid parse errors
require.extensions['.css'] = () => '';
