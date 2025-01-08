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
import {userData} from "@/app/utils/loadData";


const EditUserDetailsComponent = ({
  onModalVisible,
}: {
  onModalVisible: () => void;
}) => {
  const { userDetails, handleUpdate, updateProfile } = useProfileContext();
  const innerBackground = useThemeColor({}, "innerBackground");
  const headerText = useThemeColor({}, "headerText");
  const otherText = useThemeColor({}, "otherText");

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
      style={styles.maincontainer}
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      {/* Displays for the user information update */}
      <View style={styles.headerContainer}>
        {/* Display a toggle button to close the modal when clicked
        This is only valid for mobile platforms */}
        <Text style={[styles.headerText, { color: headerText }]}>
          update user information
        </Text>
        {Platform.OS !== "web" && (
          <Pressable onPress={onModalVisible}>
            <MaterialIcons name="cancel" size={24} color="black" />
          </Pressable>
        )}
      </View>
      <View>
        <View style={[styles.container, { backgroundColor: innerBackground }]}>
          <TextInputComponent
            text="first name"
            placeholder={user?.first_name}
            value={userDetails?.firstname}
            setValue={(text) => handleUpdate("firstname", text)}
            autoComplete="given-name"
            secureTextEntry={false}
          />

          <TextInputComponent
            text="last name"
            placeholder={user?.last_name}
            value={userDetails?.lastname}
            setValue={(text) => handleUpdate("lastname", text)}
            autoComplete="family-name"
            secureTextEntry={false}
            editable={editable}
          />

          <TextInputComponent
            text="email"
            placeholder={user?.email}
            value={userDetails?.email}
            setValue={(text) => handleUpdate("email", text)}
            autoComplete="given-name"
            editable={editable}
          />

          <TextInputComponent
            text="phone"
            placeholder={user?.phone}
            value={userDetails?.phone}
            setValue={(text) => handleUpdate("phone", text)}
            autoComplete="tel"
            editable={editable}
          />

          <TextInputComponent
            text="dob"
            placeholder="date of birth"
            value={userDetails?.dob}
            setValue={(text) => handleUpdate("dob", text)}
            isMultiline={false}
            lines={0}
            autoComplete="given-name"
            secureTextEntry={false}
            editable={editable}
          />
        </View>

        {/* Displays for the company information update */}
        <View style={[styles.container, { backgroundColor: innerBackground }]}>
          <Text style={[styles.headerText, { color: headerText }]}>
            company details
          </Text>
          <TextInputComponent
            text="company name"
            placeholder={user?.company_name}
            value={userDetails?.company_name}
            setValue={(text) => handleUpdate("company_name", text)}
            editable={editable}
          />

          <TextInputComponent
            text="company address"
            placeholder={user?.company_address}
            value={userDetails?.company_postcode}
            setValue={(text) => handleUpdate("company_postcode", text)}
            editable={editable}
          />

          <TextInputComponent
            text="company email"
            placeholder={user?.comapny_email || "n/a"}
            value={userDetails?.company_email}
            setValue={(text) => handleUpdate("company_email", text)}
            editable={editable}
          />

          <TextInputComponent
            placeholder={user?.company_services}
            value={userDetails?.company_services}
            setValue={(text) => handleUpdate("company_services", text)}
            text="services"
            editable={editable}
          />

          <TextInputComponent
            placeholder={user?.company_helpline}
            value={userDetails?.company_helpline}
            setValue={(text) => handleUpdate("company_helpline", text)}
            text="helpline"
            editable={editable}
          />

          <View>
            <Text style={[styles.infoText, { color: otherText }]}>
              If you have a web domain, enter it here else, enter n/a
            </Text>
            <TextInputComponent
              placeholder={user?.company_website}
              value={userDetails?.company_website}
              setValue={(text) => handleUpdate("company_website", text)}
              text="weblink"
              editable={editable}
            />
          </View>
        </View>

        <ButtonComponent
          onPress={() => {
            if (userDetails) updateProfile(userDetails);
          }}
          title="save"
        />
      </View>
    </ScrollView>
  );
};

export default EditUserDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flexGrow: 1,
    padding: 5,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 10 : 12,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    color: "black",
    padding: 5,
    textTransform: "uppercase",
  },

  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderRadius: 3,
    width: "100%",
    marginBottom: 10,
  },

  subheaderText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "black",
    padding: 2,
    textTransform: "capitalize",
  },

  input: {
    padding: 8,
    borderWidth: 1,
    width: "100%",
    fontSize: 14,
    fontFamily: "OswaldVariable",
    fontWeight: "normal",
    textTransform: "lowercase",
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: "gray",
    padding: 10,
    paddingEnd: 20,
    paddingStart: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    flexGrow: 1,
    width: "100%",
  },

  infoText: {
    fontSize: Platform.OS === "web" ? 10 : 12,
    fontWeight: "300",
    fontFamily: "BarlowLight",
    padding: 2,
    textTransform: "lowercase",
  },
});
