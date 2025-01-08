import { useEffect } from "react";
import { Animated, Easing } from "react-native";

const transX = new Animated.Value(0);
const textOpacity = new Animated.Value(0);
const fadeIn = new Animated.Value(0);
const tranY = new Animated.Value(0);
const textbounce = new Animated.Value(0);

/**
 * This method animated objects to move from one position to another in an horizontal direction.
 */
const animateArrow = () => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(transX, {
        toValue: 100,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(transX, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ])
  ).start();
};

const animateText = () => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ])
  ).start();
};

/**
 * The method is designed to ease in the button component in the onboarding page.
 */
const easeInButton = () => {
  Animated.loop(
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
    ])
  ).stop();
};


const arrowDown = () => {
    Animated.loop(
        Animated.timing(tranY, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        })
    ).start();
}

/** 
 * Method is designed to bounce texts inside a button component
 * 
 */
const bounceText = () => {
    Animated.loop(
        Animated.sequence([
            Animated.timing(textbounce, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.bounce,
            }),
            Animated.timing(textbounce, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.bounce,
            }),
        ])
  ).start();
}




export { transX, textOpacity, animateArrow, animateText, fadeIn, easeInButton, arrowDown, tranY, bounceText, textbounce };
