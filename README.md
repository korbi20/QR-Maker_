# QR-Maker_

A minimal and modern QR code generator focused on clean UX, theme switching, and fast export workflows.

![QR-Maker Preview](.github/assets/QR-Maker_Preview.gif)

## Features

- Live text input with Enter-based QR generation.
- Export as **PNG**, **SVG**, **JPG**, or **Base64 (Clipboard)**.
- Size control slider with practical snap points.
- Theme system via `src/themes.json` with `localStorage` persistence.
- Keyboard shortcuts (`Ctrl/Cmd + 1..4`) for quick exports.

## Quick Start

This project is fully static, so you can run it with any basic local web server.

### Option A: Open directly

1. Clone the repository.
2. Open `index.html` in your browser.

### Option B: Run a local server (recommended)

```bash
python3 -m http.server 8080
```

Then open: `http://localhost:8080`

<details>
    <summary>Project Structure</summary>

    ```
    .
    ├── index.html          # Main page and UI logic
    ├── src/
    │   ├── export.js       # Export functions (PNG/SVG/JPG/Base64)
    │   ├── modal.css       # Export modal styling
    │   ├── slider.css      # Slider styling
    │   └── themes.json     # Theme definitions
    └── LICENSE
    ```
</details>

## Demo

GitHub Pages: https://korbi20.github.io/QR-Maker_/

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE).
