import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { useStaffDashboard } from "@/app/context/staff/dashboardProvider";

const StaffDashboardChart = ({ width }: { width: number }) => {
  const { chartData, chartYear } = useStaffDashboard();
  const [selectedBar, setSelectedBar] = useState<{
    value: number;
    index: number;
  } | null>(null);

  const handlePress = (item: any, index: number) => {
    setSelectedBar({ value: item.value, index: index });
    setTimeout(() => {
      setSelectedBar(null);
    }, 2000);
  };

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Monthly Shift Growth ({chartYear})</Text>
      <View style={[styles.chartContainer, { width: width }]}>
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
          data={chartData}
          width={width}
          barWidth={width / 16} // Adjust this divisor as needed
          spacing={width / 25} // Adjust this divisor as needed
          initialSpacing={width / 30}
          endSpacing={25}
          height={200}
          hideRules
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={styles.yAxisLabelTextStyle}
          xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
          noOfSections={5}
          maxValue={chartData.reduce(
            (max, item) => Math.max(max, item.value),
            1
          )}
          showFractionalValues={false}
          barBorderTopLeftRadius={5}
          barBorderTopRightRadius={5}
          onPress={(item: any, index: number) => handlePress(item, index)}
        />
      </View>
    </View>
  );
};

export default StaffDashboardChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  chartContainer: {
    flex: 1,
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
    top: 20,
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
