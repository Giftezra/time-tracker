import { Animated, Easing, ViewStyle } from "react-native";

interface BorderAnimationConfig {
  duration?: number;
  colors: string[];
}

export const createBorderAnimation = (config: BorderAnimationConfig) => {
  const { duration = 3000, colors } = config;
  const animatedValue = new Animated.Value(0);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const interpolatedColors = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: colors,
  });

  const getBorderStyle = () =>
    ({
      borderColor: interpolatedColors,
      borderWidth: 2,
    } as unknown as ViewStyle);

  return {
    startAnimation,
    getBorderStyle,
    animatedValue,
  };
};

// Usage example:
/*
const borderAnimation = createBorderAnimation({
  colors: ['#FF0000', '#00FF00', '#0000FF', '#FF0000'],
  duration: 3000,
});

// In your component:
useEffect(() => {
  borderAnimation.startAnimation();
}, []);

// In your view:
<Animated.View style={[styles.container, borderAnimation.getBorderStyle()]}>
  {children}
</Animated.View>
*/
