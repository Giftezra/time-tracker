import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { user_image } from "@/app/utils/images";
import { useProfileContext } from "@/app/context/management/profile/profileContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { userData } from "@/app/utils/loadData";
import SubtitleThemedText from "../../helper/SubtitleThemedText";
import ThemedHeaderText from "../../helper/ThemedHeaderText";
import InnerThemedText from "../../helper/InnerThemedText";
const UserDetailsComponent = () => {
  const user = userData();

  const {
    notificationToggle,
    handleLink,
    handlePhone,
    handleToggle,
    savePreferences,
    allowEmailNotification,
    allowMarketingEmails,
    allowPushNotification,
    setAllowEmailNotification,
    setAllowMarketingEmails,
    setAllowPushNotification,
    onModalVisible,
    setOnModalVisible,
  } = useProfileContext();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (user) {
      setRole(user.is_owner ? "owner" : "staff");
    }
  }, []);

  //Call the hooke when the page unmouts to save the user preferences
  // In the server
  useEffect(() => {
    try {
      const fetchData = async () => {
        savePreferences();
      };
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [allowEmailNotification, allowMarketingEmails, allowPushNotification]);

  // Import the necceassary colors required for the component
  const secondary = useThemeColor({}, "secondaryColor");
  const innerBackground = useThemeColor({}, "innerBackground");
  const otherText = useThemeColor({}, "otherText");
  const headerText = useThemeColor({}, "headerText");
  const text = useThemeColor({}, "text");

  return (
    <ScrollView
      style={[styles.mainContainer, { backgroundColor: innerBackground }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Image source={user_image} style={styles.image} />
        <SubtitleThemedText text={role} />
        {/* Only display the edit button for mobile views */}
        {Platform.OS !== "web" && (
          <Pressable onPress={() => setOnModalVisible(true)}>
            <MaterialIcons name="edit" size={20} color="black" />
          </Pressable>
        )}
      </View>

      <View style={{ flex: 1, width: "100%" }}>
        <ThemedHeaderText text="user information" />
        <View style={styles.containers}>
          <View style={styles.textRowContainer}>
            <SubtitleThemedText text="fullname" />
            <InnerThemedText text={user?.first_name + " " + user?.last_name} />
          </View>

          <View style={styles.textRowContainer}>
            <SubtitleThemedText text="mobile" />
            <InnerThemedText text={user?.phone} />
          </View>

          <View style={styles.textRowContainer}>
            <SubtitleThemedText text="email" />
            <InnerThemedText text={user?.email} />
          </View>

          <View style={styles.textRowContainer}>
            <SubtitleThemedText text="date of birth" />
            <InnerThemedText text={user?.dob || ""} />
          </View>
        </View>

        {/* Organisation details */}
        <ThemedHeaderText text="company" />
        <View style={styles.containers}>
          <View style={styles.textRowContainer}>
            <SubtitleThemedText text="company name" />
            <InnerThemedText text={user?.company_name || ""} />
          </View>

          <View style={styles.textRowContainer}>
            <SubtitleThemedText text="official address" />
            <InnerThemedText text={user?.company_address || ""} />
          </View>

          <View style={styles.textRowContainer}>
            <SubtitleThemedText text="postcode" />
            <InnerThemedText text={user?.company_postcode || ""} />
          </View>

          {/* Made pressable to navigate to the weblink provided */}
          <Pressable
            onPress={() =>
              user?.company_website && handleLink(user.company_website)
            }
          >
            <View style={styles.textRowContainer}>
              <SubtitleThemedText text="weblink" />
              <InnerThemedText text={user?.company_website || ""} />
            </View>
          </Pressable>

          <View style={styles.textRowContainer}>
            <SubtitleThemedText text="services" />
            <InnerThemedText text={user?.company_services || ""} />
          </View>

          <Pressable
            onPress={() =>
              user?.company_helpline && handlePhone(user.company_helpline)
            }
          >
            <View>
              <SubtitleThemedText text="helpline" />
              <InnerThemedText text={user?.company_helpline || ""} />
            </View>
          </Pressable>
        </View>
      </View>

      {/* These views defines the alert and notification display toggle */}
      <View style={styles.mainNotificationtoggleContainer}>
        <View
          style={[styles.notificationContainer, { backgroundColor: secondary }]}
        >
          <ThemedHeaderText text="allow push notification" />
          <Switch
            value={allowPushNotification}
            onValueChange={(value) => setAllowPushNotification(value)}
            thumbColor={allowPushNotification ? "#fff" : "#DA5"}
            trackColor={{ true: "#DA5", false: "#fff" }}
          />
        </View>

        <View
          style={[styles.notificationContainer, { backgroundColor: secondary }]}
        >
          <ThemedHeaderText text="allow email notification" />
          <Switch
            value={allowEmailNotification}
            onValueChange={(value) => setAllowEmailNotification(value)}
            thumbColor={allowEmailNotification ? "#fff" : "#DA5"}
            trackColor={{ true: "#DA5", false: "#fff" }}
          />
        </View>

        <View
          style={[styles.notificationContainer, { backgroundColor: secondary }]}
        >
          <ThemedHeaderText text="allow marketing emails" />
          <Switch
            value={allowMarketingEmails}
            onValueChange={(value) => setAllowMarketingEmails(value)}
            thumbColor={allowMarketingEmails ? "#fff" : "#DA5"}
            trackColor={{ true: "#DA5", false: "#fff" }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default UserDetailsComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    padding: 10,
  },

  containers: {
    padding: 5,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    marginBottom: 20,
  },

  textRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  text: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontWeight: "400",
    fontFamily: "BarlowLight",
    textTransform: "lowercase",
    marginStart: 20,
  },

  headers: {
    fontSize: Platform.OS === "web" ? 12 : 15,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
    textTransform: "capitalize",
    marginTop: 10,
  },

  roleText: {
    fontSize: Platform.OS === "web" ? 15 : 18,
    fontWeight: "bold",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    marginVertical: 5,
  },

  subheader: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    marginVertical: 5,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 40,
    borderWidth: 1,
    padding: 5,
  },

  mainNotificationtoggleContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 20,
  },

  notificationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    marginVertical: 5,
  },

  notificationToggleText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
});
