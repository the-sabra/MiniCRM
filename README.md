# MiniCRM - Property Management System

A full-stack property management application built with **Next.js** and **Express.js**, containerized with Docker for easy deployment. The system provides complete CRUD operations for property listings along with statistical analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker](#running-with-docker)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
  - [Server Module](#server-module)
  - [Client Module](#client-module)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Development](#development)

## 🎯 Overview

MiniCRM is a property management system that allows users to:

- Create, read, update, and delete property listings
- Search and filter properties by title or location
- View paginated property listings with customizable columns
- Analyze property statistics with visual charts
- Track property status (available/sold)
- Manage multi-currency pricing (EGP, SAR)

## 🛠 Tech Stack

### Backend

- **Runtime**: Bun (alternative to Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Validation**: VineJS
- **Logging**: Winston + Morgan
- **Security**: Helmet, CORS, Rate Limiting

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Chakra UI v3
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios with retry logic

### DevOps

- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB 7

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- Bun 1.x (for server local development)
- Ports available: 3000 (API), 3001 (Frontend), 27017 (MongoDB)

### Running with Docker

This is the recommended way to run the application.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/the-sabra/MiniCRM.git
   cd MiniCRM
   ```

2. **Navigate to the docker directory:**

   ```bash
   cd docker
   ```

3. **Create environment files:**

   Create `.env.server`:

   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb://mongo:27017/minicrm
   ```

   Create `.env.client`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start all services:**

   ```bash
   docker-compose up -d
   ```

5. **View logs (optional):**

   ```bash
   docker-compose logs -f
   ```

6. **Access the application:**

   - **Frontend**: http://localhost:3001
   - **Backend API**: http://localhost:3000
   - **Health Check**: http://localhost:3000/health

7. **Stop the services:**

   ```bash
   docker-compose down
   ```

8. **Stop and remove volumes (clean slate):**
   ```bash
   docker-compose down -v
   ```

### Container Architecture

The Docker Compose setup orchestrates three services:

- **mongo**: MongoDB 7 database with initialization script

  - Creates `minicrm` database
  - Sets up indexes for better query performance
  - Persistent storage with Docker volumes

- **api**: Express.js backend (Bun runtime)

  - Built using multi-stage Dockerfile
  - Exposes port 3000
  - Health check enabled
  - Depends on MongoDB

- **frontend**: Next.js application
  - Production-optimized build
  - Standalone output mode
  - Exposes port 3001
  - Depends on API service

### Running Locally

#### Backend (Server)

1. Navigate to server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

3. Create `.env` file:

   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/minicrm
   ```

4. Start MongoDB (if not using Docker):

   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name minicrm-mongo mongo:7

   # Or use local MongoDB installation
   mongod
   ```

5. Run development server:
   ```bash
   bun run dev:bun
   # or
   npm run dev
   ```

#### Frontend (Client)

1. Navigate to client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Run development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3001 in your browser

## 📁 Project Structure

```
MiniCRM/
├── docker/                    # Docker configuration
│   ├── docker-compose.yml    # Multi-service orchestration
│   ├── mongo-init.js         # MongoDB initialization
│   ├── .env.server           # Server environment variables
│   └── .env.client           # Client environment variables
├── server/                    # Backend application
│   ├── server.ts             # Entry point
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   ├── models/               # Database schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Utility functions
│   └── share/                # Shared types/interfaces
└── client/                    # Frontend application
    ├── app/                  # Next.js App Router pages
    ├── components/           # React components
    ├── lib/                  # Utilities and configurations
    └── types/                # TypeScript type definitions
```

### Server Module

**Architecture Pattern**: Layered Architecture (MVC-like)

```
server/
├── server.ts                      # Application entry point & middleware setup
├── config/
│   ├── db.ts                     # MongoDB connection configuration
│   └── logger.ts                 # Winston logger setup
├── routes/
│   ├── index.ts                  # Route aggregator
│   ├── property.routes.ts        # Property CRUD endpoints
│   └── health.routes.ts          # Health check endpoint
├── controllers/
│   └── property.controller.ts    # Request handlers & validation
├── services/
│   └── property.service.ts       # Business logic & database operations
├── models/
│   └── property.model.ts         # Mongoose schema & model
├── middleware/
│   ├── error.handler.ts          # Global error handling middleware
│   └── validate.middleware.ts    # Request validation middleware
├── utils/
│   ├── ApiResponse.ts            # Standardized API response format
│   └── validators/               # VineJS validation schemas
│       ├── create-property.ts    # Property creation validation
│       └── filter.property.ts    # Query parameter validation
└── share/
    ├── pagination.interface.ts   # Pagination types
    ├── pagination-response.ts    # Pagination response builder
    └── validate-mongo-id.ts      # MongoDB ObjectId validation
```

**Key Features:**

- **Security Middleware**:

  - `helmet`: Sets security-related HTTP headers
  - `cors`: Configurable CORS with wildcard origin
  - `rateLimit`: 150 requests per 15 minutes per IP

- **Error Handling**:

  - Centralized error handler
  - Custom `AppError` class with status codes
  - Structured error logging with Winston

- **Validation**:

  - VineJS schema validation for requests
  - MongoDB ObjectId validation
  - Type-safe validation middleware

- **Logging**:
  - Winston for application logs
  - Morgan for HTTP request logs
  - Environment-based log levels

### Client Module

**Architecture Pattern**: Feature-based Components + Centralized State Management

```
client/
├── app/
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout with providers
│   ├── page.tsx                     # Landing page
│   └── properties/
│       ├── page.tsx                 # Property management page
│       └── statistics/
│           └── page.tsx             # Analytics dashboard
├── components/
│   ├── properties/
│   │   ├── PropertyTable.tsx        # Sortable data table
│   │   ├── PropertyForm.tsx         # Create/Edit form with validation
│   │   ├── TableControls.tsx        # Search & column configuration
│   │   ├── DeleteConfirmation.tsx   # Delete confirmation modal
│   │   ├── StatusDonutChart.tsx     # Status distribution chart
│   │   └── LocationAreaChart.tsx    # Location analytics chart
│   └── ui/                          # Shared Chakra UI components
│       ├── provider.tsx             # Chakra UI provider
│       ├── color-mode.tsx           # Dark mode toggle
│       ├── toaster.tsx              # Toast notifications
│       └── tooltip.tsx              # Tooltip component
├── lib/
│   ├── api.ts                       # Axios client with retry logic
│   ├── stores/
│   │   └── property.store.ts       # Zustand state management
│   ├── validations/
│   │   └── property.schema.ts      # Zod validation schemas
│   └── constants/
│       └── colors.ts                # Color palette constants
└── types/
    └── property.types.ts            # TypeScript interfaces
```

**Key Features:**

- **State Management**:

  - Zustand store for global state
  - Automatic property fetching
  - Optimistic updates with rollback

- **API Client**:

  - Axios with base configuration
  - Exponential backoff retry (3 attempts)
  - Automatic retry on 5xx errors
  - 3-minute timeout for large datasets

- **Form Handling**:

  - React Hook Form for form state
  - Zod for client-side validation
  - Real-time validation feedback
  - Type-safe form data

- **UI/UX Features**:
  - Responsive design (mobile-first)
  - Dark mode support
  - Column customization (show/hide/reorder)
  - LocalStorage persistence for preferences
  - Toast notifications for actions
  - Loading states and skeletons

## 🏗 Architecture

### Data Flow

```
┌─────────────┐
│   Client    │ (Next.js)
│   Component │
└──────┬──────┘
       │ 1. User Action
       ▼
┌─────────────┐
│   Zustand   │
│    Store    │
└──────┬──────┘
       │ 2. API Call
       ▼
┌─────────────┐
│   Axios     │
│   Client    │
└──────┬──────┘
       │ 3. HTTP Request
       ▼
┌─────────────┐
│   Express   │ (Backend)
│    Router   │
└──────┬──────┘
       │ 4. Route Handler
       ▼
┌─────────────┐
│ Controller  │
└──────┬──────┘
       │ 5. Business Logic
       ▼
┌─────────────┐
│   Service   │
└──────┬──────┘
       │ 6. Database Query
       ▼
┌─────────────┐
│  Mongoose   │
│   MongoDB   │
└──────┬──────┘
       │ 7. Data Return
       ▼
┌─────────────┐
│   Response  │
│   (JSON)    │
└──────┬──────┘
       │ 8. State Update
       ▼
┌─────────────┐
│   Component │
│   Re-render │
└─────────────┘
```

### Request/Response Flow

1. **User Action**: User interacts with UI component
2. **State Update**: Zustand action is triggered
3. **API Call**: `lib/api.ts` sends HTTP request
4. **Routing**: Express routes request to controller
5. **Validation**: Middleware validates request data
6. **Business Logic**: Service layer processes request
7. **Database**: Mongoose executes MongoDB query
8. **Response**: Standardized JSON response
9. **State Update**: Zustand updates global state
10. **UI Update**: React re-renders affected components

## 🗄 Data Model

### Property Schema

```typescript
{
  _id: ObjectId; // MongoDB unique identifier
  title: string; // Property title (required)
  amount: {
    price: number; // Price in cents (required)
    currency: string; // ISO currency code: "EGP" | "SAR"
  }
  location: string; // Property location (required)
  bedrooms: number; // Number of bedrooms (required)
  bathrooms: number; // Number of bathrooms (required)
  status: "available" | "sold"; // Property status (required)
  createdAt: Date; // Auto-generated timestamp
  updatedAt: Date; // Auto-generated timestamp
}
```

**Indexes** (for query performance):

- `title`: Text search
- `status`: Filtering
- `location`: Filtering
- `createdAt`: Sorting (descending)

**Validation Rules**:

- `title`: 3-200 characters
- `price`: Positive integer (stored in cents)
- `currency`: Must be "EGP" or "SAR"
- `location`: Non-empty string
- `bedrooms`: Positive integer
- `bathrooms`: Positive integer
- `status`: Must be "available" or "sold"

## 🔌 API Endpoints

Base URL: `http://localhost:3000`

### Properties

#### Create Property

```http
POST /properties
Content-Type: application/json

{
  "title": "Luxury Villa in Cairo",
  "amount": {
    "price": 50000000,  // in cents (500,000 EGP)
    "currency": "EGP"
  },
  "location": "New Cairo",
  "bedrooms": 4,
  "bathrooms": 3,
  "status": "available"
}

Response: 201 Created
{
  "status": "success",
  "statusCode": 201,
  "message": "Property created successfully",
  "data": { ... }
}
```

#### Get All Properties

```http
GET /properties?page=1&take=10&search=cairo

Response: 200 OK
{
  "status": "success",
  "statusCode": 200,
  "message": "Properties fetched successfully",
  "data": [...],
  "meta": {
    "totalItems": 50,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 5,
    "currentPage": 1
  }
}
```

#### Update Property

```http
PUT /properties/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "sold"
}

Response: 200 OK
{
  "status": "success",
  "statusCode": 200,
  "message": "Property updated successfully",
  "data": { ... }
}
```

#### Delete Property

```http
DELETE /properties/:id

Response: 200 OK
{
  "status": "success",
  "statusCode": 200,
  "message": "Property deleted successfully",
  "data": { ... }
}
```

#### Get Statistics

```http
GET /properties/statistics

Response: 200 OK
{
  "status": "success",
  "statusCode": 200,
  "message": "Property Statistics",
  "data": {
    "totalProperties": 50,
    "averagePrice": {
      "EGP": 25000000,  // in cents
      "SAR": 10000000   // in cents
    },
    "statusCount": {
      "available": 35,
      "sold": 15
    },
    "locationStats": [
      {
        "location": "New Cairo",
        "averageBedrooms": 3.5,
        "averageBathrooms": 2.8
      }
    ]
  }
}
```

#### Health Check

```http
GET /health

Response: 200 OK
{
  "status": "success",
  "message": "Server is running"
}
```

### Error Responses

All errors follow this format:

```json
{
  "status": "fail",
  "statusCode": 404,
  "message": "Property not found"
}
```

Common status codes:

- `400`: Bad Request (validation error)
- `404`: Not Found
- `422`: Unprocessable Entity
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

## ✨ Features

### Property Management

- ✅ Create properties with detailed information
- ✅ Update property details and status
- ✅ Delete properties with confirmation
- ✅ Search by title or location
- ✅ Pagination with customizable page size
- ✅ Multi-currency support (EGP, SAR)

### User Interface

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Customizable table columns (show/hide/reorder)
- ✅ Persistent user preferences (localStorage)
- ✅ Toast notifications for actions
- ✅ Loading states and error handling

### Analytics Dashboard

- ✅ Total property count
- ✅ Average price by currency
- ✅ Status distribution (donut chart)
- ✅ Location-based statistics (area chart)
- ✅ Average bedrooms/bathrooms per location

### Technical Features

- ✅ Type-safe with TypeScript
- ✅ Input validation (client & server)
- ✅ API retry logic with exponential backoff
- ✅ Rate limiting (150 req/15min)
- ✅ Security headers (Helmet)
- ✅ CORS configuration
- ✅ Structured logging
- ✅ Health check endpoint
- ✅ Docker containerization
- ✅ MongoDB indexes for performance

## 🛠 Development

### Project Scripts

**Server:**

```bash
npm run dev:bun      # Development with Bun (hot reload)
npm run dev          # Development with tsx (hot reload)
npm run build        # Compile TypeScript
npm run start        # Run compiled JS
npm run test         # Run tests with Vitest
```

**Client:**

```bash
npm run dev          # Development server (port 3001)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

**Server (`.env`):**

```env
NODE_ENV=development|production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/minicrm
JWT_SECRET=your_secret_key          # (if auth is added)
JWT_EXPIRATION=24h                  # (if auth is added)
BASE_URL=http://localhost:3000
```

**Client (`.env.local`):**

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Currency Handling

Prices are stored in **cents** (smallest currency unit) to avoid floating-point precision issues:

```typescript
// Client sends: $500.00
{
  "price": 50000,      // 500.00 * 100 = 50000 cents
  "currency": "EGP"
}

// Database stores: 50000 cents
// Client displays: EGP 500.00 (50000 / 100)
```

### Pagination

Default: 10 items per page
Options: 5, 10, 20, 50

Response meta includes:

- `totalItems`: Total records in database
- `itemCount`: Items in current response
- `itemsPerPage`: Requested page size
- `totalPages`: Total number of pages
- `currentPage`: Current page number

### Search Functionality

Case-insensitive regex search on:

- Property title
- Property location

Example: Searching "cairo" matches "Cairo", "New Cairo", "cairo city"

### Database Indexes

Optimized for common queries:

```javascript
db.properties.createIndex({ title: 1 }); // Search
db.properties.createIndex({ status: 1 }); // Filter by status
db.properties.createIndex({ location: 1 }); // Filter by location
db.properties.createIndex({ createdAt: -1 }); // Sort by newest
```

---

## 📝 License

This project is for educational purposes.

## 👥 Author

**Omar Sabra** - [GitHub](https://github.com/the-sabra)

---

**Built with ❤️ using Next.js, Express.js, and MongoDB**
