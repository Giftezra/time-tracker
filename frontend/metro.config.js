const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add web-specific extensions FIRST
config.resolver.resolveRequest = (context, moduleName, platform) => {
  console.log(`Resolving: ${moduleName} (${platform})`);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
