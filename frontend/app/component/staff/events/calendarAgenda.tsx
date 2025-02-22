import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Agenda } from "react-native-calendars";

import {
  EventDisplayInterface,
  EventDetailsInterface,
} from "@/app/types/staff/eventType";
import EventDisplay from "./eventDisplay";
import { useEventContext } from "@/app/context/staff/staffEventProvider";

type AgendaItem = {
  [key: string]: EventDisplayInterface[];
};

// Sample data that follows the ShiftDisplayProps structure
const items: AgendaItem = {
  "2025-01-01": [
    {
      id: "1",
      site_name: "Main Office",
      site_address: "123 Main St",
      site_postcode: "AB12 3CD",
      start_time: "09:00",
      end_time: "17:00",
      information: "Regular day shift",
    },
    {
      id: "2",
      site_name: "Downtown Site",
      site_address: "456 Elm St",
      site_postcode: "EF45 6GH",
      start_time: "10:00",
      end_time: "18:00",
      information: "Overlapping shift with the main office",
    },
  ],
  "2025-01-06": [
    {
      id: "3",
      site_name: "Warehouse",
      site_address: "789 Maple Ave",
      site_postcode: "IJ67 8KL",
      start_time: "08:00",
      end_time: "16:00",
      information: "Early morning shift",
    },
  ],
  "2025-01-03": [], // No shifts for this day
  "2025-01-08": [
    {
      id: "4",
      site_name: "Remote Site",
      site_address: "101 Pine Rd",
      site_postcode: "MN90 1OP",
      start_time: "12:00",
      end_time: "20:00",
      information: "Afternoon to evening shift",
    },
  ],
};

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
  onPress: (id: string) => void
) => {
  if (!item) return null;
  return (
    <TouchableOpacity
      style={styles.renderItemButton}
      onPress={() => onPress(item.id)}
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

const CalendarAgendaComponent = ({
  onPress,
}: {
  onPress: (id: string) => void;
}) => {
  const { assignedShifts } = useEventContext();
  const [items, setItems] = useState<AgendaItem>({});

  /**  The hooks is used to format the date for the agendaItems.
   * The date is formatted as yyyy-mm-dd
   * The hook ensures that it only triggered when the assigned task has valid data.
   */
  useEffect(() => {
    const formattedItems: AgendaItem = {};

    // Loop the assigned shifts and format the date
    assignedShifts.forEach((shift) => {
      const dateKey = shift.start_date?.split("T")[0];
      if (dateKey) {
        if (formattedItems[dateKey]) {
          formattedItems[dateKey].push(shift);
        } else {
          formattedItems[dateKey] = [];
        }
      }
    });
    setItems(formattedItems);
  }, [assignedShifts]);

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        renderItem={(item: EventDisplayInterface) => renderItem(item, onPress)}
        renderEmptyDate={() => (
          <View style={styles.renderEmptyDateContainer}>
            <Text style={styles.renderEmptyDateText}>
              you do not have any active shifts for this day
            </Text>
          </View>
        )}
        hideKnob={false}
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
    textTransform: "capitalize",
  },
});
