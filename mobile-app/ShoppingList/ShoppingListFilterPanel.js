import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Dimensions, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { filterLists } from "./filterLists";
import { filterListsByDate } from "./filterListsByDate";
import { filterListsByCustomDate } from "./filterListsByCustomDate";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const screenHeight = Dimensions.get("window").height;

export default function ShoppingListFilterPanel({ allLists, setFilteredLists, search, setSearch, activeQuickDate, setActiveQuickDate, customDate, setCustomDate }) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempQuickDate, setTempQuickDate] = useState(activeQuickDate);
  const [tempCustomDate, setTempCustomDate] = useState(customDate);
  const quickDateOptions = ["Today", "Yesterday", "Last 7 Days", "This Month"];
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [disabledQuickDates, setDisabledQuickDates] = useState({});
  useEffect(() => { setTempQuickDate(activeQuickDate); setTempCustomDate(customDate); }, [showFilterModal]);

  const handleSearchChange = (text) => {
    setSearch(text);
    if (customDate) filterListsByCustomDate(allLists.filter(item => item.Name.toLowerCase().includes(text.toLowerCase())), setFilteredLists, customDate);
    else filterLists(allLists, setFilteredLists, text, activeQuickDate);
  };

  const handleTempQuickDateSelect = (date) => { setTempQuickDate(date); setTempCustomDate(null); };
  const handleTempCustomDateSelect = (date) => { setTempCustomDate(date); setTempQuickDate(null); };

  return (
    <View style={{ marginBottom: 10, padding: 12, backgroundColor: "#dfe3ff", borderRadius: 12 }}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6c63ff" style={{ marginRight: 6 }} />
        <TextInput style={styles.searchInput} placeholder="Search for a list..." placeholderTextColor="#777" value={search} onChangeText={handleSearchChange} />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(""); filterLists(allLists, setFilteredLists, "", activeQuickDate); }} style={{ marginLeft: 6 }}>
            <Ionicons name="close-circle" size={18} color="#6c63ff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button */}
      <TouchableOpacity onPress={() => setShowFilterModal(true)} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#6c63ff", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 1, alignSelf: "flex-start" }}>
        <Ionicons name="options-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Filters</Text>
        {(activeQuickDate || customDate) && (
          <View style={{ backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 6, paddingVertical: 1, marginLeft: 6 }}>
            <Text style={{ color: "#6c63ff", fontSize: 11, fontWeight: "700" }}>● Active</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <SafeAreaView style={styles.bottomSheet}>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.modalTitle}>Filters</Text>

              {/* Quick Date */}
              <View style={[styles.filterSection, tempCustomDate ? { opacity: 0.5 } : {}]} pointerEvents={tempCustomDate ? "none" : "auto"}>
                <Text style={styles.sectionTitle}>Quick Date</Text>
                <Text style={[styles.sectionHint, { fontStyle: "italic", marginBottom: 8 }]}>Filter lists by a predefined date range.</Text>

                <FlatList
                  data={quickDateOptions}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 4, gap: 8 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (tempQuickDate === item) {
                          // second click → clear selection
                          setTempQuickDate(null);
                        } else {
                          handleTempQuickDateSelect(item); // first click → select
                        }
                      }}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                        backgroundColor: tempQuickDate === item ? "#6c63ff" : "#f0f0f0",
                      }}
                    >
                      <Text style={{ color: tempQuickDate === item ? "#fff" : "#333", fontWeight: tempQuickDate === item ? "600" : "400", fontSize: 12 }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Custom Date */}
              <View style={[styles.filterSection, tempQuickDate ? { opacity: 0.5 } : {}]} pointerEvents={tempQuickDate ? "none" : "auto"}>
                <Text style={styles.sectionTitle}>Custom Date</Text>
                <Text style={styles.sectionHint}>Select a specific date to filter lists created on that day.</Text>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{
                      paddingVertical: 6, // same as Quick Date buttons
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      backgroundColor: tempCustomDate ? "#6c63ff" : "#f0f0f0",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: tempCustomDate ? "#fff" : "#333", fontWeight: tempCustomDate ? "600" : "400", fontSize: 12 }}>
                      {tempCustomDate ? tempCustomDate.toDateString() : "Select Date"}
                    </Text>
                  </TouchableOpacity>

                  {tempCustomDate && (
                    <TouchableOpacity onPress={() => setTempCustomDate(null)} style={{ marginLeft: 8 }}>
                      <Text style={{ color: "red", fontSize: 12 }}>Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="date"
                  date={tempCustomDate || new Date()}
                  onConfirm={(date) => { setShowDatePicker(false); handleTempCustomDateSelect(date); }}
                  onCancel={() => setShowDatePicker(false)}
                  headerTextIOS="Pick a date"
                  confirmTextIOS="Select"
                  cancelTextIOS="Cancel"
                  pickerContainerStyleIOS={{ backgroundColor: "#fff", borderRadius: 12, paddingVertical: 10 }}
                  themeVariant="light"
                />
              </View>
              </View>

            {/* Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 24, marginBottom: 12 }}>
              <TouchableOpacity onPress={() => { setTempQuickDate(activeQuickDate); setTempCustomDate(customDate); setShowFilterModal(false); }} style={styles.cancelButton}>
                <Text style={{ color: "#6c63ff", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                setActiveQuickDate(tempQuickDate);
                setCustomDate(tempCustomDate);
                if (tempQuickDate) filterListsByDate(allLists, setFilteredLists, search, tempQuickDate);
                else if (tempCustomDate) filterListsByCustomDate(allLists.filter(item => item.Name.toLowerCase().includes(search.toLowerCase())), setFilteredLists, tempCustomDate);
                else filterLists(allLists, setFilteredLists, search);
                setShowFilterModal(false);
              }} style={styles.applyButton}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#d1d1f0", borderRadius: 12, backgroundColor: "#fff", paddingHorizontal: 10, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  searchInput: { flex: 1, height: 40, fontSize: 15 },
  filterButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", backgroundColor: "#6c63ff", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  modalBackground: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  bottomSheet: { maxHeight: screenHeight * 0.85, backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  modalTitle: { fontWeight: "700", fontSize: 18, marginBottom: 12, textAlign: "center" },
  sectionTitle: { fontWeight: "600", fontSize: 16, marginVertical: 8 },
  sectionHint: { fontStyle: "italic", fontSize: 13, color: "#555", marginBottom: 8 },
  separator: { height: 1, backgroundColor: "#ddd" },
  option: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8 },
  clearButton: { alignSelf: "flex-end", marginVertical: 4 },
  cancelButton: { flex: 1, borderWidth: 1, borderColor: "#6c63ff", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginRight: 8 },
  applyButton: { flex: 1, backgroundColor: "#6c63ff", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginLeft: 8 },
  filterSection: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, padding: 12, marginVertical: 8, backgroundColor: "#fafafa" },
});