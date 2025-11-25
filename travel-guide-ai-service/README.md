# Travel Guide AI Service

Express-based service that orchestrates prompts to a local or remote Ollama instance and returns normalized itinerary suggestions.

## Scripts

```bash
npm run dev     # tsx watch for local development
npm run build   # compile to dist/
npm run start   # run compiled server
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | `4000` | Port for this service |
| `OLLAMA_URL` | `http://127.0.0.1:11434` | Ollama host |
| `OLLAMA_MODEL` | `llama3.1` | Model to request |
| `OLLAMA_TIMEOUT_MS` | `15000` | Timeout before aborting model calls |

## API

- `GET /health` — readiness check
- `POST /api/ai/itinerary` — accepts `{ cityId, cityName, preferences, existingLocations }`

Responses always include `locations` array plus optional `metadata` with timing information from Ollama.
