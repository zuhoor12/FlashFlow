# VocabFlow (FlashCartV1)

A lightweight flashcard-style vocabulary review app built with Vite, Tailwind CSS, and LocalForage.

![VocabFlow app screenshot](public/vocabflow-screenshot.png)


# ⚡ VocabFlow (FlashCartV1)
> Master new languages, one card at a time.

VocabFlow is a high-performance, browser-based flashcard app built with **Vite**, **Tailwind CSS**, and **LocalForage**. It uses a spaced-repetition logic to help you move vocabulary from short-term to long-term memory.
## Project Overview

`VocabFlow` is a spaced-repetition vocabulary trainer with three review boxes:
- Daily
- Medium
- Mastered

Users can add new words and meanings through a modal form, then review and move cards through the boxes.

## Tech Stack

- Vite
- JavaScript (ES Modules)
- Tailwind CSS
- LocalForage
- HTML / CSS

## Features

- Add vocabulary words with meanings
- Persist words in browser storage using LocalForage
- Review cards in a flip-card interface
- Track totals for all boxes and per-box counts
- Move words from Daily → Medium → Mastered
- Delete mastered words

## Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the built app:

```bash
npm run preview
```

## Project Structure

```
FlashCartV1/
├── index.html
├── package.json
├── vite.config.ts
├── README.md
├── src/
│   ├── main.js
│   ├── style.css
│   ├── Copmonent/
│   │   ├── BoxManager.js
│   │   ├── localStorageManager.js
│   │   ├── form/
│   │   │   ├── getFormData.js
│   │   │   └── validation.js
│   │   └── modal/
│   │       └── Modal.js
│   └── dataBase/
│       └── saveOnlocalStorage.js
└── public/
    └── *.svg
```

## Important Files

- `index.html` — main app UI structure
- `src/main.js` — application bootstrap and event wiring
- `src/Copmonent/BoxManager.js` — box selection, rendering, review flow, move/delete actions
- `src/Copmonent/localStorageManager.js` — LocalForage storage layer
- `src/Copmonent/modal/Modal.js` — modal display, flip-card UI, progress counters
- `src/Copmonent/form/getFormData.js` — form input extraction
- `src/Copmonent/form/validation.js` — input validation logic
- `src/style.css` — custom styles and card animation helpers
- `vite.config.ts` — Vite configuration with Tailwind plugin

## Notes

- The app uses Vite with `type: module` and modern ES module imports.
- LocalForage stores words in three separate stores: `daily`, `medium`, and `master`.

## Usage

1. Click `Add Word` to open the modal.
2. Enter a word and meaning.
3. Add the word to the `Daily` review box.
4. Use the `Show Meaning`, `Next`, and `Move to Box 2` buttons to review and promote words.

## Known limitations

- The app currently stores each word key directly in LocalForage, so duplicate words overwrite previous entries.
- The `Move to Box 2` button only moves words from Daily → Medium or Medium → Mastered.

## License

This project is private.
