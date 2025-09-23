// filterListsByCustomDate.js
export function filterListsByCustomDate(allLists, setFilteredLists, customDate) {
  if (!allLists) return;

  let filtered = allLists;

  // Filter by the selected custom date
  if (customDate) {
    const selectedDate = new Date(customDate);
    filtered = filtered.filter(item => {
      if (!item.AddedAt) return false;
      const addedDate = new Date(item.AddedAt.replace(" ", "T"));

      return (
        addedDate.getFullYear() === selectedDate.getFullYear() &&
        addedDate.getMonth() === selectedDate.getMonth() &&
        addedDate.getDate() === selectedDate.getDate()
      );
    });
  }

  setFilteredLists(filtered);
}
