# Agency Image Tool

A modern, client-side web application for compressing, converting, and resizing images. Built with vanilla JavaScript and Tailwind CSS.

## Features

-   **Image Compression**: Reduce file size with adjustable quality.
-   **Format Conversion**: Convert between JPG, PNG, and WebP.
-   **Resizing**: Resize images by width/height or presets (Instagram, Web, etc.).
-   **Privacy**: All processing happens locally in the browser. No files are uploaded.
-   **Batch Processing**: Handle multiple files at once.
-   **ZIP Export**: Download all processed images in a single ZIP file.

## Tech Stack

-   **HTML5 & CSS3**
-   **Tailwind CSS** (via CDN for styling)
-   **JavaScript (ES6+)**
-   **Libraries**:
    -   `browser-image-compression`: For image processing.
    -   `JSZip`: For creating ZIP archives.
    -   `FileSaver.js`: For triggering downloads.

## Setup & Usage

1.  **Clone or Download** the repository.
2.  **Open `index.html`** in your browser.
    -   *Note*: For best performance and strict security policies, use a local server (e.g., VS Code Live Server).
3.  **Select a Tool**: Choose Compress, Convert, or Resize tabs.
4.  **Drag & Drop** images into the drop zone.
5.  **Adjust Settings** in the right sidebar.
6.  **Click Process** and download your results!

## File Structure

```
agency-image-tool/
├── index.html          # Main application file
├── README.md           # Documentation
└── assets/
    ├── css/
    │   └── style.css   # Custom styles & animations
    └── js/
        ├── app.js      # Main controller
        ├── ui.js       # UI rendering logic
        ├── helpers.js  # Utility functions
        ├── imageProcessor.js # Image logic
        └── zipExport.js      # ZIP handling
```

## Browser Support

Works on all modern browsers (Chrome, Edge, Firefox, Safari). Requires JavaScript to be enabled.
