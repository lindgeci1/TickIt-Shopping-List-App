import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { filterLists } from "./filterLists";
import { filterListsByDate } from "./filterListsByDate";
import { filterListsByCustomDate } from "./filterListsByCustomDate";

export default function ShoppingListFilterPanel({
  allLists,
  setFilteredLists,
  search,
  setSearch,
  activeQuickDate,
  setActiveQuickDate,
  customDate,
  setCustomDate,
}) {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showQuickDateModal, setShowQuickDateModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

  const toggleFilterExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterExpanded(!filterExpanded);
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    filterLists(allLists, setFilteredLists, text, activeQuickDate);
  };

  const quickDateOptions = ["Today", "Yesterday", "Last 7 Days", "This Month"];

const handleQuickDateSelect = (date) => {
  setActiveQuickDate(date);
  filterListsByDate(allLists, setFilteredLists, search, date);
  setShowQuickDateModal(false);
};
  const clearQuickDate = () => {
    setActiveQuickDate(null);
    filterListsByDate(allLists, setFilteredLists, search, null);
  };

const handleCustomDateSelect = (date) => {
  setCustomDate(date);
  setActiveQuickDate(null); // clear quick date selection
  filterListsByCustomDate(allLists, setFilteredLists, date); // pass only the date
};

const clearCustomDate = () => {
  setCustomDate(null);
  if (activeQuickDate) {
    filterLists(allLists, setFilteredLists, search, activeQuickDate);
  } else {
    setFilteredLists(allLists); // show all lists if no date selected
  }
};


  return (
    <View
      style={{
        marginBottom: 10,
        padding: 12,
        backgroundColor: "#f5f5ff",
        borderRadius: 12,
      }}
    >
      {/* Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1.5,
          borderColor: "#d1d1f0",
          borderRadius: 12,
          backgroundColor: "#fff",
          paddingHorizontal: 10,
          marginBottom: 12,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="#6c63ff"
          style={{ marginRight: 6 }}
        />
        <TextInput
          style={{ flex: 1, height: 40, fontSize: 15 }}
          placeholder="Search for a list..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Filters button */}
      <TouchableOpacity
        onPress={toggleFilterExpand}
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#6c63ff",
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Ionicons
          name="options-outline"
          size={18}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
          Filters
        </Text>
      </TouchableOpacity>

      {/* Filter Dropdowns */}
      {filterExpanded && (
        <View style={{ marginTop: 12, flexDirection: "row", gap: 10 }}>
          {/* Quick Date Dropdown */}
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setShowQuickDateModal(true)}
              disabled={!!customDate}
              style={{
                flex: 1,
                borderWidth: 1.5,
                borderColor: "#d1d1f0",
                borderRadius: 12,
                   backgroundColor: !!customDate ? "#cccccc" : "#fff", // stronger gray
                padding: 10,
              }}
            >
              <Text style={{ color: "#6c63ff", fontWeight: "600" }}>
                {activeQuickDate || "Quick Date"}
              </Text>
            </TouchableOpacity>
            {activeQuickDate && (
              <TouchableOpacity onPress={clearQuickDate} style={{ marginLeft: 6 }}>
                <Ionicons name="close-circle" size={22} color="red" />
              </TouchableOpacity>
            )}
          </View>

          {/* Custom Date Dropdown */}
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setShowCustomDateModal(true)}
              disabled={!!activeQuickDate} 
              style={{
                flex: 1,
                borderWidth: 1.5,
                borderColor: "#d1d1f0",
                borderRadius: 12,
                backgroundColor: !!activeQuickDate ?"#cccccc" : "#fff", // stronger gray
                padding: 10,
              }}
            >
          <Text style={{ color: "#6c63ff", fontWeight: "600" }}>
            {customDate
              ? `${customDate.getDate()} ${customDate.toLocaleString("default", { month: "short" })} ${customDate.getFullYear()}`
              : "Custom Date"}
          </Text>

            </TouchableOpacity>
            {customDate && (
              <TouchableOpacity onPress={clearCustomDate} style={{ marginLeft: 6 }}>
                <Ionicons name="close-circle" size={22} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Quick Date Modal */}
      <Modal visible={showQuickDateModal} transparent animationType="slide">
        <View
          style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View style={{ margin: 20, backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
            <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
              Select Quick Date
            </Text>
            <FlatList
              data={quickDateOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleQuickDateSelect(item)}
                  style={{ paddingVertical: 10 }}
                >
                  <Text style={{ fontSize: 15, color: "#333" }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowQuickDateModal(false)}>
              <Text style={{ color: "red", marginTop: 12, textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Custom Date Modal */}
<Modal visible={showCustomDateModal} transparent animationType="slide">
  <View
    style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}
  >
    <View style={{ margin: 20, backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
      <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
        Select Date
      </Text>

      {/* Show the picker only if no date has been picked yet */}
      {!customDate && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setCustomDate(selectedDate); // store selected date
          }}
        />
      )}

      {/* Show selected date immediately after picking */}
      {customDate && (
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#6c63ff", marginBottom: 12 }}>
          {`${customDate.getDate()} ${customDate.toLocaleString("default", { month: "short" })} ${customDate.getFullYear()}`}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => {
          handleCustomDateSelect(customDate); // apply filter
          setShowCustomDateModal(false);      // close modal
        }}
      >
        <Text style={{ color: "red", marginTop: 12, textAlign: "center" }}>Done</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
}
