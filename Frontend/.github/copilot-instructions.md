# Copilot Instructions for MERN Project Frontend

## Project Overview

This is a React frontend project bootstrapped with Vite. It uses React Router for client-side routing and is structured for modular expansion. The project is part of a larger MERN stack, but this repo contains only the frontend.

## Architecture & Key Files

- **Entry Point:** `src/main.jsx` mounts the root React component (`App`).
- **App Component:** `src/App.jsx` imports global styles and sets up routing via `AppRoutes`.
- **Routing:** All routes are defined in `src/routes/AppRoutes.jsx` using `react-router-dom`. Example routes:
  - `/user/register`, `/user/login`
  - `/food-partner/register`, `/food-partner/login`
- **Static Assets:** Place images and icons in `src/assets/` or `public/`.
- **Global Styles:** Defined in `src/App.css`.

## Developer Workflows

- **Start Dev Server:** `npm run dev` (or `yarn dev`) launches Vite with HMR.
- **Build for Production:** `npm run build` outputs to `dist/`.
- **Preview Production Build:** `npm run preview` serves the built app locally.
- **Linting:** `npm run lint` uses ESLint with custom config (`eslint.config.js`).

## Conventions & Patterns

- **React 19+**: Uses latest React features. Prefer functional components and hooks.
- **Routing:** All navigation is handled via `react-router-dom`'s `<Routes>` and `<Route>` components. Add new pages by updating `AppRoutes.jsx`.
- **ESLint Rules:** Unused variables starting with uppercase or underscore are ignored (`varsIgnorePattern: '^[A-Z_]'`).
- **Module Imports:** Use relative imports for local files. All code is ES Modules.
- **No TypeScript:** This template is JS-only, but can be extended to TS if needed.

## External Dependencies

- **React** and **React DOM** for UI
- **react-router-dom** for routing
- **Vite** for build/dev server
- **ESLint** for linting

## Integration Points

- **Backend API:** Not present in this repo. Integrate via fetch/axios in future components.
- **Environment Variables:** Use `.env` files for secrets/config (not present by default).

## Examples

- To add a new route, edit `src/routes/AppRoutes.jsx`:
  ```jsx
  <Route path="/new-path" element={<NewComponent />} />
  ```
- To add global styles, edit `src/App.css`.

## References

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [React Router Docs](https://reactrouter.com/)

---

**For AI agents:**

- Always update `AppRoutes.jsx` for new pages.
- Use the provided ESLint config for code style.
- Do not add TypeScript unless requested.
- Keep assets in `src/assets/` or `public/`.
- Use functional components and hooks.
