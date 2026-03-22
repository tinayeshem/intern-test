var KEY = "favorites";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch (e) {
    return [];
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  } catch (e) {
    console.warn("Could not save favourites.");
  }
}
