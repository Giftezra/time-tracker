import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import { useDashboardContext } from "@/app/context/management/dashboard/ManagementDashboardContext";
import SubtitleThemedText from "../../helper/SubtitleThemedText";
import InnerThemedText from "../../helper/InnerThemedText";
import ThemedHeaderText from "../../helper/ThemedHeaderText";
import { TaskStatistics } from "@/app/types/management/dashboard";
const TaskChartComponent = ({
  width,
  title,
  pieData,
  taskStats,
}: {
  width: number;
  title?: string;
  pieData: any[];
  taskStats?: TaskStatistics;
}) => {
  const renderDot = (color: string) => {
    return <View style={[styles.dot, { backgroundColor: color }]} />;
  };

  /**
   * Component is used to render the legend component which shows the color and the text of items attached to the pie chart
   * @returns {JSX.Element}
   */
  const renderLegendComponent = () => {
    if (taskStats) {
      return (
        <View style={styles.renderLegendContainer}>
          <View style={styles.legendRow}>
            <View style={styles.renderLegendText}>
              {renderDot("#4CAF50")}
              <SubtitleThemedText text="Completed" />
            </View>
            <View style={styles.renderLegendText}>
              {renderDot("#2196F3")}
              <SubtitleThemedText text="Ongoing" />
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.renderLegendText}>
              {renderDot("#FFC107")}
              <SubtitleThemedText text="Assigned" />
            </View>
            <View style={styles.renderLegendText}>
              {renderDot("#FF5722")}
              <SubtitleThemedText text="Pending" />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.renderLegendContainer}>
          <View style={styles.legendRow}>
            <SubtitleThemedText text="No data available" />
          </View>
        </View>
      );
    }
  };

  const renderCenterLabel = () => {
    return (
      <View style={styles.centerLabel}>
        <InnerThemedText text={taskStats?.total.toString() || "0"} />
        <InnerThemedText text="Total Tasks" />
      </View>
    );
  };

  return (
    <View style={styles.piechartContainer}>
      <ThemedHeaderText text={title || "Chart"} />
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
    padding: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
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
