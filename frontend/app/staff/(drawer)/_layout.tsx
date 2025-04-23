import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { router, Stack } from "expo-router";

import StaffSideComponent from "@/app/component/staff/helper/sideComponent";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/app/authentication";
import SideComponentProvider from "@/app/context/staff/sideComponentProvider";
import StaffTaskProvider from "@/app/context/staff/staffTaskProvider";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import MessageProvider from "@/app/context/management/messages/messageContext";

const MainStaffMainLayout = () => {
  const backgroundColor = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const background = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const secondary = useThemeColor({}, "secondaryColor");

  const [showDrawer, setShowDrawer] = useState(false);
  const [showVersion, setShowVersion] = useState(false);

  const { user } = useAuth();

  const handleBackButton = () => {
    const isLastScene = router.canGoBack();
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {isLastScene ? (
          <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
            <AntDesign name="arrowleft" size={24} color={background} />
          </Pressable>
        ) : (
          <Text
            style={{ color: background, fontFamily: "BarlowRegular" }}
          ></Text>
        )}
      </View>
    );
  };

  const VersionDisplay = ({ color }: { color: string }) => {
    return (
      <View style={[styles.versioncontainer, { backgroundColor: color }]}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
            <Text style={{ fontSize: 20, color: "red " }}>ℹ️</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SideComponentProvider>
      <StaffTaskProvider>
        <MessageProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Header />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="dashboard" options={{ headerShown: false }} />
              <Stack.Screen
                name="avaliability"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="events" options={{ headerShown: false }} />
              <Stack.Screen name="messages" options={{ headerShown: false }} />
              <Stack.Screen
                name="notifications"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="task" options={{ headerShown: false }} />
              <Stack.Screen name="timesheet" options={{ headerShown: false }} />
            </Stack>
            {showVersion && <VersionDisplay color={secondary} />}
          </GestureHandlerRootView>
        </MessageProvider>
      </StaffTaskProvider>
      {/* Display the drawer when the user clicks on the menu button in the header */}
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
              <StaffSideComponent closeDrawer={() => setShowDrawer(false)} />
            </ScrollView>
            <Pressable
              style={styles.closeDrawer}
              onPress={() => setShowDrawer(false)}
            >
              <Text style={{ fontSize: 15, color: "white" }}>❌</Text>
            </Pressable>
          </View>
        </>
      )}
    </SideComponentProvider>
  );
};

export default MainStaffMainLayout;

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
    top: 5,
    right: -40,
    zIndex: 100,
    borderRadius: 10,
    backgroundColor: "gray",
    padding: 10,
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

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 99,
  },
});
