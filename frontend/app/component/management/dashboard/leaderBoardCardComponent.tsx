import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDashboardContext } from "@/app/context/management/dashboard/ManagementDashboardContext";
import { useNavigation } from "@react-navigation/native";
import SubtitleThemedText from "../../helper/SubtitleThemedText";
import InnerThemedText from "../../helper/InnerThemedText";
import ButtonText from "../../helper/ButtonText";
const image = require("@/assets/images/user image.jpg");

const LeaderBoardCardComponent = ({
  id,
  name,
  role,
  totalTasks,
  rank,
  setIsModalVisible,
}: {
  id?: string;
  name: string;
  role: string;
  totalTasks: number;
  rank: number;
  setIsModalVisible: (value: boolean) => void;
}) => {
  // Import the useDashboardContext hook and import the methods from the context to be used in the component
  const { setEmployeeId } = useDashboardContext();

  const text = useThemeColor({}, "text");
  const othertext = useThemeColor({}, "otherText");
  const innerBackground = useThemeColor({}, "innerBackground");

  const handleProfilePress = () => {
    if (id) {
      setEmployeeId(id);
      setIsModalVisible(true);
    }
  };

  return (
    <View style={[styles.maincontainer, { backgroundColor: innerBackground }]}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{rank}</Text>
      </View>

      <View style={styles.innercontainera}>
        <Image source={image} style={styles.avatar} />
        <SubtitleThemedText text={name} />
        <InnerThemedText text={role} />
      </View>

      <View style={styles.statsContainer}>
        <Text style={[styles.taskCount, { color: text }]}>{totalTasks}</Text>
        <Text style={[styles.taskLabel, { color: othertext }]}>
          Tasks Completed
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleProfilePress}
        >
          <ButtonText text="Profile" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setEmployeeId(id!)}
        >
          <ButtonText text="Message" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LeaderBoardCardComponent;

const styles = StyleSheet.create({
  maincontainer: {
    width: 150,
    padding: 10,
    elevation: 5,
    shadowRadius: 5,
    borderRadius: 12,
    shadowOpacity: 0.5,
    marginHorizontal: 8,
    marginVertical: 8,
    position: "relative",
  },
  rankBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#177AD5",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  rankText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "BarlowMedium",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  innercontainera: {
    alignItems: "center",
    marginBottom: 16,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowMedium",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
  },
  statsContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  taskCount: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "BarlowMedium",
    marginBottom: 4,
  },
  taskLabel: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: "BarlowMedium",
    textTransform: "capitalize",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
});
