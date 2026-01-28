# Infinite Carousel (Mobile)

Mobile-only infinite carousel built with Angular 19. Includes swipe, autoplay, and simulated API loading. No third-party UI libraries are used.

## Requirements

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run (development)

```bash
npm start
```

Open `http://localhost:4200/`.

## Build (production)

```bash
npm run build
```

Build output: `dist/carousel-app/`.

## Project structure

- `src/app/components/carousel/` — infinite loop + swipe + autoplay
- `src/app/components/carousel-slide/` — slide UI
- `src/app/services/slides.service.ts` — slide data + simulated API delay
- `src/app/styles/_variables.scss` — theme tokens
- `public/` — assets + favicon

## Notes

- Autoplay runs every 10 seconds and pauses during drag.
- Vertical scrolling is blocked on the carousel screen to ensure reliable swipe.
