import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {user_image} from "@/app/utils/images";
import { useProfileContext } from "@/app/context/management/profile/profileContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import {userData} from "@/app/utils/loadData";

const UserDetailsComponent: React.FC<{
  onModalVisible: () => void;
}> = ({ onModalVisible }) => {
  const user = userData();

  const { notificationToggle, handleLink, handlePhone, handleToggle } =
    useProfileContext();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (user) {
      setRole(user.is_owner ? "owner" : "staff");
    }
  }, []);

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
        <Text style={[styles.roleText, { color: headerText }]}>{role}</Text>
        {/* Only display the edit button for mobile views */}
        {Platform.OS !== "web" && (
          <Pressable onPress={onModalVisible}>
            <MaterialIcons name="edit" size={20} color="black" />
          </Pressable>
        )}
      </View>

      <View style={{ flex: 1, width: "100%" }}>
        <Text style={[styles.headers, { color: headerText }]}>
          user information
        </Text>
        <View style={styles.containers}>
          <View style={styles.textRowContainer}>
            <Text style={[styles.subheader, { color: otherText }]}>
              fullname
            </Text>
            <Text style={[styles.text, { color: text }]}>
              {user?.first_name + " " + user?.last_name}
            </Text>
          </View>

          <View style={styles.textRowContainer}>
            <Text style={[styles.subheader, { color: otherText }]}>mobile</Text>
            <Text style={[styles.text, { color: text }]}>{user?.phone}</Text>
          </View>

          <View style={styles.textRowContainer}>
            <Text style={[styles.subheader, { color: otherText }]}>email</Text>
            <Text style={[styles.text, { color: text }]}>{user?.email}</Text>
          </View>

          <View style={styles.textRowContainer}>
            <Text style={[styles.subheader, { color: otherText }]}>
              date of birth
            </Text>
            <Text style={[styles.text, { color: text }]}>{user?.dob}</Text>
          </View>
        </View>

        {/* Organisation details */}
        <Text style={[styles.headers, { color: headerText }]}>company</Text>
        <View style={styles.containers}>
          <View style={styles.textRowContainer}>
            <Text style={[styles.subheader, { color: otherText }]}>
              company name
            </Text>
            <Text style={[styles.text, { color: text }]}>
              {user?.company_name}
            </Text>
          </View>

          <View style={styles.textRowContainer}>
            <Text style={[styles.subheader, { color: otherText }]}>
              official address
            </Text>
            <Text style={[styles.text, { color: text }]}>
              {user?.company_address}
            </Text>
          </View>

          <View style={styles.textRowContainer}>
            <Text style={[styles.subheader, { color: otherText }]}>
              postcode
            </Text>
            <Text style={[styles.text, { color: text }]}>
              {user?.company_postcode}
            </Text>
          </View>

          {/* Made pressable to navigate to the weblink provided */}
          <Pressable
            onPress={() =>
              user?.company_website && handleLink(user.company_website)
            }
          >
            <View style={styles.textRowContainer}>
              <Text style={[styles.subheader, { color: otherText }]}>
                weblink
              </Text>
              <Text style={[styles.text, { color: text }]}>
                {user?.company_website}
              </Text>
            </View>
          </Pressable>

          <View style={styles.textRowContainer}>
            <Text style={[styles.subheader, { color: otherText }]}>
              services
            </Text>
            <Text style={[styles.text, { color: text }]}>
              {user?.company_services}
            </Text>
          </View>

          <Pressable
            onPress={() =>
              user?.company_helpline && handlePhone(user.company_helpline)
            }
          >
            <View>
              <Text style={[styles.subheader, { color: otherText }]}>
                helpline
              </Text>
              <Text style={[styles.text, { color: text }]}>
                {user?.company_helpline}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* These views defines the alert and notification display toggle */}
      <View style={styles.mainNotificationtoggleContainer}>
        <Pressable
          style={[styles.notificationContainer, { backgroundColor: secondary }]}
          onPress={() => handleToggle("marketing alert")}
        >
          <View style={styles.toggleButton}>
            <View
              style={[
                styles.innerToggleButton,
                notificationToggle?.includes("marketing alert") && {
                  backgroundColor: "green",
                },
              ]}
            />
          </View>
          <Text style={[styles.notificationToggleText, { color: otherText }]}>
            Allow marketing alert
          </Text>
        </Pressable>

        <Pressable
          style={[styles.notificationContainer, { backgroundColor: secondary }]}
          onPress={() => handleToggle("push notification")}
        >
          <View style={styles.toggleButton}>
            <View
              style={[
                styles.innerToggleButton,
                notificationToggle?.includes("push notification") && {
                  backgroundColor: "green",
                },
              ]}
            />
          </View>
          <Text style={[styles.notificationToggleText, { color: otherText }]}>
            Allow push notification
          </Text>
        </Pressable>

        <Pressable
          style={[styles.notificationContainer, { backgroundColor: secondary }]}
          onPress={() => handleToggle("email notification")}
        >
          <View style={styles.toggleButton}>
            <View
              style={[
                styles.innerToggleButton,
                notificationToggle?.includes("email notification") && {
                  backgroundColor: "green",
                },
              ]}
            />
          </View>
          <Text style={[styles.notificationToggleText, { color: otherText }]}>
            Allow email notification
          </Text>
        </Pressable>
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
  },

  notificationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    marginVertical: 10,
  },

  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  innerToggleButton: {
    backgroundColor: "white",
    width: 15,
    height: 15,
    borderRadius: 30,
  },

  notificationToggleText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginStart: 5,
  },
});
