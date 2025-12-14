## Prerequisites

* Docker Desktop installed and running

* Node.js 18+ installed

* Create env files:

  * Frontend: `bellavista/.env` with `VITE_API_BASE_URL=http://localhost:8000/api` and EmailJS keys

  * Backend: `backend/.env` from `backend/.env.example` (keep defaults for local)

## Start Backend (API + Postgres)

1. Open a terminal in `backend/`
2. Run: `docker-compose up --build -d`
3. Verify API is up:

   * `curl http://localhost:8000/api/scheduled-tours`

   * `curl http://localhost:8000/api/care-enquiries`

   * `curl http://localhost:8000/api/news`
4. Max upload size is enforced by `MAX_CONTENT_LENGTH_MB` (default 20 MB)

## Start Frontend

1. Open a terminal in `bellavista/`
2. Ensure `.env` contains `VITE_API_BASE_URL=http://localhost:8000/api` and your EmailJS vars
3. Run: `npm run dev`
4. Open the app at the printed URL (currently `http://localhost:5174/`)

## Test: Schedule Tour (UI + API)

* Navigate to `http://localhost:5174/schedule-tour`

* Submit a tour request (name, email, phone, date, time, location, message)

* Expected:

  * Email sent if EmailJS envs are set

  * Saved locally (`localStorage['scheduled_tours']`)

  * Backend received: `curl http://localhost:8000/api/scheduled-tours` shows your entry

* Admin Console: `http://localhost:5174/admin` → “Scheduled Tours” shows the local saved request

## Test: Care Enquiry (UI + API)

* Navigate to `http://localhost:5174/enquiry`

* Submit an enquiry (name, email, phone, type, location, message)

* Expected:

  * Email sent if EmailJS configured

  * Saved locally (`localStorage['care_enquiries']`)

  * Backend received: `curl http://localhost:8000/api/care-enquiries`

* Admin Console: “Care Enquiries” shows the local saved enquiry

## Test: News (UI)

* Admin Console → “Add News”

* Fill: Title, Date, Category, Location, Main Image (URL or upload), Summary (≤ 180 chars), Body

* Add several Gallery images (URLs or uploads) and optional Video URL (YouTube or MP4 link)

* Click “Save News”

* Expected:

  * Item appears in `http://localhost:5174/news` with capped summary

  * Read More page shows featured image, auto-scrolling gallery, and video section

## Test: News (API Upload)

* Optional: validate backend with file uploads via API

* Example (PowerShell-friendly `curl` alias works):

  * `curl -F "title=Demo" -F "date=Dec 15, 2025" -F "category=events" -F "location=Bellavista Barry" -F "excerpt=Short demo news" -F "fullDescription=Longer body" -F "image=@path/to/main.jpg" -F "gallery1=@path/to/gallery1.jpg" -F "gallery2=@path/to/gallery2.jpg" -F "videoUrl=https://www.youtube.com/watch?v=dQw4w9WgXcQ" http://localhost:8000/api/news`

  * Verify: `curl http://localhost:8000/api/news`

* Note: the frontend currently reads local storage + seeded items; API uploads will be visible via API responses, and can be wired into the UI next if desired

## Verification Checklist

* Frontend pages render without console errors

* Admin console shows new local items for Tours/Enquiries/News

* API returns created Tours, Enquiries, and News

* Read More pages show gallery carousel and video block when provided

* EmailJS sends emails (if envs are set)

## Troubleshooting

* Port conflicts: if `5173` is in use, the dev server picks `5174`; open that URL

* Env not applied: stop dev server and re-run after editing `.env`

* API not reachable: `docker ps` shows `api` and `db`; check logs with `docker-compose logs -f api`

* Large uploads: files over `MAX_CONTENT_LENGTH_MB` (default 20 MB) are rejected; reduce size or raise the env value

## Next (Optional)

* Wire the admin “Add News” to POST to `/api/news` (multipart) so uploads go straight to

