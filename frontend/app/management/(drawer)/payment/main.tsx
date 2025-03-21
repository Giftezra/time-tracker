import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SideComponent from "@/app/component/helper/sideComponent";
import { useAuth } from "@/app/context/authentication";
import { useThemeColor } from "@/hooks/useThemeColor";
import MySubscriptionPlansComponent from "../../../component/management/payments/myPlans";
import SubscriptionPlansComponent from "../../../component/management/payments/plans";

const MainCheckoutComponent = () => {
  const activeBtn = useThemeColor({}, "activebtn");
  const { windowWidth } = useAuth();

  // Create a state to manaage the current page
  const [currentPage, setCurrentPage] = useState<string>("My Plans");

  // Create a function to handle the current page
  const handleCurrentPage = (page: string) => {
    setCurrentPage(page);
  };

  const header = ["My Plans", "Plans"];

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {Platform.OS === "web" ? (
          <GestureHandlerRootView
            style={[styles.webMainContainer, { width: windowWidth }]}
          >
            {/* Side component container needs a width */}
            <View style={{ width: "20%" }}>
              <SideComponent />
            </View>

            <View style={{ flex: 1 }}>
              {/* Display the buttons to toggle between my plans and plans */}
              <View style={styles.headerContainer}>
                {header.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleCurrentPage(item)}
                    style={styles.headerButton}
                  >
                    <Text style={styles.headerButtonText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
              {/* Main content container */}
              <ScrollView
                style={{ flex: 1, padding: 20 }}
                showsVerticalScrollIndicator={false}
              >
                {currentPage === "My Plans" ? (
                  <MySubscriptionPlansComponent />
                ) : (
                  <SubscriptionPlansComponent />
                )}
              </ScrollView>
            </View>
          </GestureHandlerRootView>
        ) : (
          <GestureHandlerRootView style={styles.mobileMainContainer}>
            <View style={{ flex: 1 }}>
              {/* Display the buttons to toggle between my plans and plans */}
              <View style={styles.headerContainer}>
                {header.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleCurrentPage(item)}
                    style={[
                      styles.headerButton,
                      currentPage === item && { backgroundColor: activeBtn },
                    ]}
                  >
                    <Text style={styles.headerButtonText}>{item}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Main content container */}
              <ScrollView
                style={{ flex: 1, padding: 20 }}
                showsVerticalScrollIndicator={false}
              >
                {currentPage === "My Plans" ? (
                  <MySubscriptionPlansComponent />
                ) : (
                  <SubscriptionPlansComponent />
                )}
              </ScrollView>
            </View>
          </GestureHandlerRootView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default MainCheckoutComponent;

const styles = StyleSheet.create({
  webMainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  mobileMainContainer: {
    flex: 1,
  },
  componentContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  submitButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 10,
  },

  submitButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },

  headerButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 10,
  },

  headerButtonText: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "black",
    fontWeight: "700",
  },
});
