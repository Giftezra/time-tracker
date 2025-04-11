import React, { useEffect } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  animateArrow,
  animateText,
  easeInButton,
  fadeIn,
  textOpacity,
  transX,
} from "@/app/utils/animations/onboardingAnimation";
import { AntDesign } from "@expo/vector-icons";

interface ArrowButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
}

const ArrowButtonComponent: React.FC<ArrowButtonProps> = ({
  onPress,
  title,
  disabled = false,
}) => {
  useEffect(() => {
    animateArrow();
    animateText();
    easeInButton();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: fadeIn }],
      }}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.maincontainer,
          {
            opacity: pressed ? 0.8 : 1,
            backgroundColor: disabled ? "#CCCCCC" : "#2563EB",
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.buttonText,
            {
              opacity: textOpacity,
            },
          ]}
        >
          {title}
        </Animated.Text>

        <Animated.View
          style={{
            transform: [{ translateX: transX }],
            opacity: textOpacity,
          }}
        >
          <AntDesign name="arrowright" size={24} color="#ffffff" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default ArrowButtonComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    textTransform: "capitalize",
    fontFamily: "BarlowLight",
    fontVariant: ["small-caps"],
    fontWeight: "600",
    color: "#ffffff",
    marginRight: 12,
  },
});
