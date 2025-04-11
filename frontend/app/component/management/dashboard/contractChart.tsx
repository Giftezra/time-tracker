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
import { useAuth } from "@/app/authentication";
import { useDashboardContext } from "@/app/context/management/dashboard/dashboardContext";
import { BarDat, BarData } from "@/app/types/management/dashboard";
import ThemedHeaderText from "../../helper/ThemedHeaderText";
import InnerThemedText from "../../helper/InnerThemedText";
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
        <InnerThemedText text="Contracts" />
      </View>
    </View>
  );
};

const ContractChartComponent = ({ width }: { width: number }) => {
  const { windowWidth, screenWidth } = useAuth();
  const highlight = useThemeColor({}, "highlight");
  const {
    contractStats,
    setSelectedYear,
    selectedYear,
  } = useDashboardContext();
  const [showOverlay, setShowOverlay] = useState(false);

  const currentYear = new Date().getFullYear();
  const minYear = 2020; // You can adjust this to your needs
  const maxYear = currentYear + 1; // Allow selection up to next year

  const yearsToDisplay = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleOverlay = () => setShowOverlay(!showOverlay);

  const handleYearChange = (year: number) => {
    if (year >= minYear && year <= maxYear) {
      setSelectedYear(year);
      setShowOverlay(false);
    }
  };

  // Calculate bar width based on screen size
  const calcBarWidth = () => {
    return windowWidth < screenWidth * 0.5
      ? Math.max(5, width * 0.01, 10)
      : Math.max(5, width * 0.01, 5);
  };
  const barWidth = calcBarWidth();

  // Transform the data for the BarChart component
  const transformedData: any = [];
  contractStats.forEach((stat) => {
    // Add client bar
    transformedData.push({
      value: stat.stacks?.[0].value || 0,
      label: stat.label,
      frontColor: "#177AD5",
      spacing: 2,
    });

    // Add contract bar next to it
    transformedData.push({
      value: stat.stacks?.[1].value || 0,
      label: "", // Empty label for the second bar
      frontColor: "#ED6665",
      spacing: 12, // Larger spacing after contract bar to separate month groups
    });
  });

  return (
    <View style={styles.maincontainer}>
      {showOverlay && (
        <View style={styles.overlay}>
          {yearsToDisplay.map((year, index) => (
            <Pressable
              key={index}
              style={[
                styles.pressable,
                selectedYear === year && styles.selectedPressable,
              ]}
              onPress={() => handleYearChange(year)}
            >
              <Text style={styles.pressableText}>{year.toString()}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.title}>
        <ThemedHeaderText text="Contracts" />
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
          data={transformedData}
          barWidth={Math.max(7, width * 0.02)}
          spacing={Math.max(5, width * 0.02)}
          labelWidth={Math.max(20, width * 0.02)}
          initialSpacing={width * 0.02}
          barBorderTopLeftRadius={5}
          barBorderTopRightRadius={5}
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
          noOfSections={5}
          maxValue={100} // You might want to calculate this based on your data
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

  disabledPressable: {
    opacity: 0.5,
  },

  disabledText: {
    color: "#999",
  },

  selectedPressable: {
    backgroundColor: "#f0f0f0",
  },

  selectedText: {
    color: "#177AD5",
    fontWeight: "600",
  },
});
