import "./styles/main.css";
import { fetchBooks } from "./services/api.js";
import { createBookCard } from "./components/BookCard.js";
import { getFavorites, saveFavorites } from "./utils/storage.js";

// DOM refs
var input              = document.getElementById("searchInput");
var button             = document.getElementById("searchBtn");
var resultsContainer   = document.getElementById("booksContainer");
var favoritesContainer = document.getElementById("favorites");
var message            = document.getElementById("message");
var favBadge           = document.getElementById("favBadge");
var resultsLabel       = document.getElementById("resultsLabel");
var resultsCount       = document.getElementById("resultsCount");
var resultsQuery       = document.getElementById("resultsQuery");
var themeToggle        = document.getElementById("themeToggle");
var themeIcon          = document.getElementById("themeIcon");
var themeLabel         = document.getElementById("themeLabel");
var filterRow          = document.getElementById("filterRow");
var authorFilter       = document.getElementById("authorFilter");
var filterClear        = document.getElementById("filterClear");

var state = {
  books: [],
  favorites: []
};

// ──  THEME TOGGLE ───────────────────────────────────
var savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeButton(savedTheme);

themeToggle.addEventListener("click", function() {
  var current = document.documentElement.getAttribute("data-theme");
  var next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeButton(next);
});

function updateThemeButton(theme) {
  if (theme === "dark") {
    themeIcon.textContent = "☀";
    themeLabel.textContent = "LIGHT";
  } else {
    themeIcon.textContent = "☾";
    themeLabel.textContent = "DARK";
  }
}

// ──  DEBOUNCE ───────────────────────────────────────
function debounce(fn, delay) {
  var timer;
  return function() {
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(null, args);
    }, delay);
  };
}

// ── AUTHOR FILTER ──────────────────────────────────
function applyAuthorFilter() {
  var filterVal = authorFilter.value.trim().toLowerCase();

  if (!filterVal) {
    renderBooks(state.books);
    return;
  }

  var filtered = state.books.filter(function(book) {
    if (!book.author_name) return false;
    return book.author_name.some(function(a) {
      return a.toLowerCase().includes(filterVal);
    });
  });

  renderBooks(filtered);
}

authorFilter.addEventListener("input", applyAuthorFilter);

filterClear.addEventListener("click", function() {
  authorFilter.value = "";
  renderBooks(state.books);
});

// ── INIT ──────────────────────────────────────────────────
function init() {
  state.favorites = getFavorites();
  renderFavorites();
}

// ── SEARCH ────────────────────────────────────────────────
async function handleSearch() {
  var query = input.value.trim();

  if (!query) {
    message.textContent = "// enter a search term";
    message.className = "";
    return;
  }

  message.textContent = "// searching...";
  message.className = "";
  resultsLabel.style.display = "none";
  filterRow.style.display = "none";
  authorFilter.value = "";
  resultsContainer.innerHTML = '<div class="state-loading"><div class="spinner"></div><p>SEARCHING CATALOGUE...</p></div>';

  try {
    var books = await fetchBooks(query);

    state.books = books;
    message.textContent = "";

    resultsLabel.style.display = "flex";
    resultsCount.textContent = books.length;
    resultsQuery.textContent = 'results for "' + query + '"';

    // Show author filter once we have results
    filterRow.style.display = "flex";

    renderBooks(state.books);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    resultsLabel.style.display = "none";
    filterRow.style.display = "none";

    if (err.message === "NOTHING_FOUND") {
      resultsContainer.innerHTML = '<div class="state-error"><span class="state-num">000</span><p>Nothing found for "' + query + '".<br>Try a different search.</p></div>';
      message.textContent = "";
    } else {
      resultsContainer.innerHTML = '<div class="state-error"><span class="state-num">ERR</span><p>Network error.<br>Check your connection.</p></div>';
      message.textContent = "// network error";
      message.className = "error";
    }
  }
}

// ── RENDER BOOKS ──────────────────────────────────────────
function renderBooks(books) {
  resultsContainer.innerHTML = "";

  if (books.length === 0) {
    resultsContainer.innerHTML = '<div class="state-empty"><span class="state-num">—</span><p>No books match that author.<br>Try a different name.</p></div>';
    return;
  }

  books.forEach(function(book) {
    var alreadySaved = state.favorites.find(function(b) { return b.key === book.key; });
    var card = createBookCard(book, addToFavorites, !!alreadySaved);
    resultsContainer.appendChild(card);
  });
}

// ── FAVOURITES ────────────────────────────────────────────
function addToFavorites(book) {
  if (!state.favorites.find(function(b) { return b.key === book.key; })) {
    state.favorites.push(book);
    saveFavorites(state.favorites);
    renderFavorites();

    var card = resultsContainer.querySelector('[data-book-key="' + book.key + '"]');
    if (card) {
      var btn = card.querySelector("button");
      if (btn) { btn.textContent = "— Remove"; btn.classList.add("is-favorite"); }
    }
  }
}

function removeFromFavorites(book) {
  state.favorites = state.favorites.filter(function(b) { return b.key !== book.key; });
  saveFavorites(state.favorites);
  renderFavorites();

  var card = resultsContainer.querySelector('[data-book-key="' + book.key + '"]');
  if (card) {
    var btn = card.querySelector("button");
    if (btn) { btn.textContent = "+ Save"; btn.classList.remove("is-favorite"); }
  }
}

// ── RENDER FAVOURITES SIDEBAR ─────────────────────────────
function renderFavorites() {
  favoritesContainer.innerHTML = "";
  favBadge.textContent = state.favorites.length;

  if (state.favorites.length === 0) {
    favoritesContainer.innerHTML = '<p class="fav-empty">Your saved books<br>will appear here.</p>';
    return;
  }

  state.favorites.forEach(function(book) {
    var item = document.createElement("div");
    item.classList.add("fav-item");

    var img = document.createElement("img");
    img.alt = "Cover of " + book.title;
    img.src = book.cover_i
      ? "https://covers.openlibrary.org/b/id/" + book.cover_i + "-S.jpg"
      : "/No_Image_Available.jpg";
    img.onerror = function() { img.onerror = null; img.src = "/No_Image_Available.jpg"; };

    var info = document.createElement("div");
    info.classList.add("fav-item-info");

    var titleEl = document.createElement("div");
    titleEl.classList.add("fav-item-title");
    titleEl.textContent = book.title;

    var authorEl = document.createElement("div");
    authorEl.classList.add("fav-item-author");
    authorEl.textContent = book.author_name ? book.author_name[0] : "Unknown";

    info.append(titleEl, authorEl);

    var removeBtn = document.createElement("button");
    removeBtn.classList.add("fav-item-remove");
    removeBtn.textContent = "✕";
    removeBtn.setAttribute("aria-label", "Remove " + book.title);
    removeBtn.addEventListener("click", function() { removeFromFavorites(book); });

    item.append(img, info, removeBtn);
    favoritesContainer.appendChild(item);
  });
}

// ── EVENTS ────────────────────────────────────────────────
button.addEventListener("click", handleSearch);

input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") { handleSearch(); }
});

// BONUS: On-the-fly search with debounce (fires after 500ms, min 3 chars)
input.addEventListener("input", debounce(function(e) {
  if (e.target.value.trim().length >= 3) {
    handleSearch();
  }
}, 500));

// ── START ─────────────────────────────────────────────────
init();
