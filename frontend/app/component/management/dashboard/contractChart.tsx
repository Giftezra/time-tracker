import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { BarChart } from "react-native-gifted-charts";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { transform } from "@babel/core";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/app/context/authentication";
import { useDashboardContext } from "@/app/context/management/dashboard/dashboardContext";

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
  const { windowWidth, screenWidth } = useAuth();
  const highlight = useThemeColor({}, "highlight");
  const { contractStats, fetchContractStatistics, isLoading } =
    useDashboardContext();

  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleOverlay = () => setShowOverlay(!showOverlay);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setShowOverlay(false);
  };

  // Calculate bar width based on screen size
  const calcBarWidth = () => {
    return windowWidth < screenWidth * 0.5
      ? Math.max(5, width * 0.01, 10)
      : Math.max(5, width * 0.01, 5);
  };
  const barWidth = calcBarWidth();

  return (
    <View style={styles.maincontainer}>
      {showOverlay && (
        <View style={styles.overlay}>
          <Pressable
            style={styles.pressable}
            onPress={() => handleYearChange(selectedYear - 1)}
          >
            <Text style={styles.pressableText}>{selectedYear - 1}</Text>
          </Pressable>
          <Pressable
            style={styles.pressable}
            onPress={() => handleYearChange(selectedYear)}
          >
            <Text style={styles.pressableText}>{selectedYear}</Text>
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
          data={contractStats}
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

  xAxisLabelTextStyle: {
    fontSize: Platform.OS === "web" ? 8 : 10,
    columnGap: 5,
    color: "black",
    transform: [{ rotate: "-30deg" }], // Rotate for better spacing
    fontWeight: "500",
    fontFamily: "BarlowLight",
  },
});
