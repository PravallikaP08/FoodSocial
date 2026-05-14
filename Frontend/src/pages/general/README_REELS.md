Add sample videos for the Reels UI

Place video files under the project's `public/videos/` folder (create if missing):

- public/videos/sample1.mp4
- public/videos/sample2.mp4
- public/videos/sample3.mp4

The Home reels UI will reference `/videos/sample1.mp4` etc. Replace the src values in `src/pages/general/Home.jsx` with your real video URLs if you host them elsewhere.

Notes:

- Videos are set to muted and loop so they play automatically on supported browsers.
- The "Visit Store" button currently navigates to `/store/<id>`; wire this to your routes or backend as needed.
