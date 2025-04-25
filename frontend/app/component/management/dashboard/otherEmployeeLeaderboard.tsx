import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDashboardContext } from "@/app/context/management/dashboard/ManagementDashboardContext";
import { useAuth } from "@/app/authentication";
const image = require("@/assets/images/user image.jpg");

const OtherEmployeeOnLeaderboard = ({
  id,
  name,
  email,
  phone,
  role,
  taskCompleted,
  setIsModalVisible,
  onProfilePress,
}: {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  taskCompleted: number;
  setIsModalVisible: (value: boolean) => void;
  onProfilePress: (id: string) => void;
}) => {
  const { handlePhone } = useDashboardContext();
  const { setAlertConfig, setIsAlertVisible } = useAuth();
  const text = useThemeColor({}, "text");
  const otherText = useThemeColor({}, "otherText");

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

  return (
    <View style={[styles.maincontainer]}>
      <Text style={styles.role}>{role}</Text>
      <View style={styles.innerContainer}>
        <Image source={image} style={styles.avatar} />
        <View style={styles.container}>
          <View style={styles.detailsContainer}>
            <Text style={[styles.nameText, { color: text }]}>{name}</Text>
            <Text style={[styles.emailText, { color: otherText }]}>
              {email}
            </Text>
          </View>
        </View>
        <View style={[styles.container, { flex: 1 }]}>
          <View style={styles.taskcontainer}>
            <Text
              style={[
                styles.nameText,
                {
                  color: text,
                  borderWidth: 0.3,
                  padding: 5,
                  borderRadius: 10,
                },
              ]}
            >
              {taskCompleted}
            </Text>
            <Pressable>
              <MaterialIcons name="message" size={20} color={"red"} />
            </Pressable>
            <Pressable onPress={handleProfilePress}>
              <MaterialIcons name="person" size={20} color={"red"} />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.phoneOverlay}>
        <Pressable
          onPress={() => handlePhone(phone)}
          style={styles.phoneButton}
        >
          <MaterialIcons name="phone" size={15} color={"green"} />
        </Pressable>
        <Text style={styles.phoneText}>{phone}</Text>
      </View>
    </View>
  );
};

export default OtherEmployeeOnLeaderboard;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 2,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: "white",
    gap: 5,
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },

  container: {
    alignItems: "center",
  },
  detailsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "gray",
    borderWidth: 1,
    padding: 5,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "capitalize",
    fontFamily: "BarlowMedium",
  },
  emailText: {
    fontSize: 12,
    color: "gray",
  },
  role: {
    position: "absolute",
    top: -2,
    left: 5,
    fontSize: 10,
    color: "green",
    fontFamily: "BarlowMedium",
    fontWeight: "600",
  },
  taskText: {
    fontSize: 12,
    color: "gray",
    fontFamily: "BarlowMedium",
    fontWeight: "600",
  },

  taskcontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },

  phoneOverlay: {
    position: "absolute",
    top: 0,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  phoneButton: {
    padding: 3,
  },
  phoneText: {
    fontSize: 12,
    color: "gray",
    fontFamily: "BarlowMedium",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
