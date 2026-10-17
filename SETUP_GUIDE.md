# AnkitMaske portfolio — update guide

## What's updated
- Your uploaded Stream Starting illustration is included at `assets/stream-starting.png`.
- The homepage now uses it as featured artwork and as the first project card.
- Responsive dark premium design with neon-lime accents.
- An `admin.html` starter page is included.

## Publish this version to your existing GitHub Pages website
1. Download and extract the ZIP on your computer.
2. Open your GitHub repository: https://github.com/ankitmaske-range/ankitmaske-portfolio-
3. Click **Add file → Upload files**.
4. Upload `index.html`, `admin.html`, `style.css`, `app.js`, `SETUP_GUIDE.md`, and the `assets` folder (including `stream-starting.png`). Drag the files/folder into the upload area.
5. Scroll down, enter a commit message such as `Update AnkitMaske portfolio design`, and click **Commit changes**.
6. Wait 1–3 minutes, then refresh https://ankitmaske-range.github.io/ankitmaske-portfolio-/

## Important about admin editing
The included `admin.html` is a starter interface, not a secure live content-management system yet. Its preview button saves only to your current browser. GitHub Pages cannot securely save changes or authenticate an administrator by itself. For real editing from the website, connect a backend such as Google Apps Script + Google Sheets + Google Drive, or a service with authentication and a database. Do not treat this starter admin page as secure for private administration.

## Add more images
1. Open your GitHub repository and click **Add file → Upload files**.
2. Upload images into `assets/`.
3. Edit `index.html` and add a project card using a relative path like `assets/my-project.jpg`.
4. Commit changes.

## Video guidance
Use YouTube embeds or a video hosting service for large videos. GitHub repository storage is not a good video-streaming host. For Google Drive videos, check sharing permissions and playback on mobile before publishing.
