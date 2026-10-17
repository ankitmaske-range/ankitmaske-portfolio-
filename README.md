# RiteshX Video Editing Portfolio

A responsive static portfolio for GitHub Pages with:
- 15 editable project cards and category filters
- Project details modal with YouTube playback
- Automatic muted preview support on hover and while visible on screen **when you provide short MP4 preview clips**
- Mobile-friendly layout, keyboard access, reduced-motion handling
- No build tools or paid services required to host the website

## Files

- `index.html` — page structure
- `style.css` — styling and responsive layout
- `script.js` — project gallery, filters, preview behavior and video modal
- `projects.js` — editable projects, YouTube IDs, preview URLs, contact details

## Important: YouTube and automatic previews

YouTube embeds are reliable for the full video player, but YouTube does not provide a supported, dependable way to start a muted preview on hover inside your own gallery card. This site therefore uses:
- YouTube for full project playback after a click.
- Optional short MP4 clips for automatic hover/on-scroll previews.

If `previewMp4` is blank, the project card shows its thumbnail; it will still open the full YouTube video when clicked once `videoId` is set.

To create a preview, export a 5–10 second, low-resolution MP4 (for example 720p, H.264, muted audio) and host it at a direct HTTPS video URL. You can use a GitHub repository for tiny preview clips, but GitHub Pages has repository and bandwidth constraints; for many/larger previews, use a video hosting/CDN service with appropriate free-tier limits. Do not put private client work in a public repository.

## Add your YouTube video

Open `projects.js`. Set `videoId` to either:
- the 11-character ID from `https://www.youtube.com/watch?v=VIDEO_ID`, or
- a full YouTube URL such as `https://youtu.be/VIDEO_ID`.

Example:
```js
videoId: "dQw4w9WgXcQ",
previewMp4: "",
```

For automatic previews:
```js
videoId: "dQw4w9WgXcQ",
previewMp4: "https://your-host.example.com/previews/clutch-mode.mp4",
```

Replace the sample thumbnail URL with a URL to your own image, or put an image in the repository (e.g. `assets/clutch-mode.jpg`) and set:
```js
thumbnail: "assets/clutch-mode.jpg",
```

You can change each project's title, category, description, role, tools and year in the same object. Available categories are `Gaming`, `Travel`, `Motion Graphics`, and `Social`.

## Personalize contact details

At the top of `projects.js`, replace:
```js
email: "hello@example.com"
```
with your real contact email. The YouTube, Instagram and LinkedIn values are prepared for later if you want to add social icons/links.

## Publish with GitHub Pages (free)

1. Create or sign in to a GitHub account at https://github.com/.
2. Create a new **public** repository, e.g. `riteshx-portfolio`.
3. Upload `index.html`, `style.css`, `script.js`, `projects.js`, and this README to the repository root.
4. Open the repository's **Settings → Pages**.
5. Under build/deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
6. Wait for GitHub Pages to publish the site. The URL will be shown in Settings → Pages, typically `https://YOUR-USERNAME.github.io/riteshx-portfolio/`.
7. Test the site on phone and desktop, and check every video in a private/incognito window.

## Limitations and notes

- This is a static website; no database, admin dashboard, visitor analytics, or upload form is included.
- Project data is edited in `projects.js` and then re-uploaded to GitHub.
- Unlisted YouTube videos are accessible to anyone who has the link; do not use them for confidential work.
- YouTube playback can be affected by embedding restrictions, age restrictions, regional settings or deleted/private videos.
- Automatic MP4 preview playback is intentionally disabled on touch/mobile devices and when the visitor requests reduced motion. Mobile visitors see the thumbnail and can tap to open the full video.
- The included project images are illustrative placeholders, not real portfolio work. Replace them with your own project thumbnails before publishing.
- For the best result, use custom thumbnails with a consistent visual style and concise project descriptions.
