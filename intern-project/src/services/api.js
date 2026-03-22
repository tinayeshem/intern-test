

export async function fetchBooks(query) {
  var url = "https://openlibrary.org/search.json?q=" + encodeURIComponent(query) + "&limit=20&fields=title,author_name,first_publish_year,cover_i,key";

  var response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network error");
  }

  var data = await response.json();

  if (!data.docs || data.docs.length === 0) {
    throw new Error("NOTHING_FOUND");
  }

  return data.docs;
}
