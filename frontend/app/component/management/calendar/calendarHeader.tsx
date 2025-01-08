import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchInputContainer from "../../helper/searchInput";
import { useCalendar } from "@/app/context/management/calendar/calendarContext";

const CalendarHeader = ({ onPress }: { onPress: () => void }) => {
  const {
    schedule,
    timeFrame,
    search,
    setSearch,
    handleSchedule,
    handleWeekSeleced,
    gotoPreviousWeek,
    gotoNextWeek,
    currentWeek,
    weekRange,
  } = useCalendar();
  return (
    <View
      style={[
        styles.mainContainer,
        { padding: 5, justifyContent: "space-between" },
      ]}
    >
      <View>
        <SearchInputContainer
          onPress={() => console.log("search")}
          value={search}
          setValue={setSearch}
          placeholder="Search"
        />
      </View>

      <View style={[styles.rowContainer, { columnGap: 20, marginBottom: 20 }]}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "500",
            fontFamily: "BarlowRegular",
            textTransform: "capitalize",
          }}
        >
          shifts
        </Text>
        <Pressable
          onPress={() => handleSchedule("shifts")}
          style={
            schedule === "shifts"
              ? { borderBottomWidth: 2, borderBottomColor: "black" }
              : {}
          }
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              fontFamily: "BarlowRegular",
              textTransform: "capitalize",
            }}
          >
            shifts
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleSchedule("my tasks")}
          style={
            schedule === "my tasks"
              ? { borderBottomWidth: 2, borderBottomColor: "black" }
              : {}
          }
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              fontFamily: "BarlowRegular",
              textTransform: "capitalize",
            }}
          >
            my tasks
          </Text>
        </Pressable>
      </View>

      {/* This part contains the date management role */}
      <View
        style={[
          styles.rowContainer,
          { justifyContent: "space-between", width: "100%" },
        ]}
      >
        <View
          style={[
            styles.rowContainer,
            { justifyContent: "center", columnGap: 5 },
          ]}
        >
          <Pressable style={{ padding: 10 }}>
            <AntDesign
              name="left"
              size={12}
              color="black"
              onPress={gotoPreviousWeek}
            />
          </Pressable>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              fontFamily: "BarlowLight",
              textTransform: "capitalize",
            }}
          >
            {weekRange}
          </Text>
          <Pressable style={{ padding: 10 }}>
            <AntDesign
              name="right"
              size={12}
              color="black"
              onPress={gotoNextWeek}
            />
          </Pressable>
        </View>

        <View style={[styles.rowContainer, { columnGap: 20 }]}>
          <Pressable
            onPress={() => handleWeekSeleced("week")}
            style={
              timeFrame === "week"
                ? { borderBottomWidth: 2, borderBottomColor: "black" }
                : {}
            }
          >
            <Text
              style={{
                fontFamily: "BarlowRegular",
                fontSize: 13,
                fontWeight: "500",
              }}
            >
              Week
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleWeekSeleced("month")}
            style={
              timeFrame === "month"
                ? { borderBottomWidth: 2, borderBottomColor: "black" }
                : {}
            }
          >
            <Text
              style={{
                fontFamily: "BarlowRegular",
                fontSize: 13,
                fontWeight: "500",
              }}
            >
              Month
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.rowContainer,
            { columnGap: 20, justifyContent: "flex-end", marginEnd: 5 },
          ]}
        >
          <Pressable>
            <MaterialCommunityIcons
              name="file-account-outline"
              size={24}
              color="black"
            />
          </Pressable>
          <Pressable>
            <MaterialCommunityIcons
              name="printer"
              size={24}
              color="black"
              onPress={onPress}
            />
          </Pressable>
          <Pressable>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="black"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  rowContainer: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
