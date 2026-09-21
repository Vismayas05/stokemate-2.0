# StockMate 2.0

> A modern, full-stack inventory management system designed to help businesses manage products, purchases, sales, stock levels, and inventory insights from one place.

## Overview

**StockMate 2.0** is a full-stack inventory management application built with a React frontend and a Spring Boot backend. It is designed with a clean, responsive interface and a focus on practical inventory workflows.

The project aims to simplify:

- Product management
- Purchase and sales tracking
- Automatic stock updates
- Low-stock and expiry alerts
- Inventory reports
- User authentication and account management

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Lucide Icons
- Framer Motion

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- Maven

### Database

- MySQL

## Project Structure

```text
StockMate-Project/
├── frontend/       # React + Vite frontend
├── backend/        # Spring Boot REST API
└── README.md       # Project documentation
```

## Features

- User signup and login
- Protected application pages
- Product creation, editing, and deletion
- Product search and filtering
- Purchase management
- Sales management
- Automatic inventory stock updates
- Low-stock notifications
- Expiry-date alerts
- Inventory reports
- Profile and settings management
- Light, dark, and system theme support
- Responsive user interface

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Vismayas05/stokemate-2.0.git
cd stokemate-2.0
```

### 2. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at the local URL shown in the terminal.

### 3. Run the backend

Open another terminal:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### 4. Configure MySQL

1. Create a MySQL database.
2. Open:

```text
backend/src/main/resources/application.properties
```

3. Update the database URL, username, and password according to your local MySQL setup.

> Do not commit passwords, API keys, or other sensitive credentials to GitHub.

## Environment Configuration

Before running the application, verify that the required backend and frontend configuration values are set correctly.

For production deployment, use environment variables for sensitive values such as:

- Database credentials
- JWT secrets
- API keys
- Server configuration

## Future Improvements

- Cloud deployment
- Advanced analytics dashboard
- Exportable inventory reports
- Role-based access control
- Automated backup and restore
- Improved notification system
- Mobile-friendly enhancements

## Author

**Vismaya S**

GitHub: [@Vismayas05](https://github.com/Vismayas05)

## License

This project is currently intended for educational and development purposes.
