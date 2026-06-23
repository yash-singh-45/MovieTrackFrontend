# 🎬 CineTrack — Frontend

CineTrack is a full-stack movie & TV show discovery platform where users can browse trending titles, explore detailed cast/crew and streaming info, and rate/review what they watch.

**🔗 Live Demo:** [movie-track-frontend.vercel.app](https://movie-track-frontend.vercel.app/)
**⚙️ Backend Repo:** [MovieTrackBackend](https://github.com/yash-singh-45/MovieTrackBackend)

---

## ✨ Features

- **Trending feeds** — separate sections for Trending, Top Indian Movies/Shows, and Top Hollywood Movies/Shows
- **Detailed title pages** — trailers, full cast & crew, streaming availability, and a "Similar Titles" recommendation section
- **Filmography navigation** — click any actor or director to view their full filmography page
- **User reviews & ratings** — authenticated users can rate and review titles, and read others' reviews

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| UI/UX | Lucide React (icons), React Hot Toast (notifications) |
| Auth | JWT-based, integrated with the Spring Boot backend |

## 🚀 Running Locally

```bash
git clone https://github.com/yash-singh-45/MovieTrackFrontend.git
cd MovieTrackFrontend
npm install
```

Create a `.env` file in the root with your backend API URL:

```
VITE_API_BASE_URL=http://localhost:8080
```

Then start the dev server:

```bash
npm run dev
```

## 🔗 Related

This is the frontend half of CineTrack. The backend (Spring Boot, JWT auth, JPA, MySQL/PostgreSQL) lives at [MovieTrackBackend](https://github.com/yash-singh-45/MovieTrackBackend).
