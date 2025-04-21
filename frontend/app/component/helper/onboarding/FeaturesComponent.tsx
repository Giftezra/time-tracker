import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

const FeaturesComponent = ({ closeFeatures }: { closeFeatures: () => void }) => {
  const features = [
    {
      icon: <MaterialIcons name="message" size={24} color="#4CAF50" />,
      title: "Real-time Messaging",
      description: "Instant communication between team members and managers",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="clock-time-four"
          size={24}
          color="#2196F3"
        />
      ),
      title: "Time Tracking",
      description: "Accurate tracking of work hours and breaks",
    },
    {
      icon: <MaterialIcons name="calendar-today" size={24} color="#FF9800" />,
      title: "Calendar Management",
      description: "Easy shift scheduling and calendar synchronization",
    },
    {
      icon: <MaterialIcons name="work-history" size={24} color="#9C27B0" />,
      title: "Shift Management",
      description: "Effortless shift assignments and swapping",
    },
    {
      icon: <FontAwesome5 name="chart-line" size={24} color="#F44336" />,
      title: "Analytics & Reports",
      description: "Detailed insights into attendance and performance",
    },
    {
      icon: <MaterialIcons name="notifications" size={24} color="#607D8B" />,
      title: "Notifications",
      description: "Instant alerts for schedule changes and updates",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => {
          console.log("Back pressed");
          closeFeatures();
        }}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Key Features</Text>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={styles.iconContainer}>{feature.icon}</View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{feature.title}</Text>
              <Text style={styles.description}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default FeaturesComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "BarlowMedium",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  featuresContainer: {
    gap: 15,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  backButton: {
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
