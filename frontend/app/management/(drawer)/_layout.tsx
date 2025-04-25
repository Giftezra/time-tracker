import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  BackHandler,
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
import SideComponentProvider from "@/app/context/staff/sideComponentProvider";
import AlertConfig from "@/app/types/management/AlertConfig";

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
  const [backPressCount, setBackPressCount] = useState(0);

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

  useEffect(() => {
    if (backPressCount === 1) {
      const timer = setTimeout(() => {
        setBackPressCount(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [backPressCount]);

  if (windowWidth < screen.width * 0.2) {
    return <ExpandScreenComponent />;
  }

  /**
   * Handle the users back button press on the header. 
   * When there is no more pages pushed into the router stack, display an alert to confirm the exit of the app.
   * If pressed to confirm, exit the app. else do nothing.
   * @param param setAlertConfig, setIsAlertVisible are the functions to set the alert config and the alert visibility.
   * @returns 
   */
  const handleBackButton = ({
    setAlertConfig,
    setIsAlertVisible,
  }: {
    setAlertConfig: (config: AlertConfig) => void;
    setIsAlertVisible: (visible: boolean) => void;
  }) => {
    const isLastScene = router.canGoBack();
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {isLastScene ? (
          <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
            <AntDesign name="arrowleft" size={24} color={background} />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              if (backPressCount === 0) {
                setIsAlertVisible(true);
                setAlertConfig({
                  title: "Exit App",
                  message:
                    "You are about to exit the app. Do you want to continue this action?",
                  onConfirm: () => {
                    BackHandler.exitApp();
                  },
                  isVisible: true,
                  onClose() {
                    setIsAlertVisible(false);
                  },
                });
              }
            }}
            style={{ marginRight: 10 }}
          >
            <AntDesign name="arrowleft" size={24} color={background} />
          </Pressable>
        )}
      </View>
    );
  };

  const Header = () => {
    const { setAlertConfig, setIsAlertVisible } = useAuth();

    return (
      <View style={[styles.header, { backgroundColor: tintColor }]}>
        {handleBackButton({ setAlertConfig, setIsAlertVisible })}
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
            <Text style={{ fontSize: 20, color: "red " }}>ℹ️</Text>
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
        <SideComponentProvider>
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
        </SideComponentProvider>
      </GestureHandlerRootView>

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
