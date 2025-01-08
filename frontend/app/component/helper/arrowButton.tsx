import React, { useEffect } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  animateArrow,
  animateText,
  easeInButton,
  fadeIn,
  textOpacity,
  transX,
} from "@/app/utils/animations/onboardingAnimation";

const ArrowButtonComponent = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
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
      <TouchableOpacity style={styles.maincontainer} onPress={onPress}>
        <Animated.Text
          style={{
            fontSize: 20,
            textTransform: "capitalize",
            fontFamily: "BarlowLight",
            fontVariant: ["small-caps"],
            fontWeight: "700",
            opacity: textOpacity,
            padding: 10,
            textShadowRadius: 10,
          }}
        >
          {title}
        </Animated.Text>

        <Animated.View
          style={{
            transform: [{ translateX: transX }],
            opacity: textOpacity,
          }}
        >
          <MaterialCommunityIcons name="arrow-right" size={40} color="black" />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ArrowButtonComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    columnGap: 50,
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  button: {
    padding: 20,
  },
});
