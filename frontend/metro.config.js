const { getDefaultConfig } = require("@expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Enable .cjs files (required for some dependencies)
config.resolver.sourceExts.push("cjs");

// Force Metro to resolve 'react-native' to 'react-native-web'
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native": path.resolve(__dirname, "node_modules/react-native-web"),
};

// Fix Platform module resolution
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native/Libraries/Utilities/Platform") {
    return {
      filePath: path.resolve(
        __dirname,
        "node_modules/react-native-web/dist/exports/Platform"
      ),
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
