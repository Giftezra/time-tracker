import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { BarChart } from "react-native-gifted-charts";

const StaffDashboardChart = ({ width }: { width: number }) => {
  const [selectedBar, setSelectedBar] = useState<{
    value: number;
    index: number;
  } | null>(null);

  // Sample data for monthly shift growth
  const barData = [
    { value: 15, label: "Jan", frontColor: "#177AD5" },
    { value: 18, label: "Feb", frontColor: "#177AD5" },
    { value: 25, label: "Mar", frontColor: "#177AD5" },
    { value: 22, label: "Apr", frontColor: "#177AD5" },
    { value: 30, label: "May", frontColor: "#ED6665" },
    { value: 28, label: "Jun", frontColor: "#177AD5" },
    { value: 35, label: "Jul", frontColor: "#177AD5" },
    { value: 40, label: "Aug", frontColor: "#177AD5" },
    { value: 45, label: "Sep", frontColor: "#177AD5" },
    { value: 50, label: "Oct", frontColor: "#177AD5" },
    { value: 55, label: "Nov", frontColor: "#177AD5" },
    { value: 60, label: "Dec", frontColor: "#177AD5" },
  ];

  const handlePress = (item: any, index: number) => {
    setSelectedBar({ value: item.value, index: index });
    // Auto-hide the value after 2 seconds
    setTimeout(() => {
      setSelectedBar(null);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Shift Growth</Text>
      <View style={styles.chartContainer}>
        {selectedBar && (
          <View
            style={[
              styles.valueOverlay,
              {
                left: `${selectedBar.index * (100 / 12) + 5}%`,
              },
            ]}
          >
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{selectedBar.value}</Text>
            </View>
          </View>
        )}
        <BarChart
          data={barData}
          barWidth={Math.max(7, width * 0.04)}
          spacing={Math.max(5, width * 0.02)}
          labelWidth={Math.max(20, width * 0.02)}
          initialSpacing={width * 0.02}
          height={200}
          hideRules
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={styles.yAxisLabelTextStyle}
          xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
          noOfSections={5}
          maxValue={100}
          showFractionalValues={false}
          barBorderTopLeftRadius={5}
          barBorderTopRightRadius={5}
          disablePress={false}
          onPress={(item: any, index: number) => {
            handlePress(item, index);
          }}
        />
      </View>
    </View>
  );
};

export default StaffDashboardChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
  
  },
  chartContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  xAxisLabelTextStyle: {
    fontSize: 11,
    columnGap: 5,
    color: "black",
    transform: [{ rotate: "-30deg" }],
    fontWeight: "500",
    fontFamily: "BarlowLight",
  },

  yAxisLabelTextStyle: {
    fontSize: 11,
    color: "red",
    fontWeight: "500",
    fontFamily: "BarlowMedium",

  },



  valueOverlay: {
    position: "absolute",
    top: 40,
    zIndex: 1,
  },
  valueBox: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
