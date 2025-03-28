import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import { ProfileUpdateType } from "@/app/types/management/profile";
import TextInputComponent from "../../helper/textInput";
import ButtonComponent from "../../helper/buttons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useProfileContext } from "@/app/context/management/profile/profileContext";
import { userData } from "@/app/utils/loadData";
import ThemedHeaderText from "../../helper/ThemedHeaderText";
const EditUserDetailsComponent = () => {
  const { userDetails, handleUpdate, updateCompanyDetails, setOnModalVisible } = useProfileContext();
  const headerText = useThemeColor({}, "headerText");
  const otherText = useThemeColor({}, "otherText");
  const tintColor = useThemeColor({}, "tint");

  const [editable, setEditable] = useState<boolean>(false);

  /** The user data is loaded here to determine the user role, and determine if the user can edit the company details.
   * Note: The component is used in the login page before the user is logged in. Null value is returned if the user is not logged in.
   * If null, the component should be editable.
   */
  const user = userData();
  useEffect(() => {
    if (user) {
      if (user.is_owner) {
        setEditable(true);
      } else {
        setEditable(false);
      }
    } else if (user === null) {
      setEditable(false);
    }
  }, [user]);

  return (
    <ScrollView
      style={styles.mainContainer}
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      <View style={styles.headerContainer}>
        <ThemedHeaderText text="profile settings" />
        {Platform.OS !== "web" && (
          <Pressable onPress={() => setOnModalVisible(false)} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={headerText} />
          </Pressable>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: headerText }]}>
          Personal Information
        </Text>
        <View
          style={[styles.formContainer, { backgroundColor: tintColor }]}
        >
          <TextInputComponent
            text="First Name"
            placeholder={user?.first_name}
            value={userDetails?.firstname}
            setValue={(text) => handleUpdate("firstname", text)}
            autoComplete="given-name"
            secureTextEntry={false}
          />

          <TextInputComponent
            text="Last Name"
            placeholder={user?.last_name}
            value={userDetails?.lastname}
            setValue={(text) => handleUpdate("lastname", text)}
            autoComplete="family-name"
            secureTextEntry={false}
            editable={editable}
          />

          <TextInputComponent
            text="Email"
            placeholder={user?.email}
            value={userDetails?.email}
            setValue={(text) => handleUpdate("email", text)}
            autoComplete="given-name"
            editable={editable}
          />

          <TextInputComponent
            text="Phone"
            placeholder={user?.phone}
            value={userDetails?.phone}
            setValue={(text) => handleUpdate("phone", text)}
            autoComplete="tel"
            editable={editable}
          />

          <TextInputComponent
            text="Date of Birth"
            placeholder="Date of birth"
            value={userDetails?.dob}
            setValue={(text) => handleUpdate("dob", text)}
            isMultiline={false}
            lines={0}
            autoComplete="given-name"
            secureTextEntry={false}
            editable={editable}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: headerText }]}>
          Company Details
        </Text>
        <View
          style={[styles.formContainer, { backgroundColor: tintColor }]}
        >
          <TextInputComponent
            text="Company Name"
            placeholder={user?.company_name}
            value={userDetails?.company_name}
            setValue={(text) => handleUpdate("company_name", text)}
            editable={editable}
          />

          <TextInputComponent
            text="Company Address"
            placeholder={user?.company_address}
            value={userDetails?.company_postcode}
            setValue={(text) => handleUpdate("company_postcode", text)}
            editable={editable}
          />

          <TextInputComponent
            text="Company Email"
            placeholder={user?.comapny_email || "n/a"}
            value={userDetails?.company_email}
            setValue={(text) => handleUpdate("company_email", text)}
            editable={editable}
          />

          <TextInputComponent
            placeholder={user?.company_services}
            value={userDetails?.company_services}
            setValue={(text) => handleUpdate("company_services", text)}
            text="Services"
            editable={editable}
          />

          <TextInputComponent
            placeholder={user?.company_helpline}
            value={userDetails?.company_helpline}
            setValue={(text) => handleUpdate("company_helpline", text)}
            text="Helpline"
            editable={editable}
          />

          <Text style={[styles.infoText, { color: otherText }]}>
            If you have a web domain, enter it here else, enter n/a
          </Text>
          <TextInputComponent
            placeholder={user?.company_website}
            value={userDetails?.company_website}
            setValue={(text) => handleUpdate("company_website", text)}
            text="Website"
            editable={editable}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonComponent
          onPress={() => {
            updateCompanyDetails();
          }}
          title="Save Changes"
        />
      </View>
    </ScrollView>
  );
};

export default EditUserDetailsComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 14 : 16,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
  },

  closeButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },

  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },

  sectionTitle: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    marginBottom: 16,
  },

  formContainer: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },

  infoText: {
    fontSize: Platform.OS === "web" ? 13 : 14,
    fontFamily: "BarlowLight",
    marginTop: 16,
    marginBottom: 8,
  },

  buttonContainer: {
    padding: 24,
    paddingBottom: Platform.OS === "web" ? 24 : 40,
  },
});
