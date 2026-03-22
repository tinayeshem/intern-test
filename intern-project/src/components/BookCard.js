
export function create(book,onClickAction,isFavourite=false){
    const card = document.createElement("div")
    document.createElement("div")
    card.classList.add("book-card")

    const img = document.createElement("img")      
    img.src = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg`
        : "assets/no-cover.png";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = book.author_name
        ? book.author_name.join(", ")
        : "Unknown";

    const year = document.createElement("p");
    year.textContent = book.first_publish_year || "N/A";

    const btn = document.createElement("button");
    btn.textContent = isFavorite ? "Remove" : "Add to Favorites";

    btn.addEventListener("click", () => onClickAction(book));

    card.append(img, title, author, year, btn);

    return card;
}