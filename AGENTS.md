# Repository Guidelines

## Project Structure & Module Organization

MendelSim is a static HTML/CSS/JavaScript site with no framework or build step. The entry point is `index.html`. Topic pages live in `modulos/` (`monohibrido.html`, `dihibrido.html`, `ligado-sexo.html`, `pedigri.html`). Shared JavaScript lives in `js/`: `genetics.js` contains the genetics calculation engine, `darkmode.js` handles theme toggling, and `pedigri.js` supports pedigree interactions. Shared styles are in `css/style.css`; keep common layout, colors, buttons, cards, and form styles there. Static browser assets such as `favicon.svg` stay at the repository root.

## Build, Test, and Development Commands

There is no dependency install or compile command. Open `index.html` directly in a modern browser for normal use.

Useful local checks:

```bash
python3 -m http.server 8000
```

Serves the site at `http://localhost:8000/` when browser security rules or relative links need an HTTP origin.

```bash
git status --short
```

Review the working tree before committing.

## Coding Style & Naming Conventions

Use two-space indentation in HTML, CSS, and JavaScript. Prefer plain browser APIs over new dependencies. Keep user-facing text in Spanish and maintain the existing educational tone. Reuse CSS custom properties from `:root` and existing utility classes (`.btn`, `.card`, `.form-group`, `.punnett-grid`) before adding new styles. Name new module pages with lowercase kebab-case, for example `modulos/nuevo-modulo.html`. Use clear camelCase names for JavaScript functions and variables.

## Testing Guidelines

No automated test suite is currently configured. Validate changes manually in the browser. For calculation changes, test representative crosses in the affected module and compare genotype and phenotype ratios against expected Mendelian results. For UI changes, check desktop and mobile widths, dark mode, keyboard focus, and all links from `index.html` to module pages. If adding automated tests later, keep them close to `js/genetics.js` logic and document the command here.

## Commit & Pull Request Guidelines

Recent commits use concise Spanish summaries such as `Añadir cuadros de leyes/principios en todos los módulos`. Keep commit messages short, descriptive, and action-oriented. Pull requests should include a brief summary, affected modules, manual test steps, and screenshots or screen recordings for visible UI changes. Link related issues when available.

## Agent-Specific Instructions

Do not push to GitHub without explicit permission from Juanjo. When using GitHub remotes, use the SSH configuration already set up on this system.
