/**
 * Custom modal component is used to display usefull information that does nor require the user to navigate to another page.
 * The modal takes in the following props:
 * @props isModalOpen: boolean - determines if the modal is open or not
 * @props closeModal: () => void - a function that closes the modal
 * @props children: React.ReactNode - the content to be displayed in the modal
 * @returns a modal component
 * @example
 * ```tsx
 * <CustomModal isModalOpen ={isModalVisible} closeModal={handleModalDisplay}>
 *  <TaskDetailsComponent onModalClose={handleModalDisplay} props={taskDetials} />
 * </CustomModal>
 *
 *
 * Modal is styles to appear in the center of the screen
 */
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import { CustomModalType } from "@/app/types/management/helper";
import { AntDesign } from "@expo/vector-icons";
import {useThemeColor} from "@/hooks/useThemeColor";

const CustomModal: React.FC<CustomModalType> = ({
  isModalOpen,
  closeModal,
  children,
  title,
}: {
  isModalOpen?: boolean;
  closeModal?: () => void;
  children?: React.ReactNode;
  title?: string;
  }) => {
  
  const background = useThemeColor({}, "innerBackground");
  const highlight = useThemeColor({}, "highlight");
  
  return (
    <Modal
      visible={isModalOpen}
      style={[styles.modalContainer]}
      animationType="slide"
    >
      <View style={[styles.container, { backgroundColor: background }]}>
        <View
          style={styles.rowContainer}
        >
          <Text style = {{padding:10}}>{title}</Text>
          <Pressable onPress={closeModal} style={styles.closebutton}>
            <Text style={[{
              fontFamily: "BarlowRegular",
              fontSize: 14,
              fontWeight: "500",
              textTransform: "capitalize",
            }, {color:highlight}]}>cancel</Text>
          </Pressable>
        </View>
        <View style={styles.innerContainer}>{children}</View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 5,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 5,
  },

  closebutton: {
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 5,
  },
});
