# B&B Store - Full Stack E-Commerce Platform

![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)
![.NET](https://img.shields.io/badge/Backend-.NET_9-512BD4?logo=dotnet)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Iyzico](https://img.shields.io/badge/Payment-Iyzico-111111)

B&B Store is a full stack B2C e-commerce application built with React, .NET 9, MongoDB, and Iyzico sandbox payments. The platform includes a customer-facing storefront, product catalog, cart and checkout flow, user profile area, reviews, content management, and an admin dashboard for managing products, orders, coupons, cargo companies, blog content, sliders, site settings, users, and messages.

The project focuses on a realistic e-commerce flow rather than a static demo: product stock is validated on the server, discounts are recalculated by the API, cargo fees are resolved from the database, checkout is protected by authentication, and sensitive credentials are kept outside the repository.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Application Modules](#application-modules)
- [Project Structure](#project-structure)
- [Security Highlights](#security-highlights)
- [Getting Started](#getting-started)
- [Initial Data and Admin Access](#initial-data-and-admin-access)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Validation](#validation)

---

## Features

### Storefront

- Responsive home page with dynamic slider and promotional notification bar.
- New arrivals section powered by product data.
- Product catalog with sorting and advanced filters.
- Product details page with image gallery, size/color selection, stock-aware options, favorites, cart actions, and product reviews.
- Blog, contact, privacy policy, and about pages managed from the admin side.

### Shopping Flow

- Cookie-based authentication backed by JWT.
- Cart management with quantity controls.
- Coupon code support.
- Address selection during checkout.
- Cargo company selection with database-backed cargo pricing.
- Iyzico checkout form integration for payment processing.
- Server-side validation for basket items, product prices, coupon discounts, stock, address ownership, and cargo fees.
- Order status tracking and profile-based order history.

### User Area

- Account information management.
- Password update flow.
- Address book management.
- Order history.
- User reviews.
- Favorites / wishlist support.

### Admin Dashboard

- Product, category, coupon, user, order, review, blog, slider, cargo, message, and site settings management.
- Role-based admin authorization.
- Order list with payment status and detail view.
- Rich text content management with HTML sanitization on the API side.

---

## Screenshots

### Home Page

The storefront home page includes a promotional notification bar, navigation menu, hero slider, and latest products section.

<p align="center">
  <img src="https://github.com/user-attachments/assets/c5757fe6-cff1-4e06-9eeb-176c05b6f712" alt="B&B Store home hero slider" width="100%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/1aa23617-d4ff-45d7-925a-7ba6889c3f01" alt="B&B Store new arrivals section" width="100%" />
</p>

### Product Catalog & Advanced Filtering

The catalog supports sorting and a side-panel filter experience for gender, price range, color, and other product attributes.

<p align="center">
  <img src="https://github.com/user-attachments/assets/80aeecf8-ecd3-4cb8-966f-1d6139443975" alt="Product catalog page" width="100%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/25a62e50-6969-4da7-8f1b-345170a9de3e" alt="Advanced product filtering panel" width="100%" />
</p>

### Product Details & Reviews

Product pages include gallery thumbnails, variant selection, stock-aware sizes, favorites, cart actions, rating summaries, and customer reviews.

<p align="center">
  <img src="https://github.com/user-attachments/assets/06466076-3418-404a-b184-23f1d142cc9d" alt="Product detail page" width="100%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/7cae6616-287b-4b76-99f6-c7017e7ff174" alt="Product reviews section" width="100%" />
</p>

### Shopping Experience

The shopping flow includes coupon usage, cargo selection, address selection, and checkout preparation before payment.

<p align="center">
  <img src="https://github.com/user-attachments/assets/851fbb03-97f2-4ff2-9964-791e6c186a0e" alt="Cart and checkout summary" width="100%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/d75ef15a-570b-4f4b-9af7-3bc401197ab1" alt="User profile page" width="100%" />
</p>

### Admin Dashboard

The admin panel provides operational screens for managing orders, products, categories, coupons, users, reviews, blog content, cargo options, site content, and messages.

<p align="center">
  <img src="https://github.com/user-attachments/assets/2d3c7c5b-0b24-4b09-b3a6-a1303a4bc55d" alt="Admin dashboard order management" width="100%" />
</p>

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Frontend | React 19, Vite | Single-page storefront and admin UI |
| Routing | React Router | Client-side routing |
| UI | Ant Design, CSS | Forms, tables, layout, and custom styling |
| Backend | ASP.NET Core / .NET 9 | REST API and application logic |
| Database | MongoDB | Product, user, order, review, and CMS data |
| Authentication | JWT + HTTP-only cookie | Authenticated user and admin access |
| Payment | Iyzico Sandbox | Checkout form and payment callback flow |
| Security | BCrypt, HtmlSanitizer | Password hashing and stored HTML sanitization |

---

## Architecture

The backend follows a pragmatic layered structure:

- `Controllers`: HTTP endpoints for authentication, products, orders, payments, content, and admin operations.
- `Dtos`: Request and response shapes used between the API and client.
- `Models`: MongoDB document models.
- `Repositories`: Data access layer built on the MongoDB driver.
- `Services`: Reusable business services such as JWT token generation, HTML sanitization, and order expiration handling.

The frontend is organized around pages, reusable components, and React Context providers for shared state such as authentication, cart, favorites, and site settings.

---

## Application Modules

### API Modules

| Module | Main Files | Responsibility |
| :--- | :--- | :--- |
| Authentication | `AuthController`, `LoginDto`, `RegisterDto`, `TokenService` | User registration, login, logout, profile update, password change, JWT generation, and cookie-based authentication |
| Users & Favorites | `UserController`, `UsersController`, `UserRepository`, `FavoriteItem` | Admin user list operations and authenticated wishlist/favorite management |
| Products | `ProductController`, `ProductRepository`, `Product`, `ProductDto`, `ProductFilterParams` | Product listing, filtering, creation, update, deletion, stock migration, price and variant data |
| Categories | `CategoryController`, `CategoryRepository`, `Category` | Category CRUD and category-based catalog organization |
| Cart & Checkout | `PaymentController`, `PaymentRequestDto`, `OrderRepository`, `Order` | Checkout creation, Iyzico callback handling, order creation, stock decrease, coupon validation, cargo fee validation |
| Orders | `OrdersController`, `OrderRepository`, `OrderExpirationService` | Admin order management, customer order history, and automatic pending order expiration |
| Coupons | `CouponController`, `CouponRepository`, `Coupon` | Coupon CRUD and discount lookup by code |
| Cargo Companies | `CargoCompanyController`, `CargoCompanyRepository`, `CargoCompany` | Cargo company CRUD and checkout cargo price source |
| Reviews | `ReviewsController`, `ReviewRepository`, `Review`, `ReviewDto` | Product/blog reviews, user review history, admin review moderation |
| CMS & Content | `BlogsController`, `SiteSettingsController`, `SlidersController` | Blog posts, site logo/notification/about/privacy/footer content, home page sliders |
| Contact Messages | `ContactsController`, `ContactRepository`, `Contact` | Contact form submission and admin message management |
| Security Helpers | `HtmlSanitizationService`, `IHtmlSanitizationService` | Sanitizes stored HTML content before it is saved |

### Client Modules

| Module | Main Files | Responsibility |
| :--- | :--- | :--- |
| App Routing | `App.jsx`, `main.jsx` | Defines public, profile, payment, and admin routes; mounts global providers |
| Layouts | `UserLayout`, `AdminLayout`, `AdminLayoutWrapper`, `MainLayout` | Shared page frames for storefront and admin sections |
| Global State | `AuthContextProvider`, `CartProvider`, `FavoritesContext`, `SiteContext` | Authentication state, cart state, wishlist state, and site settings |
| Storefront Pages | `HomePage`, `ShopPage`, `CategoriesPage`, `ProductsDetailsPage`, `BlogPage`, `ContactPage` | Customer-facing shopping and content pages |
| Product UI | `Products`, `ProductItem`, `FilterSidebar`, `SortSelect`, `ProductDetail`, `Gallery`, `Info`, `Tabs` | Catalog grid, filtering, product details, variant selection, and reviews |
| Cart & Checkout UI | `Cart`, `CartTable`, `CartItem`, `CartCoupon`, `CartTotals`, `PaymentPage` | Cart display, coupon application, cargo/address selection, and payment initialization |
| Profile UI | `ProfileLayout`, `UserProfileInfo`, `UserPasswordChange`, `UserAddressManager`, `UserOrders`, `UserReviews` | Authenticated customer account pages |
| Admin UI | `pages/Admin/**` | Product, category, coupon, order, cargo, review, blog, slider, site settings, user, and message management |
| Shared Components | `Header`, `Footer`, `Search`, `AddressModal`, `Review`, `RatingBadge`, `FooterPromotion` | Reusable UI blocks used across the customer experience |

---

## Project Structure

```text
Full-Stack-E-Commerce-Project/
|-- API/                                  # ASP.NET Core Web API backend
|   |-- Controllers/                      # REST endpoints for auth, catalog, orders, payments, admin and CMS flows
|   |-- Dtos/                             # Request/response contracts shared between controllers and the client
|   |-- Models/                           # MongoDB document models and configuration option models
|   |-- Repositories/                     # MongoDB data access layer
|   |-- Services/                         # JWT, HTML sanitization and background order expiration services
|   |-- Program.cs                        # Startup, dependency injection, CORS, auth and middleware configuration
|   |-- appsettings.json                  # Non-secret default configuration
|   `-- API.csproj                        # .NET project file and NuGet dependencies
|
|-- Client/                               # React + Vite frontend
|   |-- public/                           # Static assets such as logo and product/category images
|   |-- src/
|   |   |-- components/                   # Reusable UI blocks for cart, products, reviews, layout and modals
|   |   |-- context/                      # Auth, cart, favorites and site settings providers
|   |   |-- layouts/                      # Storefront and admin layout wrappers
|   |   |-- pages/                        # Route-level pages for storefront, profile, payment and admin flows
|   |   |-- App.jsx                       # Client-side route definitions
|   |   `-- main.jsx                      # React entry point and global provider composition
|   |-- package.json                      # Frontend dependencies and npm scripts
|   |-- vite.config.js                    # Vite build configuration
|   `-- eslint.config.js                  # ESLint configuration
|
|-- Full-Stack-E-Commerce-Project.sln     # Root solution file
|-- .gitignore                            # Ignored generated files and local artifacts
`-- README.md                             # Project documentation
```

Generated folders such as `API/bin`, `API/obj`, `Client/node_modules`, and `Client/dist` are intentionally excluded from version control.

---

## Security Highlights

- Sensitive values are not stored in `appsettings.json`.
- MongoDB, JWT, and Iyzico credentials should be provided through .NET user-secrets, environment variables, or a secure secret store.
- Password hashes are excluded from API responses.
- Admin-only operations are protected with role-based authorization.
- Payment checkout validates price, stock, coupon, address, and cargo information on the server.
- Cargo fees are calculated from the selected cargo company in the database, not trusted from the client payload.
- Stored HTML content is sanitized before saving to reduce XSS risk.
- Generated files such as `bin`, `obj`, `dist`, and `node_modules` are ignored.

---

## Getting Started

### Prerequisites

- [.NET SDK 9](https://dotnet.microsoft.com/)
- [Node.js](https://nodejs.org/) `20.19+` or `22.12+` for Vite 7
- MongoDB Atlas or a local MongoDB instance
- Iyzico sandbox account for payment testing

### 1. Clone the Repository

```bash
git clone https://github.com/BerkeBuyukkopru/Full-Stack-E-Commerce-Project.git
cd Full-Stack-E-Commerce-Project
```

### 2. Configure the API Secrets

The repository intentionally keeps secret values empty. Configure your local secrets with your own values:

```bash
dotnet user-secrets set "DatabaseSettings:ConnectionString" "YOUR_MONGODB_CONNECTION_STRING" --project API/API.csproj
dotnet user-secrets set "IyzicoSettings:ApiKey" "YOUR_IYZICO_SANDBOX_API_KEY" --project API/API.csproj
dotnet user-secrets set "IyzicoSettings:SecretKey" "YOUR_IYZICO_SANDBOX_SECRET_KEY" --project API/API.csproj
dotnet user-secrets set "JwtSettings:Secret" "YOUR_LONG_RANDOM_JWT_SECRET" --project API/API.csproj
```

Optional local values:

```bash
dotnet user-secrets set "IyzicoSettings:CallbackUrl" "http://localhost:5020/api/payment/callback" --project API/API.csproj
dotnet user-secrets set "ClientSettings:BaseUrl" "http://localhost:5173" --project API/API.csproj
```

Optional first admin seed values:

```bash
dotnet user-secrets set "AdminSeed:Email" "admin@example.com" --project API/API.csproj
dotnet user-secrets set "AdminSeed:Password" "StrongPassword123!" --project API/API.csproj
dotnet user-secrets set "AdminSeed:Name" "Admin" --project API/API.csproj
dotnet user-secrets set "AdminSeed:Surname" "User" --project API/API.csproj
```

### 3. Configure the Client

Create a `Client/.env` file:

```env
VITE_API_BASE_URL=http://localhost:5020/api
```

### 4. Install Frontend Dependencies

```bash
cd Client
npm install
```

### 5. Run the Backend

From the repository root:

```bash
dotnet run --project API/API.csproj
```

The API runs on:

```text
http://localhost:5020
```

### 6. Run the Frontend

In another terminal:

```bash
cd Client
npm run dev
```

The client runs on:

```text
http://localhost:5173
```

---

## Initial Data and Admin Access

The repository does not include production credentials or a pre-seeded MongoDB database. When you run the project with a fresh database, MongoDB collections are created as the application writes data.

To use the admin dashboard locally:

1. Configure `AdminSeed:Email` and `AdminSeed:Password` with .NET user-secrets.
2. Start the API.
3. If no admin user exists, the API creates the first admin account automatically.
4. Start the client, log in with the seeded admin account, and open `/admin`.

The admin seed only runs when there is no existing admin user. If an account already exists with the configured admin email, that user is promoted to `admin` and its password is refreshed from `AdminSeed:Password`. If an admin already exists, the seed process is skipped.

After admin access is ready, catalog data can be created from the admin panel: categories, products, coupons, cargo companies, sliders, site settings, blog posts, and other content.

---

## Configuration

`API/appsettings.json` contains only non-secret defaults:

```json
{
  "DatabaseSettings": {
    "ConnectionString": "",
    "DatabaseName": "e-commerce"
  },
  "IyzicoSettings": {
    "ApiKey": "",
    "SecretKey": "",
    "BaseUrl": "https://sandbox-api.iyzipay.com",
    "CallbackUrl": "http://localhost:5020/api/payment/callback"
  },
  "ClientSettings": {
    "BaseUrl": "http://localhost:5173"
  },
  "AdminSeed": {
    "Email": "",
    "Password": "",
    "Name": "Admin",
    "Surname": "User"
  }
}
```

Use your own MongoDB database and Iyzico sandbox credentials when running the project locally.

---

## Available Scripts

### Frontend

```bash
cd Client
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
dotnet build API/API.csproj
dotnet run --project API/API.csproj
```

---

## Validation

The project was validated with:

```bash
dotnet build API/API.csproj
cd Client
npm run lint -- --quiet
npm run build
npm audit --audit-level=moderate
```

Current notes:

- The frontend production build may warn about large chunks. This does not block the build, but route-level code splitting can be added later for better performance.
- `npm audit --audit-level=moderate` passes for moderate and higher severity issues. A low severity advisory may remain through the rich text editor dependency chain.

---

## License

This project is licensed under the [MIT License](LICENSE).
