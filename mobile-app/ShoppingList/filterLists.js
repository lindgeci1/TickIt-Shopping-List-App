// ShoppingList/filterLists.js

export const filterLists = (allLists, setLists, query) => {
  if (!allLists) return;

  const lowerQuery = query ? query.toLowerCase() : "";

  const filtered = allLists.filter((list) => {
    const name = list.Name ? list.Name.toLowerCase() : "";
    return name.includes(lowerQuery);
  });

  setLists(filtered);
};
