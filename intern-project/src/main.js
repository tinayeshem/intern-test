import "./styles/main.css";
import { fetchBooks } from "./services/api.js";

import { createBookCard } from "./components/BookCard.js";
import { getFavorites, saveFavorites } from "./utils/storage.js";


const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");
const favoritesContainer = document.getElementById("favorites");
const message = document.getElementById("message");

let state = {
  books: [],
  favorites: []
};

// INIT
function init() {
  state.favorites = getFavorites();
  renderFavorites();
}

// SEARCH
async function handleSearch() {
  const query = input.value.trim();

  if (!query) {
    message.textContent = "Enter a query";
    return;
  }

  message.textContent = "Loading...";

  try {
    const books = await fetchBooks(query);

    if (books.length === 0) {
      message.textContent = "Nothing found";
      return;
    }

    state.books = books;
    message.textContent = "";

    renderBooks();
  } catch (err) {
    console.error("FETCH ERROR:", err); 
    message.textContent = "Error fetching data";
  }
}

// RENDER BOOKS
function renderBooks() {
  resultsContainer.innerHTML = "";

  state.books.forEach(book => {
    const card = createBookCard(book, addToFavorites);
    resultsContainer.appendChild(card);
  });
}

// FAVORITES
function addToFavorites(book) {
  if (!state.favorites.find(b => b.key === book.key)) {
    state.favorites.push(book);
    saveFavorites(state.favorites);
    renderFavorites();
  }
}

function removeFromFavorites(book) {
  state.favorites = state.favorites.filter(b => b.key !== book.key);
  saveFavorites(state.favorites);
  renderFavorites();
}

// RENDER FAVORITES
function renderFavorites() {
  favoritesContainer.innerHTML = "";

  state.favorites.forEach(book => {
    const card = createBookCard(book, removeFromFavorites, true);
    favoritesContainer.appendChild(card);
  });
}

// EVENTS
button.addEventListener("click", handleSearch);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// START
init();