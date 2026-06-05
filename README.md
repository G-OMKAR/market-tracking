# 🌾 AgMarkNet — Agricultural Market Price & Arrival System

A full-stack clone of India's AgMarkNet portal built with **Spring Boot** (Java 17) backend and **React + TypeScript** frontend.

---

## 📁 Project Structure

```
agmarknet/
├── backend/                  # Spring Boot API (Java 17)
│   ├── src/main/java/com/agmarknet/
│   │   ├── AgMarkNetApplication.java   # Entry point
│   │   ├── model/                      # JPA entities
│   │   ├── repository/                 # Spring Data JPA repos
│   │   ├── service/                    # Business logic
│   │   ├── controller/                 # REST controllers
│   │   ├── dto/                        # Request/Response DTOs
│   │   ├── config/                     # Security, CORS, DataSeeder
│   │   └── exception/                  # Global error handling
│   ├── src/main/resources/
│   │   ├── application.properties      # Dev config (H2)
│   │   └── application-prod.properties # Prod config (PostgreSQL)
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                 # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Header, Footer, StatsBar
│   │   │   ├── filters/      # FilterPanel (cascading dropdowns)
│   │   │   ├── tables/       # PriceTable with pagination
│   │   │   └── charts/       # TrendChart (Recharts)
│   │   ├── pages/            # Dashboard page
│   │   ├── services/         # Axios API client + TypeScript types
│   │   └── index.css         # Tailwind + custom tokens
│   ├── Dockerfile
│   ├── nginx.conf            # SPA + API proxy config
│   └── package.json
│
├── docker-compose.yml        # Full-stack orchestration
└── README.md
```

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
cd agmarknet
docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console (dev): http://localhost:8080/h2-console

---

### Option 2: Manual Development Setup

#### Backend

**Prerequisites:** Java 17+, Maven 3.8+

```bash
cd backend
mvn spring-boot:run
```

The app starts on **port 8080** with H2 in-memory database.
Seed data is auto-loaded on startup (8 states, 20+ markets, 24 commodities, ~168 price records).

#### Frontend

**Prerequisites:** Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**
Vite proxies `/api` → `http://localhost:8080`

---

## 🗄️ Database Schema

```
states ──< districts ──< markets
                              │
commodity_groups ──< commodities ──< varieties
                              │
price_arrivals (links state + district + market + commodity + variety)
  ├── arrival_date
  ├── min_price, max_price, modal_price  (₹ per quintal)
  ├── arrival_quantity (tonnes)
  └── grade (FAQ / Grade-A / Super)
```

---

## 📡 REST API Reference

### Reference Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reference/states` | All states |
| GET | `/api/v1/reference/districts?stateId=` | Districts (filtered by state) |
| GET | `/api/v1/reference/markets?stateId=&districtId=` | Markets (cascading) |
| GET | `/api/v1/reference/commodity-groups` | All commodity groups |
| GET | `/api/v1/reference/commodities?groupId=` | Commodities |
| GET | `/api/v1/reference/varieties?commodityId=` | Varieties |

### Price & Arrival Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/prices` | Filtered + paginated price data |
| GET | `/api/v1/prices/trends` | 30-day price trend for a commodity |
| GET | `/api/v1/prices/stats` | Dashboard stats |

#### Price Filter Query Params:
`stateId`, `districtId`, `marketId`, `commodityGroupId`, `commodityId`, `varietyId`, `grade`, `fromDate`, `toDate`, `page`, `size`

---

## 🏭 Production Deployment

### Environment Variables

```env
DB_PASSWORD=your_secure_password
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://db:5432/agmarknet
ALLOWED_ORIGINS=https://your-domain.com
```

### Switch to PostgreSQL

Set `SPRING_PROFILES_ACTIVE=prod` to activate `application-prod.properties`.

Run Flyway/Liquibase migrations for schema management in production (add to `pom.xml` as needed).

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Data JPA, Spring Security |
| Database | H2 (dev), PostgreSQL 16 (prod) |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| HTTP Client | Axios |
| Routing | React Router 6 |
| Containerization | Docker, Docker Compose |
| Web Server | Nginx (frontend) |

---

## 📌 Features

- ✅ Cascading filters (State → District → Market → Commodity → Variety)
- ✅ Date range filter
- ✅ Server-side pagination
- ✅ Price trend line chart (30-day history)
- ✅ Arrival quantity bar chart
- ✅ Dashboard statistics (total records, states, markets, commodities)
- ✅ Grade badge display (FAQ / Grade-A / Super)
- ✅ Swagger/OpenAPI documentation
- ✅ CORS configured for frontend
- ✅ Docker Compose one-command deployment
- ✅ Seed data (8 states, 20+ APMCs, 24 commodities, 7 days × 24 commodity-market pairs)
