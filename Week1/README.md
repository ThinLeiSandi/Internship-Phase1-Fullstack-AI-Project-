# 🚀 Express + TypeScript + Prisma + Docker REST API

> A production-ready, containerized RESTful API built with Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, JWT Authentication, Zod Validation, and Docker Compose.

---

## 🛠️ Tech Stack

- **Runtime & Language**: Node.js & TypeScript
- **Framework**: Express.js (v5)
- **Database**: PostgreSQL
- **ORM**: Prisma ORM (v6)
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs`
- **Authorization**: Role-Based Access Control (RBAC - User/Admin)
- **Validation**: Zod
- **Logging**: Morgan
- **Containerization**: Docker & Docker Compose

---

## 📐 Database Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o{ tasks : "has many"
    users {
        int id PK
        string name
        string email UK
        string password
        string role
        datetime created_at
    }
    tasks {
        int id PK
        string title
        string description
        boolean completed
        int user_id FK
        datetime created_at
    }
```

---

## 📚 API Endpoints Specification

### 🔑 Authentication Routes
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register a new user (with password hashing) |
| `POST` | `/auth/login` | Public | Authenticate user & return signed JWT Bearer Token |

### 👤 User Routes
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | Authenticated | Retrieve list of all users |
| `GET` | `/users/:id` | Authenticated | Retrieve single user details by ID |
| `PUT` | `/users/:id` | Admin Only | Update user role/details |
| `DELETE` | `/users/:id` | Admin Only | Remove user by ID |

### 📋 Task Routes (Relational Data)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/tasks` | Authenticated | Create a task linked to the authenticated user |
| `GET` | `/tasks` | Authenticated | Fetch all tasks belonging to the logged-in user |
| `PUT` | `/tasks/:id` | Authenticated | Toggle completed status or update task details |

---

## 🚀 Quick Start Guide

### Option A: Running with Docker Compose (Recommended)

1. **Clone the repository & start environment**:
   ```bash
   docker compose up -d --build
   ```

2. The API will automatically perform Prisma database migrations and start on:
   ```text
   http://localhost:3000
   ```

3. **Stop environment**:
   ```bash
   docker compose down
   ```

---

### Option B: Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure `.env`**:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp?schema=public"
   JWT_SECRET="super_secret_key"
   ```

3. **Generate Prisma Client & Sync DB**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Compile & Start**:
   ```bash
   npx tsc
   node dist/server.js
   ```

---

## 🧪 Testing the Deliverable (PowerShell)

### 1. Register a User
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"John Doe","email":"john@example.com","password":"securepassword","role":"admin"}'
```

### 2. Login & Obtain JWT Token
```powershell
$res = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"john@example.com","password":"securepassword"}'
$token = $res.token
```

### 3. Create a Relational Task
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token"} -Body '{"title":"Deliver Internship API","description":"Full stack Express + Prisma + Docker"}'
```

### 4. Fetch My Relational Tasks
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method GET -Headers @{"Authorization"="Bearer $token"}
```
