# Comrades Blog

I used to be a columnist a decade ago, and I hosted my articles on a WordPress site that is now defunct. I have managed to retrieve the SQL dump and the associated media files, so I decided to create a new Next.js site to host them.

You can access the articles here: [text](https://comrades-git-main-lukorito-s-projects.vercel.app/)


A modern, high-aesthetic Next.js blog migrated from a WordPress cPanel backup archive. 

## Features

- **Next.js App Router**: Statically pre-rendered (SSG) for lightning-fast page loading and optimal SEO.
- **Custom Vanilla CSS Design System**: Responsive grid layout, elegant typography, dark/light theme switching, and glassmorphism panels.
- **WordPress Data Extractor**: A python extraction script that reads directly from the WordPress SQL dump and copies asset uploads into Next.js.
- **URL-Based Filter Syncing**: Homepage category and search filters update the URL search query parameters, enabling bookmarks and easy sharing.
- **Fully Interactive Blog**: Comment threads (nested parent-replies) and category filtering.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS (CSS variables, responsive media queries)
- **Database Extractor**: Python 3 (custom parsing script)

---

## Getting Started

### 1. Extraction (Optional / Done)

If you ever need to re-extract the database contents, make sure Python 3 is installed, then run the python script:
```bash
python scripts/extract_wp_to_json.py
```
This parses the WordPress SQL dump, decodes text to UTF-8 (resolving curly quotes, contractions, and dashes), converts raw line breaks to HTML paragraphs, and copies featured images to the public folder.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

Start the development server with the Webpack compiler:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the blog.

### 4. Build for Production

```bash
npm run build
```

---

## Deploying on Vercel

The easiest way to deploy this blog is using the Vercel Platform:

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/new) and import your repository.
3. Keep the default settings (Vercel will detect Next.js).
4. Click **Deploy**. Vercel will build the static pages and host your blog globally!
