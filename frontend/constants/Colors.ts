/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { useEffect, useState } from "react";
import { Appearance } from "react-native";

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    headerText: "#0e9ee6",
    otherText: "gray",
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#21130d",
    primaryColor: "#0e9ee6",
    secondaryColor: "#570ee6",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    activebtn: "#0e9ee6",
    inactivebtn: "#687076",
    whiteBackground: "#f2f0f7",
    highlight: "#d00e57",
    innerBackground: "#063970",
    textinput: "#fdfef6",
    headertext: "#69235f",
    white: "#FDF5E6.",
  },
  dark: {
    headerText: "#0e9ee6",
    otherText: "gray",
    text: "white",
    background: "black",
    tint: tintColorDark,
    primaryColor: "#1e88e5",
    secondaryColor: "#184ec2",
    icon: "#21130d",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    activebtn: "#0e9ee6",
    inactivebtn: "#323385",
    whiteBackground: "#f2f0f7",
    highlight: "#d00e57",
    innerBackground: "#063970",
    textinput: "#fdfef6",
    headertext: "#69235f",
    white: "#FDF5E6",
  },
};

