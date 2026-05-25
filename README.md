# Todo Categories App

Full-stack todo application with categories, undo notifications, and category limits.

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- React Hook Form
- Axios
- Sonner

### Backend
- NestJS
- Prisma
- SQLite

---

## Features

- Create todos with categories
- Filter todos by category
- Mark todos as completed
- Delete todos
- Undo delete/completion actions
- Category limit (max 5 tasks per category)
- Loading / error / empty states
- Optimistic UI updates
- Undo notifications with delayed deletion

---

## Project Structure

```txt
frontend/
backend/
```

---

## Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Backend runs on:

```txt
http://localhost:3001
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

---

## API Endpoints

```http
POST   /todos
GET    /todos
PATCH  /todos/:id
DELETE /todos/:id
GET    /categories
```

---

## Deployment

Frontend: [https://...](https://todo-categories-app-silk.vercel.app/)

Backend: [https://...](https://todo-categories-app.onrender.com)

---
