export const filterProducts = (allProducts, setProducts, query, category) => {
  let filtered = [...allProducts];

  filtered = filtered.map((p) => ({
    ...p,
    Category: p.Category
      ? p.Category.charAt(0).toUpperCase() + p.Category.slice(1).toLowerCase()
      : null,
  }));

  if (query) {
    filtered = filtered.filter((p) =>
      p.Name?.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (category) {
    filtered = filtered.filter(
      (p) => p.Category?.toLowerCase() === category.toLowerCase()
    );
  }

  setProducts(filtered);
};
