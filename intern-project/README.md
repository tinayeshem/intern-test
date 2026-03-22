

## Task

[Innowise Internship — Simple Books Catalogue]

live deployment link - wondrous-fox-e9f6d0.netlify.app

## How to run the app

**Prerequisites:** Node.js 18+
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The production build outputs to `dist/` and contains:
- `index.html`
- `bundle.js`
- `bundle.css`
- `assets/` — images and icons

## Folder structure
```
intern-project/
├── index.html              # App entry point (HTML shell)
├── vite.config.js          # Vite build configuration
├── package.json
├── public/                 # Static files copied as-is to dist/
│   └── No_Image_Available.jpg
└── src/
    ├── main.js             # Entry point — wires up all modules
    ├── components/
    │   └── BookCard.js     # Builds a single book card DOM element
    ├── services/
    │   └── api.js          # Open Library API fetch wrapper
    ├── utils/
    │   └── storage.js      # localStorage read/write helpers
    └── styles/
        └── main.css        # All styles, CSS variables, light/dark themes
```

## Features

- Search books by title, author, or keyword via the Open Library API
- On-the-fly search with debounce (triggers after 3 characters, 500ms delay)
- Filter results by author name
- Add and remove favourites 
- Favourites sidebar restored on page reload
- Light / dark theme 
- Responsive layout 
- Loading, error, empty, and no-results states all handled