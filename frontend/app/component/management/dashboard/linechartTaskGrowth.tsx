import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { LineChart, lineDataItem } from "react-native-gifted-charts";

const LinechartForTaskGrowthComponent = ({
  data,
}: {
  data?: lineDataItem[];
}) => {
  return (
    <View style={{ flex: 1, height: 40 }}>
      <LineChart
        data={data}
        color="blue"
        thickness={2}
        curved
        hideDataPoints
        hideRules
        hideAxesAndRules // Hides axes and any associated gridlines
        backgroundColor="transparent" // Ensures no background color
        rulesColor="transparent" // Makes sure no rules are visible
        xAxisColor="transparent" // Hides the X-axis
        yAxisColor="transparent" // Hides the Y-axis
      />
    </View>
  );
};

export default LinechartForTaskGrowthComponent;

const styles = StyleSheet.create({});
