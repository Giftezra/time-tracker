import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { BarChart } from "react-native-gifted-charts";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { transform } from "@babel/core";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/app/context/management/authentication";

const renderTitle = () => {
  return (
    <View style={styles.renderMaincontainer}>
      <View style={styles.renderContainer}>
        <View
          style={{
            height: 10,
            width: 10,
            borderRadius: 6,
            backgroundColor: "#177AD5",
            marginRight: 8,
          }}
        />
        <Text
          style={{
            color: "black",
            fontSize: 12,
            fontFamily: "BarlowLight",
            fontWeight: "400",
          }}
        >
          Clients
        </Text>
      </View>
      <View style={styles.renderContainer}>
        <View
          style={{
            height: 10,
            width: 10,
            borderRadius: 6,
            backgroundColor: "#ED6665",
            marginRight: 8,
          }}
        />
        <Text
          style={{
            color: "black",
            fontSize: 12,
            fontFamily: "BarlowLight",
            fontWeight: "400",
          }}
        >
          Contracts
        </Text>
      </View>
    </View>
  );
};

const ContractChartComponent = ({ width }: { width: number }) => {
  // Get the window width from the auth context
  const { windowWidth, screenWidth } = useAuth();
  const highlight = useThemeColor({}, "highlight");

  const [showOverlay, setShowOverlay] = useState(false);

  const handleOverlay = () => setShowOverlay(!showOverlay);

  const barData = [
    {
      value: 40,
      label: "Jan",
      spacing: 2,
      labelWidth: 20,
      frontColor: "#177AD5",
    },
    { value: 20, frontColor: "#ED6665" },
    {
      value: 50,
      label: "Feb",
      spacing: 2,
      labelWidth: 20,
      frontColor: "#177AD5",
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 75,
      label: "Mar",
      spacing: 2,
      labelWidth: 30,
      frontColor: "#177AD5",
    },
    { value: 25, frontColor: "#ED6665" },
    {
      value: 30,
      label: "Apr",
      spacing: 2,
      labelWidth: 30,
      frontColor: "#177AD5",
    },
    { value: 20, frontColor: "#ED6665" },
    {
      value: 60,
      label: "May",
      spacing: 2,
      labelWidth: 20,
      frontColor: "#177AD5",
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 65,
      label: "Jun",
      spacing: 2,
      labelWidth: 20,
      frontColor: "#177AD5",
    },
    { value: 30, frontColor: "#ED6665" },
    {
      value: 40,
      label: "Jul",
      spacing: 2,
      labelWidth: 20,
      frontColor: "#177AD5",
    },
    { value: 20, frontColor: "#ED6665" },
    {
      value: 50,
      label: "Aug",
      spacing: 2,
      labelWidth: 20,
      frontColor: "#177AD5",
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 75,
      label: "Sept",
      spacing: 2,
      labelWidth: 30,
      frontColor: "#177AD5",
    },
    { value: 25, frontColor: "#ED6665" },
    {
      value: 30,
      label: "Oct",
      spacing: 2,
      labelWidth: 30,
      frontColor: "#177AD5",
    },
    { value: 20, frontColor: "#ED6665" },
    {
      value: 60,
      label: "Nov",
      spacing: 2,
      labelWidth: 20,
      frontColor: "#177AD5",
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 65,
      label: "Dec",
      spacing: 2,
      labelWidth: 20,
      frontColor: "#177AD5",
    },
    { value: 30, frontColor: "#ED6665" },
  ];

  const calcBarWidth = () => {
    return windowWidth < screenWidth * 0.5
      ? Math.max(5, width * 0.01, 10)
      : Math.max(5, width * 0.01, 5);
  };
  const barWidth = calcBarWidth();

  return (
    <View style={styles.maincontainer}>
      {/* Floating container for data selection */}
      {showOverlay && (
        <View style={styles.overlay}>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>month</Text>
          </Pressable>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>year</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.title}>
        <Text
          style={{
            color: "black",
            fontSize: 16,
            fontFamily: "BarlowLight",
            fontWeight: "500",
          }}
        >
          Contracts
        </Text>
        <Pressable onPress={handleOverlay}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={20}
            color="black"
          />
        </Pressable>
      </View>
      {renderTitle()}

      <View style={styles.chartContainer}>
        <BarChart
          data={barData}
          barWidth={Math.max(7, width * 0.02)}
          spacing={Math.max(5, width * 0.02)}
          labelWidth={Math.max(20, width * 0.02)}
          initialSpacing={width * 0.02}
          barBorderRadius={5}
          disablePress={true}
          animationDuration={3000}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{
            fontSize: 10,
            color: "red",
          }}
          xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
          hideRules={true}
          backgroundColor="transparent"
        />
      </View>
    </View>
  );
};

export default ContractChartComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 10,
  },

  chartContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  renderMaincontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },

  renderContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },

  overlay: {
    width: "70%",
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    zIndex: 100,
    borderRadius: 5,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  pressable: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },

  pressableText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    fontWeight: "400",
    textTransform: "capitalize",
  },

  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  xAxisLabelTextStyle : {
    fontSize: Platform.OS === "web" ? 8 : 10,
    columnGap: 5,
    color: "black",
    transform: [{ rotate: "-30deg" }], // Rotate for better spacing
    fontWeight: "500",
    fontFamily: "BarlowLight",
  },
});
