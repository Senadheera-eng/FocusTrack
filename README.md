# FocusTrack

A full-stack **Personal Task & Time Tracker** application built with React and NestJS. Users can create and manage tasks, track time with a built-in timer, view productivity analytics, and customize their profile and appearance settings.

## Technologies Used

| Layer     | Technology                         | Version |
|-----------|------------------------------------|---------|
| Frontend  | React                              | 19.2    |
| Frontend  | TypeScript                         | ~5.9    |
| Frontend  | Vite                               | 7.x     |
| Frontend  | Material UI (MUI)                  | 7.x     |
| Frontend  | Tailwind CSS                       | 4.x     |
| Frontend  | Recharts                           | 3.x     |
| Frontend  | React Router                       | 7.x     |
| Frontend  | Axios                              | 1.x     |
| Backend   | NestJS                             | 11.x    |
| Backend   | TypeORM                            | 0.3     |
| Backend   | PostgreSQL                         | 16      |
| Backend   | Passport + JWT                     | -       |
| Backend   | class-validator / class-transformer| -       |
| Database  | PostgreSQL (Docker)                | 16      |
| Runtime   | Node.js                            | >= 18   |

## Features

### Core Features
- **User Authentication** - Register and login with email/password, JWT-based session management
- **Task Management** - Full CRUD operations with title, description, status, priority, and due dates
- **Time Tracking** - Start/stop timer per task, view total time spent, active timer indicators
- **Dashboard** - Overview of tasks with stats cards, sorting, filtering, and search

### Bonus Features
- **Filter & Sort** - Filter tasks by status/priority, sort by date, due date, priority, or title
- **CSV Export** - Export all tasks to a CSV file
- **Data Visualization** - Charts for task status distribution, priority breakdown, and weekly activity (Recharts)
- **Search** - Real-time search across task titles and descriptions
- **Priority Levels** - Low, Medium, and High priority with color-coded indicators
- **Dark Mode** - Toggle between light and dark themes with persistence
- **Profile Management** - Upload profile picture and change username

## Project Structure

```
FocusTrack/
├── backend/                 # NestJS REST API
│   ├── src/
│   │   ├── auth/            # Authentication (register, login, JWT, profile)
│   │   ├── tasks/           # Task CRUD operations
│   │   ├── time-entries/    # Time tracking (start/stop timer, stats)
│   │   ├── users/           # User entity and service
│   │   ├── app.module.ts    # Root module (TypeORM, config)
│   │   └── main.ts          # App bootstrap (CORS, validation, body parser)
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # Reusable components (Sidebar, TaskCard, StatsCard, AuthForm)
│   │   ├── context/         # React contexts (AuthContext, ThemeContext)
│   │   ├── pages/           # Page components (Dashboard, MyTasks, Analytics, Settings)
│   │   ├── App.tsx          # Route definitions
│   │   └── main.tsx         # App entry point
│   └── package.json
├── package.json             # Root workspace config
└── README.md
```

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)

## Database Setup

The project uses PostgreSQL running inside a Docker container.

### Option 1: Using Docker Compose (Recommended)

Create a `docker-compose.yml` file in the project root:

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:16
    container_name: focustrack-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: focustrack
    ports:
      - "5433:5432"
    volumes:
      - focustrack_pgdata:/var/lib/postgresql/data

volumes:
  focustrack_pgdata:
```

Then start the database:

```bash
docker-compose up -d
```

### Option 2: Using Docker CLI

```bash
docker run -d \
  --name focustrack-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=focustrack \
  -p 5433:5432 \
  postgres:16
```

> **Note:** The database is mapped to port **5433** on the host to avoid conflicts with any local PostgreSQL installation on the default port 5432.

### Verify the Database

You can verify the container is running:

```bash
docker ps
```

You should see `focustrack-postgres` running with port `5433->5432/tcp`.

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=4000

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres123
DATABASE_NAME=focustrack

# Auto-creates tables from entities (set to false in production)
DATABASE_SYNCHRONIZE=true

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-to-something-secure
JWT_EXPIRES_IN=1d
```

