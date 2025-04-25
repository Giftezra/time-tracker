import { Animated, Easing } from "react-native";

export const useTextBounceAnimation = () => {
  const bounceValue = new Animated.Value(0);

  const startBounceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -10, // Move up
          duration: 300,
          useNativeDriver: true,
          easing: Easing.bounce
      }),
      Animated.timing(bounceValue, {
        toValue: 0, // Return to original position
        duration: 300,
        useNativeDriver: true,
          easing: Easing.bounce,
        }),
      ])
    ).start();
  };

  return { bounceValue, startBounceAnimation };
};
