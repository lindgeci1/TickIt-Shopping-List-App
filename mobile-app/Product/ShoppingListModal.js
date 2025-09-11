import React from "react";
import { View, Text, Modal, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useShoppingListModal } from "./ShoppingListModalLogic";

export default function ShoppingListModal({ visible, onClose, shoppingLists, onSelect, onCreate }) {
  const { newListName, setNewListName, selectedId, showAll, setShowAll, loading, message, messageColor, highlightId, handleCreate, handleSelect } =
    useShoppingListModal({ visible, onSelect, onCreate });

  const reversedLists = Array.isArray(shoppingLists) ? [...shoppingLists].reverse() : [];
  const displayedLists = showAll ? reversedLists : reversedLists.slice(0, 3);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Shopping List</Text>

          {shoppingLists.length > 0 ? <>
            <FlatList data={displayedLists} keyExtractor={(item, i) => item?.Shopping_List_ItemID?.toString() || i.toString()}
              renderItem={({ item }) => item && <TouchableOpacity style={[styles.listItem, item.Shopping_List_ItemID === selectedId && styles.selectedListItem, item.Shopping_List_ItemID === highlightId && styles.highlightItem]} disabled={loading} onPress={() => handleSelect(item, onClose)}>
                <Text style={styles.listText}>{item?.Name || "Unnamed List"}</Text>
              </TouchableOpacity>} style={{ maxHeight: 200, marginBottom: 5 }} />
            {shoppingLists.length > 3 && !showAll && <TouchableOpacity onPress={() => setShowAll(true)} style={styles.showMoreButton}><Text style={styles.showMoreText}>Show More</Text></TouchableOpacity>}
            {showAll && <TouchableOpacity onPress={() => setShowAll(false)} style={styles.showMoreButton}><Text style={styles.showMoreText}>Collapse All</Text></TouchableOpacity>}
          </> : <Text style={styles.emptyText}>No lists yet, create one below</Text>}

          <View style={styles.createContainer}>
            <TextInput style={styles.input} placeholder="New list name..." placeholderTextColor="#555" value={newListName} onFocus={() => showAll && setShowAll(false)} onChangeText={setNewListName} />
            <TouchableOpacity style={[styles.createButton, loading && { opacity: 0.7 }]} onPress={newListName ? handleCreate : null} disabled={loading}>
              {loading ? <View style={{ flexDirection: "row", alignItems: "center" }}><ActivityIndicator size="small" color="#999" /><Text style={styles.loadingText}> Adding to list...</Text></View> : <Text style={styles.createButtonText}>{newListName ? "Create" : "Add List"}</Text>}
            </TouchableOpacity>
          </View>

          {message.length > 0 && <View style={[styles.successContainer, { backgroundColor: messageColor === "#155724" ? "#d4edda" : messageColor === "#856404" ? "#fff3cd" : "#f8d7da" }]}>
            <Text style={[styles.successText, { color: messageColor }]}>{message}</Text>
          </View>}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// stacked CSS
const styles = StyleSheet.create({
  overlay:{flex:1,backgroundColor:"rgba(0,0,0,0.5)",justifyContent:"center",alignItems:"center"},
  container:{width:"90%",maxHeight:"80%",backgroundColor:"#fff",borderRadius:15,padding:20,shadowColor:"#000",shadowOpacity:0.1,shadowRadius:10,elevation:10},
  title:{fontSize:20,fontWeight:"700",marginBottom:15,color:"#2d3436"},
  listItem:{paddingVertical:12,paddingHorizontal:15,borderRadius:12,backgroundColor:"#f5f5f5",marginBottom:8},
  selectedListItem:{backgroundColor:"#6c63ff20"},
  listText:{fontSize:16,color:"#2d3436"},
  emptyText:{textAlign:"center",color:"#888",marginVertical:15,fontStyle:"italic"},
  showMoreButton:{alignItems:"center",paddingVertical:8},
  showMoreText:{color:"#6c63ff",fontWeight:"600",fontSize:14},
  createContainer:{marginTop:10},
  input:{borderWidth:1,borderColor:"#ccc",borderRadius:12,padding:12,marginBottom:10,fontSize:16,color:"#000"},
  createButton:{backgroundColor:"#6c63ff",paddingVertical:12,borderRadius:12,alignItems:"center"},
  createButtonText:{color:"#fff",fontWeight:"600",fontSize:16},
  loadingText:{color:"#999",fontWeight:"600",fontSize:16,marginLeft:5},
  highlightItem:{backgroundColor:"#6c63ff40",borderWidth:1,borderColor:"#6c63ff"},
  cancelButton:{alignItems:"center",padding:12,marginTop:10},
  cancelText:{color:"#6c63ff",fontWeight:"600",fontSize:16},
  successContainer:{backgroundColor:"#d4edda",padding:10,borderRadius:12,marginTop:10},
  successText:{color:"#155724",textAlign:"center",fontWeight:"600"},
});
