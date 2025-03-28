import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/app/authentication";
import RegistrationTextInputComponent from "@/app/component/helper/registrationTextinput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ArrowButtonComponent from "@/app/component/helper/arrowButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const SecondPageComponent = () => {
  const { ownerData, handleUserInput, registerOwner, registrationMessage } =
    useAuth();

  const inactiveBtn = useThemeColor({}, "inactivebtn");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>(); // Confirm password
  const [enteraddress, setEnterAddress] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1, width: "100%" }}
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ padding: 5 }}>
              <Text
                style={{
                  fontFamily: "BarlowRegular",
                  fontSize: 20,
                  fontWeight: 400,
                }}
              >
                Hello thats a nice start{" "}
                <Text
                  style={{
                    fontSize: 25,
                    textTransform: "capitalize",
                    fontWeight: "700",
                    fontVariant: ["small-caps"],
                  }}
                >
                  {ownerData?.first_name}
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "BarlowRegular",
                  fontWeight: "300",
                }}
              >
                you now have to enter your address below
              </Text>
            </View>

            <View style={{ padding: 5, marginTop: 5 }}>
              <Text style={styles.headerText}>post code</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <RegistrationTextInputComponent
                    placeholder="post code"
                    value={ownerData?.postcode}
                    setValue={(value) => handleUserInput("postcode", value)}
                    autoComplete="postal-code"
                  />
                </View>
                <TouchableOpacity style={{ padding: 10 }}>
                  <Text
                    style={{
                      color: inactiveBtn,
                      textTransform: "capitalize",
                      fontFamily: "BarlowRegular",
                      fontSize: 15,
                    }}
                  >
                    find address
                  </Text>
                </TouchableOpacity>
              </View>

              <Pressable
                onPress={() => setEnterAddress(!enteraddress)}
                style={{
                  padding: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "BarlowRegular",
                    fontWeight: "300",
                  }}
                >
                  enter manually
                </Text>
              </Pressable>
            </View>

            {/* conditionally render the textinputs ig the user choses to enter the address manually */}

            {enteraddress && (
              <View style={{ padding: 5, marginTop: 5 }}>
                {/* Contains the user address */}
                <View style={{ padding: 5, marginTop: 5 }}>
                  <Text style={styles.headerText}>address</Text>
                  <RegistrationTextInputComponent
                    placeholder="address line 1"
                    value={ownerData?.address}
                    setValue={(value) => handleUserInput("address1", value)}
                    inputMode="text"
                    autoComplete="address-line1"
                  />
                </View>

                <View style={{ padding: 5, marginTop: 5 }}>
                  <Text style={styles.headerText}>city</Text>
                  <RegistrationTextInputComponent
                    placeholder="city"
                    value={ownerData?.city}
                    setValue={(value) => handleUserInput("city", value)}
                    autoComplete="address-line2"
                    inputMode="text"
                  />
                </View>
              </View>
            )}

            {/* Contains the user password */}
            <View style={{ padding: 5, marginTop: 5 }}>
              <Text style={styles.headerText}>password</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <RegistrationTextInputComponent
                    placeholder="password"
                    value={ownerData?.password}
                    setValue={(value) => handleUserInput("password", value)}
                    inputMode="text"
                    secureTextEntry={isPasswordVisible}
                  />
                </View>
                <Pressable
                  style={{ padding: 5 }}
                  onPress={togglePasswordVisibility}
                >
                  <MaterialCommunityIcons name="eye" size={24} color="black" />
                </Pressable>
              </View>
            </View>

            {/* Confirm password */}
            <View style={{ padding: 5, marginTop: 5, marginBottom: 5 }}>
              <Text style={styles.headerText}>confirm password</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <RegistrationTextInputComponent
                    placeholder="password"
                    value={confirmPassword}
                    setValue={(value) => setConfirmPassword(value)}
                    inputMode="text"
                    secureTextEntry={isConfirmPasswordVisible}
                  />
                </View>
                <Pressable
                  style={{ padding: 5 }}
                  onPress={toggleConfirmPasswordVisibility}
                >
                  <MaterialCommunityIcons name="eye" size={24} color="black" />
                </Pressable>
              </View>

              {/* Describes what the password should look like */}
              <View style={{ padding: 5 }}>
                <Text
                  style={[
                    styles.passwordText,
                    (ownerData?.password?.length ?? 0) < 8
                      ? { color: "red" }
                      : { color: "green" },
                  ]}
                >
                  must be at least 8 digits long
                </Text>
                <Text
                  style={[
                    styles.passwordText,
                    (ownerData?.password?.length ?? 0) < 8 ||
                    !/\d/.test(ownerData?.password ?? "")
                      ? { color: "red" }
                      : { color: "green" },
                  ]}
                >
                  must contain alphabets and numbers
                </Text>
              </View>

              {/* Conditionally render warning text if passwords do not match */}
              {ownerData?.password !== confirmPassword && (
                <Text style={{ color: "red", padding: 5 }}>
                  passwords do not match
                </Text>
              )}
            </View>

            {/* Conditionally display the button if passwords are a match */}
            {ownerData?.password === confirmPassword && ownerData && (
              <ArrowButtonComponent
                onPress={() => registerOwner(ownerData)}
                title="create account"
              />
            )}
          </ScrollView>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default SecondPageComponent;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    textShadowOffset: { width: 0.2, height: 0.2 },
    textShadowColor: "black",
    padding: 5,
    marginStart: 5,
  },

  passwordText: {
    fontSize: 12,
    textTransform: "lowercase",
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  },
});
