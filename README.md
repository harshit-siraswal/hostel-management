# hostel-management

Frontend workspace for the hostel management platform.

## Repo Split
- Frontend repo: this folder
- Backend repo: `c:\Users\ASUS\Desktop\hostel management backend`

## Product Docs
- PRD: [docs/prd.md](docs/prd.md)
- TRD: [docs/trd.md](docs/trd.md)
- User flow: [docs/user-flow.md](docs/user-flow.md)
- Prompt pack: [docs/prompts.md](docs/prompts.md)

## Frontend Setup
- Install: `npm install`
- Run: `npm run dev`
- Build: `npm run build`

## Frontend Env
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` optional
- `VITE_API_BASE_URL` optional backend base URL

The frontend currently uses the transplanted Bunkhaus/TanStack Start workspace as the visual and interaction baseline. Firebase login is used when the env vars are present, and a demo fallback keeps the portal runnable without backend wiring.