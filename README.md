# Todo App

A full-stack Todo application built with Laravel and Vue.js, following clean architecture and security best practices.

## Tech Stack

### Backend
- Laravel 9.x
- PHP 8.1+
- MySQL
- Cookie-based Session Authentication

### Frontend
- Vue 3 (Composition API)
- Vuex 4
- Vue Router 4
- Axios

## Project Structure

```
todo-app/
├── backend/       # Laravel API
├── frontend/      # Vue.js SPA
├── README.md
└── .gitignore
```

## Features
- User authentication (Register, Login, Logout)
- Categories CRUD
- Tasks CRUD
- Ownership protection (each user manages only their own data)

## Security
- Password hashing via Laravel Hash facade
- Cookie-based Session (HttpOnly, SameSite=Lax) to prevent XSS
- Eloquent ORM to prevent SQL injection
- CSRF protection via Laravel Sanctum built-in cookie
- Eager Loading to prevent N+1 query problem

## Getting Started

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Git Workflow
- `main` branch contains only documentation files
- Feature development is done on `feature/` branches
- All commits must follow Conventional Commits format
