import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { router } from "expo-router";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/app/authentication";
import { useThemeColor } from "@/hooks/useThemeColor";
import TextInputComponent from "./textInput";

const LoginComponent = () => {
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const highlight = useThemeColor({}, "highlight");

  /* Get the login method and the handleLogininput from the authentication context to handle the user login session */
  const { login, handleLoginInput, loginDetails, passwordError } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(loginDetails.email, loginDetails.password);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.maincontainer}>
      <View style={[styles.container, { borderBlockColor: highlight }]}>
        <Text style={styles.headerText}>Login</Text>
        <View style={styles.itemsContainer}>
          <TextInputComponent
            text="email"
            value={loginDetails.email}
            setValue={(value) => handleLoginInput("email", value)}
            placeholder="email"
            autoComplete="email"
            keyboardType="email-address"
          />
          <TextInputComponent
            text="password"
            value={loginDetails.password}
            setValue={(value) => handleLoginInput("password", value)}
            placeholder="password"
            secureTextEntry={isPasswordVisible}
            autoComplete="password"
          />
        </View>

        {/* Conditionally display an error if the user password input id wrong*/}
        {passwordError && (
          <View style={styles.passwordErrorContainer}>
            <Text style={styles.passwordErrorText}>
              incorrect email or password, click
              <Pressable>
                <Text style={styles.forgottenPassword}>forgetten password</Text>
              </Pressable>{" "}
              to refresh
            </Text>
          </View>
        )}
        {/* Navigate to the page on the user role passed as prop after login */}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: inactivebtn }]}
          onPress={handleLogin}
        >
          {/* Conditionally show the loading or text login given the loading state */}
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default LoginComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: Platform.OS === "web" ? 10 : 15,
    borderRadius: 5,
    backgroundColor: "white",
    width: Platform.OS === "web" ? "40%" : "70%",
    minWidth: 250,
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.5,
    borderWidth: 2,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 15 : 20,
    fontWeight: "normal",
    marginBottom: 5,
    fontFamily: "BarlowRegular",
    textTransform: "uppercase",
  },

  itemsContainer: {
    width: "100%",
    padding: 2,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    rowGap: 10,
  },

  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 1,
    borderWidth: 0.5,
  },

  input: {
    padding: Platform.OS === "web" ? 5 : 10,
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
  },

  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    padding: Platform.OS === "web" ? 5 : 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.4,
    marginTop: 20,
  },

  buttonText: {
    color: "white",
    fontSize: Platform.OS === "web" ? 12 : 16,
    fontWeight: "700",
    fontFamily: "OswaldVariable",
  },

  icons: {
    alignItems: "center",
    padding: 3,
  },

  passwordErrorContainer: {
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },

  passwordErrorText: {
    color: "red",
    fontSize: Platform.OS === "web" ? 8 : 12,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
  },

  forgottenPassword: {
    color: "blue",
    fontSize: Platform.OS === "web" ? 7 : 10,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    marginHorizontal: 4,
  },
});
