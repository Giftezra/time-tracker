import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Agenda } from "react-native-calendars";

import {
  EventDisplayInterface,
  EventDetailsInterface,
  AgendaItem,
} from "@/app/types/staff/event";
import EventDisplay from "./eventDisplay";
import { useEventContext } from "@/app/context/staff/staffEventProvider";

/**
 * This function render the EventDisplay when the component mounts.
 * Each its is mapped to a date and wrapped in a TouchableOpacity to allow for onPress events.
 *
 * When press the onPress function is called with the id of the item passed as an argument for further processing.
 * @param item The item to be rendered
 * @param onPress Function to be called when the item is pressed
 * @returns
 */
const renderItem = (
  item: EventDisplayInterface,
  onPress: (id: string) => Promise<void>
) => {
  if (!item) return null;
  return (
    <TouchableOpacity
      style={styles.renderItemButton}
      onPress={async () => {
        await onPress(item.id);
      }}
    >
      <EventDisplay props={item} />
    </TouchableOpacity>
  );
};

/**
 * The CalendarAgendaComponent displays the shifts assigned to the user in an Agenda component.
 * The Agenda component is a calendar that displays the shifts assigned to the user.
 * The component uses the renderItem function to render the shifts for each day.
 * @param onPress The function to be called when an item is pressed.
 * @returns The CalendarAgendaComponent
 */

const CalendarAgendaComponent = () => {
  const {
    assignedShifts = [],
    retrieveShiftDetails,
    setIsModalOpen,
  } = useEventContext();
  const [items, setItems] = useState<AgendaItem>({});
  const [loading, setLoading] = useState(true);

  /**  The hooks is used to format the date for the agendaItems.
   * The date is formatted as yyyy-mm-dd
   * The hook ensures that it only triggered when the assigned task has valid data.
   */
  useEffect(() => {
    const formattedItems: AgendaItem = {};
    // Add null check before forEach
    try {
      setLoading(true);
      if (assignedShifts && assignedShifts.length > 0) {
        assignedShifts.forEach((shift: EventDisplayInterface) => {
          const dateKey = shift.start_date;
          if (dateKey) {
            if (!formattedItems[dateKey]) {
              formattedItems[dateKey] = [];
            }
            formattedItems[dateKey].push(shift);
          }
        });
      }
      setItems(formattedItems);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  }, [assignedShifts]);

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={styles.renderEmptyDateText}>
          No shifts scheduled for this day
        </Text>
      </View>
    );
  };

  // Return a loading indicator if the data is still loading
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        renderItem={(item: EventDisplayInterface) =>
          renderItem(item, async (id) => {
            await retrieveShiftDetails(id);
            setIsModalOpen(true);
          })
        }
        renderEmptyData={renderEmptyDate}
        hideKnob={false}
        showOnlySelectedDayItems={false}
        pastScrollRange={12}
        futureScrollRange={12}
      />
    </View>
  );
};

export default CalendarAgendaComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: "#888",
    fontSize: 16,
  },

  renderItemButton: {
    flexGrow: 1,
    marginVertical: 5,
  },

  renderEmptyDateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },

  renderEmptyDateText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },

  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
});
