# HTML to Markdown Converter

A simple web application to convert HTML to Markdown, running in a Docker container.

Copy and paste your HTML code and get the Markdown equivalent.

### Live demo available at: [https://pl-plt.github.io/html_markdown_converter/](https://pl-plt.github.io/html_markdown_converter/)

## Quick Start with Docker

Build the image:
```bash
docker build -t html-markdown-converter .
```

Run the container:
```bash
docker run -p 3000:3000 html-markdown-converter
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

And now, you can just paste your HTML text in the left textarea and click "Convert to Markdown" to see the result on the right!

## How it Works

- **Frontend**: A simple HTML/JS interface using [Turndown](https://github.com/mixmark-io/turndown) for conversion.
- **Backend**: A lightweight Node.js Express server serving the static files.
- **Persistence**: Uses `localStorage` to save your input/output between reloads.

## Important Note on Indentation

I did not find a way to convert code-container divs properly. So even if they are converted to markdown, the indentation is lost. I suggest you to manually fix the indentation after conversion.
