import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SideComponent from "@/app/component/helper/sideComponent";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/useThemeColor";
import AuthProvider from "@/app/authentication";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileProvider from "@/app/context/management/profile/profileContext";
import ExpandScreenComponent from "@/app/component/helper/expandScreen";
import { router, Stack } from "expo-router";
import { useAuth } from "@/app/authentication";
import { userData } from "@/app/utils/loadData";
import MessageProvider from "@/app/context/management/messages/messageContext";

const VersionDisplay = ({ color }: { color: string }) => {
  return (
    <View style={[styles.versioncontainer, { backgroundColor: color }]}>
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </View>
  );
};

export default function MainManagementLayout() {
  const [showVersion, setShowVersion] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
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

  const user = userData();

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

  const handleBackButton = () => {
    const isLastScene = router.canGoBack();
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {isLastScene ? (
          <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
            <AntDesign name="arrowleft" size={24} color={background} />
          </Pressable>
        ) : (
          <Text style={{ color: background, fontFamily: "BarlowRegular" }}>
            
          </Text>
        )}
      </View>
    );
  };

  /* Create a component to display the header which will be used in the stack to display a drawer */
  const Header = () => {
    return (
      <View style={[styles.header, { backgroundColor: tintColor }]}>
        {handleBackButton()}
        <View style={styles.innerContainer}>
          <Pressable onPress={() => setShowDrawer(!showDrawer)}>
            <Ionicons name="menu" size={24} color={background} />
          </Pressable>
          <Text style={{ fontSize: 20, fontFamily: "BarlowMedium" }}>
            {user?.company_name || "Company Name"}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Pressable onPress={() => setShowVersion(!showVersion)}>
            <Text style={{ fontSize: 20, color:'red '}}>ℹ️</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView
        style={[{ flex: 1 }, { backgroundColor: background }]}
      >
        <MessageProvider>
          {Platform.OS !== "web" && <Header />}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="calendar" options={{ headerShown: false }} />
            <Stack.Screen name="client" options={{ headerShown: false }} />
            <Stack.Screen name="employee" options={{ headerShown: false }} />
            <Stack.Screen name="messages" options={{ headerShown: false }} />
            <Stack.Screen
              name="notification"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="payment" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="task" options={{ headerShown: false }} />
          </Stack>
          {showVersion && <VersionDisplay color={secondary} />}
        </MessageProvider>
      </GestureHandlerRootView>

      {/* Display the drawer when the user clicks on the menu button in the header, and also contains the close button to close the drawer */}
      {showDrawer && (
        <>
          <Pressable
            style={styles.overlay}
            onPress={() => setShowDrawer(false)}
          />
          <View style={styles.sideComponent}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <SideComponent closeDrawer={() => setShowDrawer(false)} />
            </ScrollView>
            <Pressable
              style={styles.closeDrawer}
              onPress={() => setShowDrawer(false)}
            >
              <Text>❌</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainrightdisplaycontainer: {
    width: 100,
    alignItems: "flex-end",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftbuttons: {
    padding: 5,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 99,
  },

  versioncontainer: {
    position: "absolute",
    top: 20,
    right: 0,
    padding: 5,
    borderRadius: 5,
    margin: 10,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.4,
    zIndex: 100,
  },

  sideComponent: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maxWidth: "70%",
    zIndex: 100,
    backgroundColor: "white",
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },

  closeDrawer: {
    position: "absolute",
    top: 10,
    right: -50,
    zIndex: 100,
    borderRadius: 10,
    backgroundColor: "gray",
    padding: 10,
    shadowColor: "#000",
  },

  versionText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 5,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
