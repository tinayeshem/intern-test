const PLACEHOLDER = "/src/assets/No_Image_Available.jpg";

export function createBookCard(book, onClickAction, isFavorite = false) {
  const card = document.createElement("div");
  card.classList.add("book-card");
  card.dataset.bookKey = book.key;

  const img = document.createElement("img");
  img.alt = "Cover of " + book.title;
  img.src = book.cover_i
    ? "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg"
    : PLACEHOLDER;
  img.onerror = function() {
    img.onerror = null;
    img.src = PLACEHOLDER;
  };

  const body = document.createElement("div");
  body.classList.add("book-card-body");

  const title = document.createElement("h3");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.classList.add("author");
  author.textContent = book.author_name ? book.author_name.join(", ") : "Unknown";

  const year = document.createElement("p");
  year.classList.add("year");
  year.textContent = book.first_publish_year || "N/A";

  const btn = document.createElement("button");
  btn.textContent = isFavorite ? "— Remove" : "+ Add to Favourites";
  if (isFavorite) btn.classList.add("is-favorite");
  btn.addEventListener("click", function() { onClickAction(book); });

  body.append(title, author, year, btn);
  card.append(img, body);

  return card;
}
