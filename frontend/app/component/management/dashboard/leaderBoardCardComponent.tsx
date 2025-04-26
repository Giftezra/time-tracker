import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDashboardContext } from "@/app/context/management/dashboard/ManagementDashboardContext";
import { useNavigation } from "@react-navigation/native";
import SubtitleThemedText from "../../helper/SubtitleThemedText";
import InnerThemedText from "../../helper/InnerThemedText";
import ButtonText from "../../helper/ButtonText";
import { FontAwesome } from "@expo/vector-icons";
import { green } from "react-native-reanimated/lib/typescript/Colors";
import { useAuth } from "@/app/authentication";
const image = require("@/assets/images/user image.jpg");

const LeaderBoardCardComponent = ({
  id,
  name,
  role,
  totalTasks,
  rank,
  setIsModalVisible,
  phone,
  onProfilePress,
  onMessagePress,
}: {
  id?: string;
  name: string;
  role: string;
  totalTasks: number;
  rank: number;
  setIsModalVisible: (value: boolean) => void;
  phone: string;
  onProfilePress: (id: string) => void;
  onMessagePress: (id: string, name: string) => void;
}) => {
  // Import the useDashboardContext hook and import the methods from the context to be used in the component
  const { setEmployeeId, handlePhone } = useDashboardContext();
  const { setAlertConfig, setIsAlertVisible } = useAuth();
  const text = useThemeColor({}, "text");
  const othertext = useThemeColor({}, "otherText");

  const handleProfilePress = () => {
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Confirmation",
      message: "Open profile?",
      onConfirm: () => {
        setIsAlertVisible(false);
        if (id) {
          onProfilePress(id);
          setIsModalVisible(true);
        }
      },
      type: "error",
      isVisible: true,
      onClose() {
        setIsAlertVisible(false);
      },
    });
  };

  const handleMessagePress = () => {
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Confirmation",
      message: "Open chat?",
      onConfirm: () => {
        setIsAlertVisible(false);
        onMessagePress(id!, name!);
      },
      type: "error",
      isVisible: true,
      onClose() {
        setIsAlertVisible(false);
      },
    });
  };

  return (
    <View style={[styles.mainContainer]}>
      <Pressable onPress={() => handlePhone(phone)}>
        <FontAwesome name="phone" size={24} color={"green"} />
      </Pressable>

      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{rank}</Text>
      </View>

      <View style={styles.innerContainer}>
        <Image source={image} style={styles.avatar} />
        <View style={styles.nameContainer}>
          <SubtitleThemedText text={name} />
          <InnerThemedText text={role} />
        </View>
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
          <ButtonText text="View Profile" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMessagePress}
        >
          <ButtonText text="Send Message" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LeaderBoardCardComponent;

const styles = StyleSheet.create({
  mainContainer: {
    minWidth: 180,
    padding: 10,
    elevation: 3,
    shadowRadius: 8,
    borderRadius: 16,
    shadowOpacity: 0.2,
    marginHorizontal: 5,
    marginVertical: 12,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
  },
  rankBadge: {
    position: "absolute",
    top: -12,
    right: -12,
    backgroundColor: "#2563EB",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rankText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "BarlowMedium",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 36,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#F3F4F6",
  },
  innerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  nameContainer: {
    alignItems: "center",
    gap: 4,
  },
  statsContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  taskCount: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "BarlowMedium",
    marginBottom: 4,
  },
  taskLabel: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
});
