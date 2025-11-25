# Travel Guide Web (Next.js)

Next.js 15 App Router application for the Madrid & Segovia travel experience. Features curated content, Leaflet map, PDF export, and the AI Travel Scout panel that consumes the separate AI service.

## Scripts

```bash
npm run dev    # local development
npm run build  # production build
npm run start  # start built app
npm run lint   # Next lint rules
```

## Environment

Create `.env.local` with:

```
NEXT_PUBLIC_AI_API_URL=http://localhost:4000
```

Point this to the deployed AI service. The client app never stores secrets—all calls go to the AI service.

## Tech stack
- Next.js 15 (App Router)
- TailwindCSS
- React Leaflet + Leaflet
- jsPDF for offline exports

## Structure
```
app/              # layout + page entry
components/       # client components
hooks/            # custom hooks (state + AI integration)
data/             # static city/location data
utils/            # helpers (PDF, leaflet icons)
types/            # shared TypeScript models
```
