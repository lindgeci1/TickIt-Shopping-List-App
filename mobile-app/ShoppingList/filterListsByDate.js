// filterLists.js
export function filterListsByDate(allLists, setFilteredLists, searchText = "", activeDate = null) {
  if (!allLists) return;

  let filtered = allLists;

  // 1️⃣ Filter by search text
  if (searchText && searchText.trim() !== "") {
    const lowerQuery = searchText.toLowerCase();
    filtered = filtered.filter(item => item.Name && item.Name.toLowerCase().includes(lowerQuery));
  }

  // 2️⃣ Filter by date
  if (activeDate) {
    const now = new Date();
    filtered = filtered.filter(item => {
      if (!item.AddedAt) return false;

      // Parse the DB string "YYYY-MM-DD HH:mm:ss" safely
      const addedDate = new Date(item.AddedAt.replace(" ", "T"));

      switch (activeDate) {
        case "Today":
          return (
            addedDate.getFullYear() === now.getFullYear() &&
            addedDate.getMonth() === now.getMonth() &&
            addedDate.getDate() === now.getDate()
          );

        case "Yesterday": {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          return (
            addedDate.getFullYear() === yesterday.getFullYear() &&
            addedDate.getMonth() === yesterday.getMonth() &&
            addedDate.getDate() === yesterday.getDate()
          );
        }

        case "Last 7 Days": {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 6); // include today
          return addedDate >= sevenDaysAgo && addedDate <= now;
        }

        case "This Month":
          return (
            addedDate.getFullYear() === now.getFullYear() &&
            addedDate.getMonth() === now.getMonth()
          );

        default:
          // Assume custom date string "YYYY-MM-DD" or Date object
          const custom = new Date(activeDate);
          return (
            addedDate.getFullYear() === custom.getFullYear() &&
            addedDate.getMonth() === custom.getMonth() &&
            addedDate.getDate() === custom.getDate()
          );
      }
    });
  }
  setFilteredLists(filtered);
}
