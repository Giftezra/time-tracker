import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SideComponent from "@/app/component/helper/sideComponent";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/useThemeColor";
import AuthProvider from "@/app/context/management/authentication";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileProvider from "@/app/context/management/profile/profileContext";
import ExpandScreenComponent from "@/app/component/helper/expandScreen";
import { Stack } from "expo-router";

const VersionDisplay = ({ color }: { color: string }) => {
  return (
    <View style={[styles.floatingcontainer, { backgroundColor: color }]}>
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </View>
  );
};

/**
 * Used to render a popup menu for the admin dashboard to display the version of the app when
 * the user clicks on the version number.
 * @returns
 */
const RightDisplay = ({ onPress }: { onPress: () => void }) => {
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const text = useThemeColor({}, "text");
  return (
    <View
      style={[
        styles.mainrightdisplaycontainer,
        { backgroundColor: secondaryColor },
      ]}
    >
      <View style={styles.container}>
        <Pressable style={styles.leftbuttons} onPress={onPress}>
          <MaterialIcons name="info" size={20} color={text} />
        </Pressable>
        <Pressable style={styles.leftbuttons}>
          <MaterialIcons name="notification-important" size={20} color={text} />
        </Pressable>
      </View>
    </View>
  );
};

/**
 * This is the main layout for all the components in the drawer
 */
export default function MainManagementLayout() {
  const [showVersion, setShowVersion] = useState(false);

  const background = useThemeColor({}, "background");
  const secondary = useThemeColor({}, "secondaryColor");
  const tintColor = useThemeColor({}, "tint");
  const toggleVersion = () => {
    setShowVersion(!showVersion);
  };

  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [screen, setScreen] = useState(Dimensions.get("screen"));

  /**
   * The hook is used to manage the window width and screen width of the user.
   * It updates the window width and screen width when the user changes the screen size usign the listener.
   * It removes the listener when the component is unmounted and returns the listener.
   */
  useEffect(() => {
    const updateLayout = () => {
      setWindowWidth(Dimensions.get("window").width);
      setScreen(Dimensions.get("screen"));
    };
    let listener = Dimensions.addEventListener("change", updateLayout);
    return () => {
      listener.remove();
    };
  }, [windowWidth, screen]);

  /** This displays a component when the user window is less than 50 percent of the screen */
  /** Return a text to let the user know they have to expand their screen for the best expierience */
  if (windowWidth < screen.width * 0.2) {
    return <ExpandScreenComponent />;
  }

  return (
    <AuthProvider>
      <ProfileProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView
            style={[{ flex: 1 }, { backgroundColor: background }]}
          >
            {/* The drawer is only used for mobile displays but a stack has to be returned for the web display */}
            {Platform.OS !== "web" ? (
              <Drawer
                drawerContent={() => <SideComponent />}
                screenOptions={{
                  headerShown: true,
                  headerRight: () => (
                    /**
                     * Toggle the version display when the user clicks on the info icon.
                     */
                    <RightDisplay onPress={toggleVersion} />
                  ),
                  title: "Management",
                  headerStyle: {
                    backgroundColor: secondary,
                  },
                  headerTitleStyle: {
                    fontSize: 20,
                    fontFamily: "BarlowRegular",
                    fontWeight: "700",
                    color: background,
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowColor: "black",
                  },
                  drawerStyle: {
                    backgroundColor: secondary,
                    width: "70%",
                  },
                }}
              ></Drawer>
            ) : (
              <Stack screenOptions={{ headerShown: false }} />
            )}

            {showVersion && <VersionDisplay color={secondary} />}
          </GestureHandlerRootView>
        </SafeAreaView>
      </ProfileProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  mainrightdisplaycontainer: {
    width: 100,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftbuttons: {
    padding: 2,
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.3,
    marginEnd: 10,
    borderRadius: 20,
  },

  floatingcontainer: {
    position: "absolute",
    top: 60,
    right: 0,
    padding: 5,
    borderRadius: 5,
    margin: 10,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.4,
    zIndex: 100,
  },

  versionText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    fontWeight: "500",
  },
});
