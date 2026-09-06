# Manga Reader Application

A lightweight, server-rendered web application for browsing and reading manga, powered by the [MangaDex API](https://api.mangadex.org/docs/). Built with Node.js, Express, and EJS, this project focuses on delivering a fast, ad-free, and continuous vertical reading experience with dynamic chapter navigation.

## Features

* **Advanced Search & Filtering:** Browse manga by title with dynamic query parameters and genre filtering.
* **Comprehensive Metadata:** View detailed manga information, including localized titles (Romaji/English fallback), cover arts, tags, and content ratings.
* **Dynamic Chapter Navigation:** Automatic adjacent chapter detection (`Next` and `Previous` buttons) via the MangaDex feed endpoint.
* **Vertical Reading Mode:** Infinite-scroll style reading interface optimized for webcomics and manga.
* **Smart Page Navigation:** Built-in Vanilla JS dropdown UI for smooth-scrolling directly to specific pages within a chapter.
* **Optimized Delivery:** Images are sourced directly from the MangaDex@Home network with native browser `lazy` loading for optimal bandwidth usage.

## Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** EJS (Embedded JavaScript templating), HTML5, CSS3, Vanilla JavaScript (DOM manipulation)
* **HTTP Client:** Axios (for server-to-server API requests)

## Architecture & API Integration

This application operates as a middleware client interacting with the MangaDex REST API, utilizing server-side rendering to protect API keys (if applicable) and reduce client-side processing.

| Feature | MangaDex Endpoint | Description |
| :--- | :--- | :--- |
| **Search & Explore** | `/manga` | Fetches manga lists based on query parameters and applied filters. |
| **Chapter Feed** | `/manga/{id}/feed` | Retrieves the ordered chapter list for a specific manga to calculate `Next`/`Previous` navigation states. |
| **Chapter Metadata** | `/chapter/{id}?includes[]=manga` | Fetches chapter-specific data (title, number, translated language) and linked manga entity data in a single request. |
| **Image Retrieval** | `/at-home/server/{id}` | Obtains the `baseUrl`, `hash`, and filename array to construct direct image URLs from the MangaDex@Home CDN. |

## Prerequisites

Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v16.x or higher recommended)
* npm (Node Package Manager)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/manga-reader.git](https://github.com/yourusername/manga-reader.git)
   cd manga-reader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   node index.js
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```text
├── public/
│   └── styles/
│       ├── style.css         # Global styling and component layouts
│       └── chapter.css       # Specific styling for the reading interface
├── views/
│   ├── index.ejs             # Search and discover page
│   ├── manga.ejs             # Manga details and chapter list grid
│   └── chapters.ejs          # Reading interface, navigation, and page rendering
├── index.js                  # Express server setup and API routing
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
```

## Error Handling & Resiliency

The backend implements `try/catch` blocks for all asynchronous Axios requests, returning standard HTTP 500 status codes with JSON error objects upon failure. On the frontend, EJS templates heavily utilize optional chaining (`?.`) and fallback logical operators (`||`) to prevent application crashes when metadata (such as specific localized titles, cover images, or official chapter numbers) is omitted by scanlation groups.
