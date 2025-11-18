import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ProductCardSL from "../Product/ProductCardSL";
import { removeProductsFromShoppingList } from "../Product/removeProductsFromShoppingList";
import { updateProductsStatusesFromShoppingList } from "../Product/updateProductsStatusesFromShoppingList";
import { addProductsToShoppingList } from "../Product/addProductsToShoppingList";
import { deleteShoppingList } from "../ShoppingList/deleteShoppingList";
import { TextInput } from "react-native";
import { updateShoppingList } from "../ShoppingList/updateShoppingList";
import Toast from "../utils/Toast";
import { useMarketPhotoPrice } from "../Product/useMarketPhotoPrice";
import { createProduct } from "../Product/createProduct";
import { Dimensions, ScrollView } from "react-native";

const screenHeight = Dimensions.get("window").height;

export default function ShoppingLists({
  item,
  index,
  onDelete,
  onUpdateProducts,
  listName,
  onProductAdded,
}) {
  const [expanded, setExpanded] = useState(false),
    [products, setProducts] = useState([]),
    [showToBuy, setShowToBuy] = useState(false),
    [showBought, setShowBought] = useState(false),
    [totalBoughtPrice, setTotalBoughtPrice] = useState(0),
    [retrieveMode, setRetrieveMode] = useState(false),
    [modalVisible, setModalVisible] = useState(false),
    [toBuySelectionMode, setToBuySelectionMode] = useState(false),
    [toBuyEditMode, setToBuyEditMode] = useState(false),
    [toBuySelectedProducts, setToBuySelectedProducts] = useState([]),
    [boughtSelectionMode, setBoughtSelectionMode] = useState(false),
    [boughtSelectedProducts, setBoughtSelectedProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [editedName, setEditedName] = useState(item.Name);
  const [toBuyContentHeight, setToBuyContentHeight] = useState(0);
  const [boughtContentHeight, setBoughtContentHeight] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (item.Products)
      setProducts(
        item.Products.map((p) => ({ ...p, Status: p.Status ?? "ToBuy" }))
      );
  }, [item.Products]);
  useEffect(() => {
    setTotalBoughtPrice(
      products
        .filter((p) => p.Status === "Bought")
        .reduce((sum, p) => sum + Number(p.Price || 0), 0)
    );
  }, [products]);
  useEffect(() => {
    if (!showToBuy) {
      setToBuyContentHeight(0);
    }
  }, [showToBuy]);

  const resetAllSelections = () => {
    setToBuySelectionMode(false);
    setToBuyEditMode(false);
    setToBuySelectedProducts([]);
    setBoughtSelectionMode(false);
    setBoughtSelectedProducts([]);
    setRetrieveMode(false);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const lower = String(toastMessage).toLowerCase();
    // If this looks like a validation/error message, reset selection/buttons so they match ticks
    const errorKeywords = [
      "failed",
      "cannot",
      "attach",
      "required",
      "exists",
      "invalid",
      "error",
      "must",
      "exceed",
      "already",
    ];
    if (errorKeywords.some((k) => lower.includes(k))) {
      resetAllSelections();
      setIsProcessing(false);
    }
  }, [toastMessage]);

  const handleDeleteList = () =>
    Alert.alert(
      "Delete List",
      `Are you sure you want to delete "${item.Name}"?\nThis action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteShoppingList(item.Shopping_List_ItemID);
              if (onDelete) onDelete(item.Shopping_List_ItemID);
              resetAllSelections();
            } catch {
              Alert.alert("Error", "Failed to delete the shopping list.");
            }
          },
        },
      ]
    );

  const toggleSelection = (product, selectedProducts, setSelected) =>
    setSelected((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  const handleRemoveSelected = async (selectedProducts, statusCheck) => {
    if (!selectedProducts.length) return;
    setIsProcessing(true);
    // 1 second loading phase to block other buttons
    await new Promise((r) => setTimeout(r, 700));
    try {
      await removeProductsFromShoppingList(
        selectedProducts.map((p) => p.ProductID),
        [item.Shopping_List_ItemID]
      );
      const updated = products.filter((p) => !selectedProducts.includes(p));
      setProducts(updated);
      if (statusCheck === "ToBuy") {
        // ensure all selection modes / ticks are reset after successful remove
        if (updated.filter((p) => p.Status === "ToBuy").length === 0)
          setShowToBuy(false);
      } else {
        if (updated.filter((p) => p.Status === "Bought").length === 0)
          setShowBought(false);
      }
      if (onUpdateProducts)
        onUpdateProducts(item.Shopping_List_ItemID, updated);
      resetAllSelections();
      setToastMessage(
        `${selectedProducts.length} product(s) removed successfully!`
      );
    } catch (err) {
      setToastMessage(err?.message || "Failed to remove selected products.");
      resetAllSelections();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProductName.trim()) {
      setToastMessage("Product name cannot be empty.");
      console.log("Add Product aborted: name empty");
      return;
    }
    try {
      console.log("Creating product:", newProductName, newProductCategory);
      const newProduct = await createProduct({
        name: newProductName,
        category: newProductCategory,
      });
      console.log("Product created:", newProduct);
      console.log(
        "Assigning product to shopping list:",
        newProduct.ProductID,
        item.Shopping_List_ItemID
      );
      await addProductsToShoppingList(
        [newProduct.ProductID],
        [item.Shopping_List_ItemID]
      );
      console.log("Product assigned successfully");
      setProducts((prev) => [...prev, { ...newProduct, Status: "ToBuy" }]);
      console.log("UI updated with new product");
      setNewProductName("");
      setNewProductCategory("");
      setAddProductModalVisible(false);
      if (onProductAdded) {
        console.log("Calling parent callback onProductAdded");
        onProductAdded(newProduct.Name, item.Name);
      }
    } catch (err) {
      setToastMessage(err.message || "Failed to add product.");
    }
  };

  const handleUpdateSelectedToBuy = async () => {
    if (!toBuySelectedProducts.length) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const productsWithoutMarket = [];
      const updatedProducts = [...products];
      for (const product of toBuySelectedProducts) {
        let marketData = null;
        if (product.Photos?.length) {
          marketData = await useMarketPhotoPrice(
            product.ProductID,
            item.Shopping_List_ItemID
          );
          if (!marketData) {
            productsWithoutMarket.push(product.Name);
            continue;
          }
        }
        await updateProductsStatusesFromShoppingList(
          [product.ProductID],
          [item.Shopping_List_ItemID]
        );
        const index = updatedProducts.findIndex(
          (p) => p.ProductID === product.ProductID
        );
        if (index !== -1) updatedProducts[index].Status = "Bought";
      }
      setProducts(updatedProducts);
      // reset all selection modes/ticks after successful buy operation
      resetAllSelections();
      if (updatedProducts.filter((p) => p.Status === "ToBuy").length === 0)
        setShowToBuy(false);
      if (onUpdateProducts)
        onUpdateProducts(item.Shopping_List_ItemID, updatedProducts);
      if (productsWithoutMarket.length > 0) {
        setToastMessage(
          `Attach a market before buying: ${productsWithoutMarket.join(", ")}`
        );
        resetAllSelections();
      } else {
        setToastMessage("Products moved to Bought successfully!");
      }
    } catch (err) {
      setToastMessage(err?.message || "Failed to move products to Bought.");
      resetAllSelections();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetrieveSelectedBought = async () => {
    if (!boughtSelectedProducts.length) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    try {
      await addProductsToShoppingList(
        boughtSelectedProducts.map((p) => p.ProductID),
        [item.Shopping_List_ItemID]
      );
      const updated = products.map((p) =>
        boughtSelectedProducts.includes(p) ? { ...p, Status: "ToBuy" } : p
      );
      setProducts(updated);
      // reset selections/buttons after successful retrieve
      resetAllSelections();
      if (updated.filter((p) => p.Status === "Bought").length === 0)
        setShowBought(false);
      if (onUpdateProducts)
        onUpdateProducts(item.Shopping_List_ItemID, updated);
      setToastMessage(
        `${boughtSelectedProducts.length} product(s) moved back to ToBuy!`
      );
    } catch (err) {
      setToastMessage(err?.message || "Failed to retrieve selected products.");
      resetAllSelections();
    } finally {
      setIsProcessing(false);
    }
  };

  const toBuyProducts = products.filter((p) => p.Status === "ToBuy"),
    boughtProducts = products.filter((p) => p.Status === "Bought");

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.headerRow}
      >
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.Name}</Text>
          <Text style={styles.createdAt}>
            {new Date(item.AddedAt).toLocaleDateString()}{" "}
            {new Date(item.AddedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View style={styles.deleteContainer}>
          <View style={styles.verticalLine} />
          <TouchableOpacity
            onPress={handleDeleteList}
            style={styles.trashButton}
          >
            <Feather name="trash-2" size={22} color="#c00" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <Text style={styles.count}>{products.length} Product(s)</Text>
      <TouchableOpacity
        onPress={() => setAddProductModalVisible(true)}
        style={{
          marginVertical: 10,
          backgroundColor: "#6c63ff",
          padding: 10,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Add Product</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={addProductModalVisible}
        onRequestClose={() => setAddProductModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: "85%", padding: 20 }]}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 20,
                color: "#6c63ff",
              }}
            >
              Add Product
            </Text>
            <TextInput
              placeholder="Name"
              placeholderTextColor="#999"
              value={newProductName}
              onChangeText={setNewProductName}
              style={{
                backgroundColor: "#f2f2f7",
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 15,
                fontSize: 16,
                marginBottom: 15,
                color: "#333",
              }}
            />
            <TextInput
              placeholder="Category"
              placeholderTextColor="#999"
              value={newProductCategory}
              onChangeText={setNewProductCategory}
              style={{
                backgroundColor: "#f2f2f7",
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 15,
                fontSize: 16,
                marginBottom: 20,
                color: "#333",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setAddProductModalVisible(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#6c63ff",
                }}
              >
                <Text style={{ color: "#6c63ff", fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isProcessing}
                onPress={handleAddProduct}
                style={{
                  backgroundColor: "#6c63ff",
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
              </TouchableOpacity>
            </View>
            {toastMessage && (
              <Toast
                message={toastMessage}
                onHide={() => setToastMessage(null)}
              />
            )}
            {isProcessing && (
              <View style={styles.processingOverlay} pointerEvents="box-none">
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {editMode ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <TextInput
                    value={editedName}
                    onChangeText={setEditedName}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      borderBottomWidth: 1,
                      borderColor: "#ccc",
                      fontSize: 18,
                      color: "#333",
                      paddingVertical: 4,
                    }}
                    placeholder="List Name"
                    placeholderTextColor="#999"
                  />
                  {editedName.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setEditedName("")}
                      style={{ marginLeft: 6 }}
                    >
                      <Feather name="x-circle" size={18} color="#6c63ff" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      setEditedName(item.Name);
                      setEditMode(false);
                    }}
                    style={{
                      marginLeft: 12,
                      width: 35,
                      height: 35,
                      borderRadius: 22,
                      backgroundColor: "#ff4d4d",
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 6,
                    }}
                  >
                    <Feather name="x" size={20} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const message = await updateShoppingList({
                          shopping_list_id: item.Shopping_List_ItemID,
                          name: editedName,
                        });
                        item.Name = editedName;
                        setEditMode(false);
                        setToastMessage(message);
                      } catch (err) {
                        setToastMessage(
                          err.message || "Failed to update list name."
                        );
                        resetAllSelections();
                      }
                    }}
                    style={{
                      marginLeft: 10,
                      width: 35,
                      height: 35,
                      borderRadius: 22,
                      backgroundColor: "#6c63ff",
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 6,
                    }}
                  >
                    <Feather name="check" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={styles.modalTitle}>{item.Name}</Text>
                  <TouchableOpacity
                    onPress={() => setEditMode(true)}
                    style={{ marginLeft: 10 }}
                  >
                    <Feather name="edit-3" size={20} color="#6c63ff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.totalPriceContainer}>
              <View style={styles.totalPriceLeft}>
                <Feather name="shopping-cart" size={20} color="#6c63ff" />
                <Text style={styles.totalPriceLabel}>Total Cost</Text>
              </View>
              <Text style={styles.totalPriceValue}>
                €{totalBoughtPrice.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              disabled={isProcessing}
              style={styles.sectionHeader}
              onPress={() => setShowToBuy(!showToBuy)}
            >
              <Text style={styles.sectionTitle}>
                Product(s) To Buy ({toBuyProducts.length})
              </Text>
              <Text style={styles.toggleIcon}>{showToBuy ? "−" : "+"}</Text>
            </TouchableOpacity>
            {showToBuy && (
              <View
                style={{
                  height: toBuyProducts.length
                    ? Math.min(toBuyContentHeight + 80, screenHeight * 0.25)
                    : screenHeight * 0.06,
                }}
              >
                {toBuyProducts.length ? (
                  <>
                    <ScrollView
                      style={{ flex: 1 }}
                      onContentSizeChange={(width, height) => {
                        const roundedHeight = Math.round(height);
                        if (Math.abs(roundedHeight - toBuyContentHeight) > 1) {
                          setToBuyContentHeight(roundedHeight);
                        }
                      }}
                    >
                      {toBuyProducts.some((p) => !p.Photos?.length) && (
                        <View style={styles.sectionContainer}>
                          <Text style={styles.sectionTitle}>Items Created</Text>
                          <View style={styles.sectionContent}>
                            <FlatList
                              data={toBuyProducts.filter(
                                (p) => !p.Photos?.length
                              )}
                              keyExtractor={(p) => p.ProductID.toString()}
                              scrollEnabled={false}
                              renderItem={({ item: product }) => (
                                <ProductCardSL
                                  product={product}
                                  shoppingListItemId={item.Shopping_List_ItemID}
                                  showPrice
                                  selectionMode={toBuySelectionMode}
                                  selected={toBuySelectedProducts.includes(
                                    product
                                  )}
                                  onSelect={() =>
                                    toggleSelection(
                                      product,
                                      toBuySelectedProducts,
                                      setToBuySelectedProducts
                                    )
                                  }
                                  onPriceChange={(price) =>
                                    setProducts((prev) =>
                                      prev.map((p) =>
                                        p.ProductID === product.ProductID
                                          ? { ...p, Price: price }
                                          : p
                                      )
                                    )
                                  }
                                />
                              )}
                            />
                          </View>
                        </View>
                      )}
                      {toBuyProducts.some((p) => p.Photos?.length) && (
                        <View style={styles.sectionContainerAlt}>
                          <Text style={styles.sectionTitleAlt}>
                            Items from System
                          </Text>
                          <View style={styles.sectionContentAlt}>
                            <FlatList
                              data={toBuyProducts.filter(
                                (p) => p.Photos?.length
                              )}
                              keyExtractor={(p) => p.ProductID.toString()}
                              scrollEnabled={false}
                              renderItem={({ item: product }) => (
                                <ProductCardSL
                                  product={product}
                                  shoppingListItemId={item.Shopping_List_ItemID}
                                  showPrice
                                  selectionMode={toBuySelectionMode}
                                  selected={toBuySelectedProducts.includes(
                                    product
                                  )}
                                  onSelect={() =>
                                    toggleSelection(
                                      product,
                                      toBuySelectedProducts,
                                      setToBuySelectedProducts
                                    )
                                  }
                                  onPriceChange={(price) =>
                                    setProducts((prev) =>
                                      prev.map((p) =>
                                        p.ProductID === product.ProductID
                                          ? { ...p, Price: price }
                                          : p
                                      )
                                    )
                                  }
                                />
                              )}
                            />
                          </View>
                        </View>
                      )}
                    </ScrollView>
                    {!toBuySelectionMode ? (
                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            {
                              backgroundColor: toBuyProducts.length
                                ? "#6c63ff"
                                : "#ccc",
                            },
                          ]}
                          disabled={isProcessing || !toBuyProducts.length}
                          onPress={() => {
                            setToBuySelectionMode(true);
                            setToBuyEditMode(false);
                          }}
                        >
                          <Text style={styles.actionText}>
                            Select to remove
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            {
                              backgroundColor: toBuyProducts.length
                                ? "#ffa500"
                                : "#ccc",
                            },
                          ]}
                          disabled={isProcessing || !toBuyProducts.length}
                          onPress={() => {
                            setToBuySelectionMode(true);
                            setToBuyEditMode(true);
                          }}
                        >
                          <Text style={styles.actionText}>Select To Buy</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          disabled={isProcessing}
                          style={[
                            styles.actionButton,
                            {
                              backgroundColor: toBuyEditMode
                                ? "#6c63ff"
                                : "#ff6b6b",
                            },
                          ]}
                          onPress={
                            toBuyEditMode
                              ? handleUpdateSelectedToBuy
                              : () =>
                                  handleRemoveSelected(
                                    toBuySelectedProducts,
                                    "ToBuy"
                                  )
                          }
                        >
                          <Text style={styles.actionText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={isProcessing}
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#aaa" },
                          ]}
                          onPress={() => {
                            setToBuySelectionMode(false);
                            setToBuyEditMode(false);
                            setToBuySelectedProducts([]);
                          }}
                        >
                          <Text style={styles.actionText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontStyle: "italic", color: "#666" }}>
                      No products in the to-buy list
                    </Text>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity
              disabled={isProcessing}
              style={styles.sectionHeader}
              onPress={() => setShowBought(!showBought)}
            >
              <Text style={styles.sectionTitle}>
                Product(s) Bought ({boughtProducts.length})
              </Text>
              <Text style={styles.toggleIcon}>{showBought ? "−" : "+"}</Text>
            </TouchableOpacity>
            {showBought && (
              <View
                style={{
                  height: boughtProducts.length
                    ? Math.min(boughtContentHeight + 80, screenHeight * 0.25)
                    : screenHeight * 0.06,
                }}
              >
                {boughtProducts.length ? (
                  <>
                    <ScrollView
                      style={{ flex: 1 }}
                      onContentSizeChange={(width, height) => {
                        const rounded = Math.round(height);
                        if (Math.abs(rounded - boughtContentHeight) > 1) {
                          setBoughtContentHeight(rounded);
                        }
                      }}
                    >
                      {boughtProducts.some((p) => !p.Photos?.length) && (
                        <View style={styles.sectionContainer}>
                          <Text style={styles.sectionTitle}>Items Created</Text>
                          <View style={styles.sectionContent}>
                            <FlatList
                              data={boughtProducts.filter(
                                (p) => !p.Photos?.length
                              )}
                              keyExtractor={(p) => p.ProductID.toString()}
                              scrollEnabled={false}
                              renderItem={({ item: product }) => (
                                <ProductCardSL
                                  product={product}
                                  shoppingListItemId={item.Shopping_List_ItemID}
                                  showPrice
                                  selectionMode={boughtSelectionMode}
                                  selected={boughtSelectedProducts.includes(
                                    product
                                  )}
                                  onSelect={() =>
                                    toggleSelection(
                                      product,
                                      boughtSelectedProducts,
                                      setBoughtSelectedProducts
                                    )
                                  }
                                  onPriceChange={(price) =>
                                    setProducts((prev) =>
                                      prev.map((p) =>
                                        p.ProductID === product.ProductID
                                          ? { ...p, Price: price }
                                          : p
                                      )
                                    )
                                  }
                                />
                              )}
                            />
                          </View>
                        </View>
                      )}
                      {boughtProducts.some((p) => p.Photos?.length) && (
                        <View style={styles.sectionContainerAlt}>
                          <Text style={styles.sectionTitleAlt}>
                            Items from System
                          </Text>
                          <View style={styles.sectionContentAlt}>
                            <FlatList
                              data={boughtProducts.filter(
                                (p) => p.Photos?.length
                              )}
                              keyExtractor={(p) => p.ProductID.toString()}
                              scrollEnabled={false}
                              renderItem={({ item: product }) => (
                                <ProductCardSL
                                  product={product}
                                  shoppingListItemId={item.Shopping_List_ItemID}
                                  showPrice
                                  selectionMode={boughtSelectionMode}
                                  selected={boughtSelectedProducts.includes(
                                    product
                                  )}
                                  onSelect={() =>
                                    toggleSelection(
                                      product,
                                      boughtSelectedProducts,
                                      setBoughtSelectedProducts
                                    )
                                  }
                                  onPriceChange={(price) =>
                                    setProducts((prev) =>
                                      prev.map((p) =>
                                        p.ProductID === product.ProductID
                                          ? { ...p, Price: price }
                                          : p
                                      )
                                    )
                                  }
                                />
                              )}
                            />
                          </View>
                        </View>
                      )}
                    </ScrollView>
                    {!boughtSelectionMode ? (
                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            {
                              backgroundColor: boughtProducts.length
                                ? "#6c63ff"
                                : "#ccc",
                            },
                          ]}
                          disabled={isProcessing || !boughtProducts.length}
                          onPress={() => {
                            setBoughtSelectionMode(true);
                            setRetrieveMode(false);
                          }}
                        >
                          <Text style={styles.actionText}>
                            Select to remove
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            {
                              backgroundColor: boughtProducts.length
                                ? "#ffa500"
                                : "#ccc",
                            },
                          ]}
                          disabled={isProcessing || !boughtProducts.length}
                          onPress={() => {
                            setBoughtSelectionMode(true);
                            setRetrieveMode(true);
                          }}
                        >
                          <Text style={styles.actionText}>
                            Select to retrieve
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          disabled={isProcessing}
                          style={[
                            styles.actionButton,
                            {
                              backgroundColor: retrieveMode
                                ? "#6c63ff"
                                : "#ff6b6b",
                            },
                          ]}
                          onPress={
                            retrieveMode
                              ? handleRetrieveSelectedBought
                              : () =>
                                  handleRemoveSelected(
                                    boughtSelectedProducts,
                                    "Bought"
                                  )
                          }
                        >
                          <Text style={styles.actionText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={isProcessing}
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#aaa" },
                          ]}
                          onPress={() => {
                            setBoughtSelectionMode(false);
                            setBoughtSelectedProducts([]);
                            setRetrieveMode(false);
                          }}
                        >
                          <Text style={styles.actionText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontStyle: "italic", color: "#666" }}>
                      No products in the bought list
                    </Text>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity
              disabled={isProcessing}
              style={{
                backgroundColor: "#c00",
                paddingVertical: 10,
                paddingHorizontal: 25,
                borderRadius: 8,
                alignSelf: "center",
                marginTop: 15,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 3,
              }}
              onPress={() => {
                setModalVisible(false);
                setEditMode(false);
                setEditedName(item.Name);
                setToastMessage(null);
                setToBuySelectionMode(false);
                setToBuyEditMode(false);
                setToBuySelectedProducts([]);
                setBoughtSelectionMode(false);
                setRetrieveMode(false);
                setBoughtSelectedProducts([]);
                setShowToBuy(false);
                setShowBought(false);
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Close
              </Text>
            </TouchableOpacity>
            {toastMessage && (
              <Toast
                message={toastMessage}
                onHide={() => setToastMessage(null)}
              />
            )}
            {isProcessing && (
              <View style={styles.processingOverlay} pointerEvents="box-none">
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: "#eef0ff",
    borderRadius: 8,
    padding: 4,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: "#c6c6ff",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  sectionContainerAlt: {
    backgroundColor: "#fef6e4",
    borderRadius: 8,
    padding: 4,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: "#ffe0a0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6c63ff",
    marginBottom: 3,
    borderBottomWidth: 1.5,
    borderColor: "#6c63ff44",
    paddingBottom: 1,
  },
  sectionTitleAlt: {
    fontSize: 14,
    fontWeight: "700",
    color: "#b86b00",
    marginBottom: 3,
    borderBottomWidth: 1.5,
    borderColor: "#ffa50044",
    paddingBottom: 1,
  },
  sectionContent: {
    backgroundColor: "#f9f9ff",
    borderRadius: 7,
    padding: 2,
    gap: 2,
  },
  sectionContentAlt: {
    backgroundColor: "#fff8ec",
    borderRadius: 7,
    padding: 2,
    gap: 2,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    gap: 8,
    paddingVertical: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: { color: "#fff", fontWeight: "600" },
  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#8c82ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  textContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#6c63ff" },
  createdAt: { fontSize: 12, color: "#666", marginTop: 2 },
  count: { fontSize: 12, color: "#fff", marginVertical: 4 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    backgroundColor: "#f5f5ff",
    borderRadius: 8,
  },
  toggleIcon: { fontSize: 18, fontWeight: "600", color: "#6c63ff" },
  productList: { marginVertical: 4 },
  totalPriceContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  totalPriceLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  totalPriceLabel: { fontSize: 14, fontWeight: "600", color: "#333" },
  totalPriceValue: { fontSize: 18, fontWeight: "700", color: "#6c63ff" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#6c63ff",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#6c63ff",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
});
