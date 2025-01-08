import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

const image = require("@/assets/images/user image.jpg");

const OtherEmployeeOnLeaderboard = ({
  id,
  name,
  email,
  phone,
  role,
  taskCompleted,
  onPress,
}: {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  taskCompleted: number;
  onPress: () => void;
}) => {
  const background = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const otherText = useThemeColor({}, "otherText");
  const icon = useThemeColor({}, "icon");

  return (
    <View style={[styles.maincontainer, { backgroundColor: background }]}>
      <Image
        source={image}
        style={{ width: 35, height: 35, borderRadius: 40 }}
      />
      <View style={styles.constainer}>
        <View style={styles.innerContainer}>
          <Text style={[styles.highlightedTexts, { color: text }]}>{name}</Text>
          <Text style={[styles.othertexts, { color: otherText }]}>{role}</Text>
        </View>

        <View style={styles.innerContainer}>
          <Text style={[styles.highlightedTexts, { color: text }]}>
            {phone}
          </Text>
        </View>

        <View style={styles.innerContainer}>
          <Text style={[styles.highlightedTexts, { color: text }]}>
            {taskCompleted}
          </Text>
          <Text style={[styles.othertexts, { color: otherText }]}>
            task completed
          </Text>
        </View>

        <Pressable onPress={onPress}>
          <AntDesign name="profile" size={15} color={icon} />
        </Pressable>
      </View>
    </View>
  );
};

export default OtherEmployeeOnLeaderboard;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 2,
    shadowOffset: { width: 0, height: 1.5 },
    padding: 2,
  },

  constainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
    flex: 1,
    justifyContent: "space-between",
  },

  innerContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 2,
    rowGap: 2,
    alignItems: "center",
  },

  highlightedTexts: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontWeight: "400",
    fontFamily: "RobotoLight",
    textTransform: "capitalize",
  },

  othertexts: {
    fontSize: Platform.OS === "web" ? 10 : 12,
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    fontWeight: "300",
  },

  focusContainer: {
    position: "absolute",
    zIndex: 100,
    top: 0,
    right: 50,
  },
});
