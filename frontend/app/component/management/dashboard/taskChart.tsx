import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import { PieChart } from "react-native-gifted-charts";

const TaskChartComponent = ({
  width,
  title,
}: {
  width: number;
  title: string;
}) => {
  const [textWidth, setTextWidth] = useState<number>(0);
  const pieData = [
    {
      value: 30,
      color: "#009FFF",
      focused: true,
    },
    {
      value: 25,
      color: "green",
    },
    {
      value: 20,
      color: "blue",
    },
    {
      value: 25,
      color: "red",
    },
  ];

  const renderDot = (color: string) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  /**
   * Component is used to render the legend component which shows the color and the text of items attached to the pie chart
   * @returns {JSX.Element}
   */
  const renderLegendComponent = () => {
    return (
      <View style={styles.renderLegendContainer}>
        <View style={styles.renderLegendText}>
          {renderDot("#009FFF")}
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.renderLegendText}>
          {renderDot("green")}
          <Text style={styles.legendText}>ongoing</Text>
        </View>
        <View style={styles.renderLegendText}>
          {renderDot("red")}
          <Text style={styles.legendText}>pending</Text>
        </View>
        <View style={styles.renderLegendText}>
          {renderDot("blue")}
          <Text style={styles.legendText}>assigned</Text>
        </View>
      </View>
    );
  };

  const renderCenterLabel = () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 12,
            color: "red",
            fontWeight: "bold",
            fontFamily: "BarlowRegular",
            fontVariant: ["tabular-nums"],
          }}
        >
          100%
        </Text>
        <Text style={{ fontSize: 10, color: "red" }}>all task</Text>
      </View>
    );
  };

  return (
    <View style={styles.piechartContainer}>
      <View style={{ padding: 2, marginBottom: 10, alignItems: "flex-start" }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "BarlowRegular",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {title}
        </Text>
      </View>
      <PieChart
        data={pieData}
        donut
        shadow
        shadowColor="red"
        shadowWidth={5}
        focusOnPress
        showGradient={true}
        radius={width * 0.4}
        innerRadius={width * 0.2}
        innerCircleBorderColor={"gray"}
        centerLabelComponent={renderCenterLabel}
      />
      {renderLegendComponent()}
    </View>
  );
};

export default TaskChartComponent;

const styles = StyleSheet.create({
  renderLegendContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 20,
  },

  renderLegendText: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    padding: 2,
  },

  piechartContainer: {
    flex: 1,
    padding: 2,
    alignItems: "center",
  },

  legendText: {
    fontSize: Platform.OS === "web" ? 10 : 12,
    fontFamily: "BarlowLight",
    fontWeight: "400",
    textTransform: "capitalize",
  },
});
