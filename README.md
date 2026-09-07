# MERN E-Learning Marketplace — Starter Scaffold

A multi-instructor course marketplace (Udemy-style), scaffolded with the MERN stack.

## Structure

```
mern-elearning/
  server/   Express + MongoDB API (auth, courses, enrollments, payments)
  client/   React + Vite + Tailwind frontend
```

## Features included

- JWT auth (access + refresh tokens) with role-based access (student / instructor / admin), rate-limited login/register, and zod input validation
- Course model with nested sections & lectures, instructor CRUD, publish/unpublish
- Course catalog with search/filter, course detail page
- **Video uploads**: instructors upload video directly to Cloudinary from the browser via a signed-upload flow (`/api/uploads/signature`) — bytes never touch the server
- Stripe Checkout for paid courses; free courses enroll instantly. The Stripe webhook creates the Enrollment record automatically once payment succeeds
- Enrollment + per-lecture progress tracking
- **Quizzes**: instructors create per-section multiple-choice quizzes; students take them and get auto-graded instantly
- **Reviews & ratings**: enrolled students rate/review courses; the course's average rating recalculates automatically
- **Admin panel**: platform stats (users, revenue, enrollments), ban/unban users, publish/unpublish any course
- Student dashboard (progress bars) and instructor dashboard (create courses → course editor: add sections, upload lecture videos)

## Getting started

### 1. Server

```bash
cd server
cp .env.example .env   # fill in MongoDB URI, JWT secrets, Cloudinary + Stripe keys
npm install
npm run dev             # runs on http://localhost:5000
```

You'll need:
- A MongoDB instance (local or MongoDB Atlas free tier)
- A Stripe account (test mode keys are fine) — for local webhook testing, run
  `stripe listen --forward-to localhost:5000/api/payments/webhook` and put the printed
  webhook secret in `STRIPE_WEBHOOK_SECRET`
- A free Cloudinary account (cloud name, API key, API secret) for video/thumbnail uploads

### 2. Client

```bash
cd client
npm install
npm run dev              # runs on http://localhost:5173, proxies /api to the server
```

### 3. Try it out

1. Register as an instructor at `/register`
2. Go to `/instructor`, create a course, click into it to add sections and upload lecture videos
3. Publish the course from the course editor
4. Register a second account as a student, browse `/courses`, enroll (free courses enroll instantly; paid ones go through Stripe Checkout)
5. Take any section quizzes and leave a review from the course page
6. To try the admin panel, manually set a user's `role` to `"admin"` in MongoDB, then visit `/admin`

## Next steps (not yet built)

- Stripe Connect payouts so instructors get paid automatically (currently all payments go to your platform Stripe account)
- Course thumbnail upload UI (the upload helper and signed endpoint already support images — just needs a form field)
- Pagination/infinite scroll on the course catalog for large numbers of courses
- Email notifications (welcome, enrollment receipt, course published)

## Notes

- Passwords are hashed with bcrypt; never stored in plain text.
- Access tokens are short-lived (15 min) and stored in memory (Zustand); refresh tokens are httpOnly cookies.
- The Stripe webhook route is mounted with `express.raw()` before the JSON body parser — required for signature verification.
- Auth routes are rate-limited (20 requests/15 min per IP) to slow down brute-force attempts.
- All course/lecture/quiz-creation request bodies are validated with zod before hitting the database.
