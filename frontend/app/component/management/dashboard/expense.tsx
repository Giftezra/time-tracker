import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";

const ExpenseComponent = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [timeframe, setTimeframe] = useState({
    month: "",
    year: "",
  });

  const toggleOverlay = () => setShowOverlay(!showOverlay);

  /** Handle the pressed state of the timeframe */
  const handleTimeframe = (time: string) => {
    setTimeframe({ ...timeframe, [time]: time });
    setShowOverlay(false);
  };

  const pieData = [
    {
      value: 47,
      color: "#009FFF",
      gradientCenterColor: "#006DFF",
      focused: true,
    },
    { value: 16, color: "#BDB2FA", gradientCenterColor: "#8F80F3" },
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

  const renderLegendComponent = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 120,
            marginRight: 20,
          }}
        >
          {renderDot("#006DFF")}
          <Text style={{ color: "red" }}>cost: 47%</Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", width: 120 }}
        >
          {renderDot("#8F80F3")}
          <Text style={{ color: "red" }}>employees: 16%</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* Floating container for data selection */}
      {showOverlay && (
        <View style={styles.overlay}>
          <Pressable
            style={styles.pressable}
            onPress={() => handleTimeframe("month")}
          >
            <Text style={styles.pressableText}>month</Text>
          </Pressable>
          <Pressable
            style={styles.pressable}
            onPress={() => handleTimeframe("year")}
          >
            <Text style={styles.pressableText}>year</Text>
          </Pressable>
        </View>
      )}

      {/* main container */}
      <View style={styles.titleHeader}>
        <Text>expense</Text>
        <Pressable onPress={toggleOverlay}>
          <AntDesign name="down" size={15} color="black" />
        </Pressable>
      </View>

      <View style={{ padding: 10, alignItems: "center", width: 200 }}>
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={65}
          innerRadius={40}
          innerCircleColor={"#232B5D"}
          centerLabelComponent={() => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Text
                  style={{ fontSize: 15, color: "white", fontWeight: "bold" }}
                >
                  47%
                </Text>
                <Text style={{ fontSize: 12, color: "white" }}>
                  cost increase
                </Text>
              </View>
            );
          }}
        />
      </View>
      {renderLegendComponent()}
    </View>
  );
};

export default ExpenseComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
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

  titleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});
