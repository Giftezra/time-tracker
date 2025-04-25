import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSideComponentContext } from "@/app/context/staff/sideComponentProvider";
import { MaterialIcons } from "@expo/vector-icons";

const MakeCommentModal = ({ shiftId }: { shiftId: string }) => {
  const { makeTaskComment, isCommentModalVisible, setIsCommentModalVisible } =
    useSideComponentContext();
  const [comment, setComment] = useState("");
  return (
    <Modal
      visible={isCommentModalVisible}
      transparent={true}
      onRequestClose={() => setIsCommentModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerText}>Add Comment</Text>
            <Pressable
              onPress={() => setIsCommentModalVisible(false)}
              style={styles.closeModalButton}
            >
              <MaterialIcons name="close" size={24} color="#666666" />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter your comment here..."
              placeholderTextColor="#666666"
              value={comment}
              onChangeText={(text) => setComment(text)}
              onSubmitEditing={() => {
                makeTaskComment(shiftId, comment);
                setIsCommentModalVisible(false);
              }}
              style={styles.input}
              multiline={true}
              numberOfLines={6}
            />
          </View>

          <Pressable
            style={styles.submitButton}
            onPress={() => {
              makeTaskComment(shiftId, comment);
              setIsCommentModalVisible(false);
            }}
          >
            <Text style={styles.submitButtonText}>Submit Comment</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default MakeCommentModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "BarlowSemiBold",
    color: "#333333",
  },
  closeModalButton: {
    padding: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F8F8F8",
    color: "#333333",
    textAlignVertical: "top",
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "BarlowMedium",
  },
});
