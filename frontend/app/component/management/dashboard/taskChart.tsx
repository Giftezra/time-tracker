import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import { useDashboardContext } from "@/app/context/management/dashboard/dashboardContext";

const TaskChartComponent = ({
  width,
  title,
}: {
  width: number;
  title: string;
}) => {
  const { taskStats } = useDashboardContext();
  const total = taskStats.total || 1; // Prevent division by zero

  const pieData = [
    {
      value: (taskStats.completed / total) * 100,
      color: "#4CAF50",
      gradientCenterColor: "#81C784",
      focused: true,
    },
    {
      value: (taskStats.ongoing / total) * 100,
      color: "#2196F3",
      gradientCenterColor: "#64B5F6",
    },
    {
      value: (taskStats.assigned / total) * 100,
      color: "#FFC107",
      gradientCenterColor: "#FFD54F",
    },
    {
      value: (taskStats.pending / total) * 100,
      color: "#FF5722",
      gradientCenterColor: "#FF8A65",
    },
  ];

  const renderDot = (color: string) => {
    return <View style={[styles.dot, { backgroundColor: color }]} />;
  };

  /**
   * Component is used to render the legend component which shows the color and the text of items attached to the pie chart
   * @returns {JSX.Element}
   */
  const renderLegendComponent = () => {
    return (
      <View style={styles.renderLegendContainer}>
        <View style={styles.legendRow}>
          <View style={styles.renderLegendText}>
            {renderDot("#4CAF50")}
            <Text style={styles.legendText}>
              Completed ({taskStats.completed})
            </Text>
          </View>
          <View style={styles.renderLegendText}>
            {renderDot("#2196F3")}
            <Text style={styles.legendText}>Ongoing ({taskStats.ongoing})</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.renderLegendText}>
            {renderDot("#FFC107")}
            <Text style={styles.legendText}>
              Assigned ({taskStats.assigned})
            </Text>
          </View>
          <View style={styles.renderLegendText}>
            {renderDot("#FF5722")}
            <Text style={styles.legendText}>Pending ({taskStats.pending})</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCenterLabel = () => {
    return (
      <View style={styles.centerLabel}>
        <Text style={styles.totalNumber}>{taskStats.total}</Text>
        <Text style={styles.totalText}>Total Tasks</Text>
      </View>
    );
  };

  return (
    <View style={styles.piechartContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <PieChart
        data={pieData}
        donut
        showGradient
        sectionAutoFocus
        radius={width * 0.35}
        innerRadius={width * 0.2}
        innerCircleColor={"#fff"}
        centerLabelComponent={renderCenterLabel}
      />
      {renderLegendComponent()}
    </View>
  );
};

export default TaskChartComponent;

const styles = StyleSheet.create({
  piechartContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleText: {
    fontSize: 18,
    fontFamily: "BarlowMedium",
    marginBottom: 16,
    color: "#1A1A1A",
  },
  renderLegendContainer: {
    marginTop: 24,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  renderLegendText: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontFamily: "BarlowRegular",
    color: "#666",
  },
  centerLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
  totalNumber: {
    fontSize: 24,
    fontFamily: "BarlowMedium",
    color: "#1A1A1A",
  },
  totalText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "BarlowRegular",
  },
});
