import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { UserResponseType } from "@/app/types/management/onboarding";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  Pressable,
  Switch,
} from "react-native-gesture-handler";
import { all } from "axios";
import { useSideComponentContext } from "@/app/context/staff/sideComponentProvider";
import { useThemeColor } from "@/hooks/useThemeColor";

const image = require("@/assets/images/user image.jpg");

const ProfileDisplayComponent = ({
  user,
  onPress,
}: {
  user: UserResponseType | null;
  onPress: () => void;
}) => {
  const {
    handlePhoneCall,
    handleWebsiteCall,
    savePreferences,
    allowEmailNotification,
    allowMarketingEmails,
    allowPushNotification,
    setAllowEmailNotification,
    setAllowMarketingEmails,
    setAllowPushNotification,
  } = useSideComponentContext();

  //Call the hooke when the page unmouts to save the user preferences
  // In the server
  useEffect(() => {
    return () => {
      savePreferences();
    };
  }, [allowEmailNotification, allowMarketingEmails, allowPushNotification]);

  /* Import colors */
  const innerBackgroundColor = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");

  if (!user) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          style={styles.maincontainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Image source={image} style={styles.image} />
            <Pressable onPress={onPress}>
              <Text style={styles.close}>close</Text>
            </Pressable>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>full name</Text>
            <Text style={styles.text}>
              {user.first_name + " " + user.last_name}
            </Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>email</Text>
            <Text style={styles.text}>{user.email}</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>mobile number</Text>
            <Text style={styles.text}>{user.phone}</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>full address</Text>
            <View style={styles.text}>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>address</Text>
                <Text style={styles.text}>{user.address}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>postcode</Text>
                <Text style={styles.text}>{user.postcode}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>city</Text>
                <Text style={styles.text}>{user.city}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>country</Text>
                <Text style={styles.text}>{user.country}</Text>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>date of birth</Text>
            <Text style={styles.text}>{user.dob}</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>company detail</Text>
            <View style={styles.innerContainer}>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company name</Text>
                <Text style={styles.text}>{user.company_name}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company services</Text>
                <Text style={styles.text}>{user.company_services}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company address</Text>
                <Text style={styles.text}>{user.company_address}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company postcode</Text>
                <Text style={styles.text}>{user.company_postcode}</Text>
              </View>

              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company helpline</Text>
                <Pressable
                  onPress={() => handlePhoneCall(user.company_helpline)}
                  style={styles.pressables}
                >
                  <Text style={styles.text}>{user.company_helpline}</Text>
                </Pressable>
              </View>

              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company website</Text>
                <Pressable
                  onPress={() => handleWebsiteCall(user.company_website)}
                  style={styles.pressables}
                >
                  <Text style={styles.text}>{user.company_website}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* This part contains the toggle for user to select their  */}
          <View style={styles.allowNotificationContainer}>
            <View
              style={[
                styles.notificationButton,
                { backgroundColor: innerBackgroundColor },
              ]}
            >
              <Text style={[styles.innerHeaderText, { color: text }]}>
                allow push notification
              </Text>
              <Switch
                value={allowPushNotification}
                onValueChange={(value) => setAllowPushNotification(value)}
                thumbColor={allowPushNotification ? "green" : "blue"}
                trackColor={{ true: "blue", false: "green" }}
              />
            </View>

            <View
              style={[
                styles.notificationButton,
                { backgroundColor: innerBackgroundColor },
              ]}
            >
              <Text style={[styles.innerHeaderText, { color: text }]}>
                allow email notification
              </Text>
              <Switch
                value={allowEmailNotification}
                onValueChange={(value) => setAllowEmailNotification(value)}
                thumbColor={allowEmailNotification ? "green" : "blue"}
                trackColor={{ true: "blue", false: "green" }}
              />
            </View>

            <View
              style={[
                styles.notificationButton,
                { backgroundColor: innerBackgroundColor },
              ]}
            >
              <Text style={[styles.innerHeaderText, { color: text }]}>
                allow marketing emails
              </Text>
              <Switch
                value={allowMarketingEmails}
                onValueChange={(value) => setAllowMarketingEmails(value)}
                thumbColor={allowMarketingEmails ? "green" : "blue"}
                trackColor={{ true: "blue", false: "green" }}
              />
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default ProfileDisplayComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
  },

  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    alignItems: "center",
    marginVertical: 5,
  },

  innerContainer: {
    flexDirection: "column",
    padding: 2,
    rowGap: 5,
  },

  paddedContainer: {
    padding: 2,
    columnGap: 5,
  },

  pressables: {
    padding: 5,
  },

  allowNotificationContainer: {
    flexDirection: "column",
    padding: 5,
    borderRadius: 2,
    borderWidth: 1,
    marginHorizontal: 2,
    marginVertical: 5,
  },

  notificationButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    padding: 1,
    textTransform: "capitalize",
  },

  innerHeaderText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    padding: 1,
    textTransform: "capitalize",
  },

  text: {
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "BarlowLight",
    padding: 1,
    textTransform: "capitalize",
  },

  close: {
    padding: 5,
    fontFamily: "BarlowRegular",
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "600",
  },
});