> **Important:** Change `JWT_SECRET` to a strong, random string in production.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Senadheera-eng/FocusTrack.git
cd FocusTrack
```

### 2. Start the PostgreSQL database

Make sure Docker Desktop is running, then:

```bash
# Using docker-compose (if you created the file above)
docker-compose up -d

# OR using Docker CLI
docker run -d --name focustrack-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=focustrack -p 5433:5432 postgres:16
```

### 3. Set up environment variables

Create the `backend/.env` file as described in the [Environment Variables](#environment-variables) section.

### 4. Install dependencies

From the project root:

```bash
npm install
```

This installs dependencies for both the backend and frontend (npm workspaces).

### 5. Start the backend

```bash
npm run dev:backend
```

The NestJS server will start on **http://localhost:4000**. On first run, TypeORM will automatically create the database tables.

### 6. Start the frontend

Open a new terminal and run:

```bash
npm run dev:frontend
```

The React app will start on **http://localhost:5173**.

### 7. Open the app

Navigate to **http://localhost:5173** in your browser. Register a new account to get started.

## API Endpoints Documentation

Base URL: `http://localhost:4000`

All endpoints except registration and login require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### Authentication

| Method | Endpoint          | Description              | Auth Required |
|--------|-------------------|--------------------------|---------------|
| POST   | `/auth/register`  | Register a new user      | No            |
| POST   | `/auth/login`     | Login and receive JWT    | No            |
| GET    | `/auth/me`        | Get current user profile | Yes           |
| PATCH  | `/auth/profile`   | Update profile           | Yes           |

**POST /auth/register**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
- Password must be at least 6 characters.

**POST /auth/login**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
Returns: `{ "access_token": "jwt-token-here" }`

**GET /auth/me**

Returns: `{ "userId": "uuid", "email": "user@example.com", "username": null, "profilePicture": null }`

**PATCH /auth/profile**
```json
{
  "username": "New Display Name",
  "profilePicture": "data:image/png;base64,..."
}
```
Both fields are optional.

---

### Tasks

All task endpoints require authentication.

| Method | Endpoint      | Description             |
|--------|---------------|-------------------------|
| POST   | `/tasks`      | Create a new task       |
| GET    | `/tasks`      | Get all user's tasks    |
| GET    | `/tasks/:id`  | Get a single task       |
| PATCH  | `/tasks/:id`  | Update a task           |
| DELETE | `/tasks/:id`  | Delete a task           |

**POST /tasks** - Create Task
```json
{
  "title": "Complete project report",
  "description": "Write the final report for Q4",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-02-15T00:00:00.000Z"
}
```
- `title` is required (max 200 characters).
- `description` is optional (max 1000 characters).
- `status` is optional, defaults to `"todo"`. Values: `"todo"`, `"in_progress"`, `"done"`.
- `priority` is optional, defaults to `"medium"`. Values: `"low"`, `"medium"`, `"high"`.
- `dueDate` is optional, must be a valid ISO 8601 date string.

**PATCH /tasks/:id** - Update Task

Same fields as create, all optional.

---

### Time Entries

All time entry endpoints require authentication.

| Method | Endpoint                          | Description                         |
|--------|-----------------------------------|-------------------------------------|
| POST   | `/time-entries/task/:taskId/start`| Start a timer for a task            |
| POST   | `/time-entries/task/:taskId/stop` | Stop the active timer for a task    |
| GET    | `/time-entries/task/:taskId`      | Get all time entries for a task     |
| GET    | `/time-entries/task/:taskId/active`| Get active timer for a task        |
| GET    | `/time-entries/task/:taskId/total`| Get total time spent on a task      |
| GET    | `/time-entries/productivity-stats`| Get user's productivity statistics  |
| GET    | `/time-entries/active`            | Get all active timers for the user  |

**GET /time-entries/task/:taskId/total** - Response
```json
{
  "taskId": "uuid",
  "totalSeconds": 3600,
  "formatted": "01:00:00"
}
```

---

## Scripts Reference

From the project root:

| Command                | Description                              |
|------------------------|------------------------------------------|
| `npm install`          | Install all dependencies (both packages) |
| `npm run dev:backend`  | Start backend in development mode        |
| `npm run dev:frontend` | Start frontend in development mode       |
| `npm run build:backend`| Build backend for production             |

## License

ISC
