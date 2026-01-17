# B&B Store - Full Stack E-Commerce Platform

![React](https://img.shields.io/badge/Frontend-React_v19-61DAFB?logo=react)
![.NET](https://img.shields.io/badge/Backend-.NET_9.0-512BD4?logo=dotnet)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)

**B&B Store** is a scalable, end-to-end B2C e-commerce platform built with modern web technologies. The project features a secure payment infrastructure (Iyzico), a dynamic content management system (CMS), and advanced inventory tracking capabilities designed with **N-Layered Architecture** principles.

---

## Key Features

### Front Office (User Interface)
* **Dynamic Storefront:** Responsive slider and "New Arrivals" sections.
* **Advanced Filtering:** Real-time filtering by category, price range, color/size attributes, and gender.
* **Instant Search:** Modal-based reactive search for products and categories.
* **Cart & Checkout:** Dynamic stock validation, coupon code system, and secure **Iyzico** payment gateway integration.
* **Authentication:** JWT-based secure login/register flow and favorites (wishlist) management.
* **User Profile:** Order history tracking, address book management, and review system.

### Back Office (Admin Dashboard)
* **Dashboard & Analytics:** Overview of sales and active orders.
* **Product Management:** Granular stock tracking (SKU-based), rich text editor for descriptions, and multi-image support.
* **CMS & Blog:** Integrated editor for blog posts, menu configuration, and slider management.
* **CRM & Users:** Customer list view, role-based access control (RBAC), and customer support message handling.

---

## Tech Stack

The project is built on a performance-oriented and sustainable technology stack.

| Area | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Component-based architecture, Hooks, Context API |
| **Backend** | .NET Core 9.0 | RESTful API, N-Tier Architecture |
| **Database** | MongoDB | NoSQL, Document-Oriented Storage |
| **Payment** | Iyzico | 3D Secure Payment Gateway Integration |
| **Styling** | CSS Modules / AntDesign | Responsive design and UI components |

---

## Architecture

The backend is built as a **Web API** using a folder-based layered architecture. It implements the **Repository Pattern** to decouple the data access logic from the application logic, ensuring clean and maintainable code.

The project structure consists of the following layers:

* **Models:** Represents the database entities (MongoDB Documents) such as `Product`, `User`, and `Order`.
* **Dtos (Data Transfer Objects):** Defines the data structures used for data transport between the client and server, ensuring that internal database entities are not exposed directly.
* **Repositories:** The Data Access Layer. Handles direct interactions with the MongoDB database (CRUD operations) using the MongoDB Driver.
* **Services:** Contains pure business logic and helper classes (e.g., `TokenService` for JWT generation, `OrderExpirationService` for background tasks).
* **Controllers:** The API Layer. Handles incoming HTTP requests, validates inputs via DTOs, orchestrates the Repositories/Services, and returns HTTP responses.

---

## Gallery

### Home Page
<p align="center">
  <img src="https://github.com/user-attachments/assets/c5757fe6-cff1-4e06-9eeb-176c05b6f712" width="100%"  />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/1aa23617-d4ff-45d7-925a-7ba6889c3f01" width="100%" />
</p>


### Product Catalog & Advanced Filtering
<p align="center">
  <img src="https://github.com/user-attachments/assets/80aeecf8-ecd3-4cb8-966f-1d6139443975" width="100%" />
  &nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/25a62e50-6969-4da7-8f1b-345170a9de3e" width="100%" />
</p>


### Product Details & Reviews
<p align="center">
  <img src="https://github.com/user-attachments/assets/06466076-3418-404a-b184-23f1d142cc9d" width="100%" />
  &nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/7cae6616-287b-4b76-99f6-c7017e7ff174" width="100%" />
</p>


### Shopping Experience
<p align="center">
  <img src="https://github.com/user-attachments/assets/851fbb03-97f2-4ff2-9964-791e6c186a0e" width="100%" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/d75ef15a-570b-4f4b-9af7-3bc401197ab1" width="100%" />
</p>


### Admin Dashboard
<p align="center">
  <img src="https://github.com/user-attachments/assets/2d3c7c5b-0b24-4b09-b3a6-a1303a4bc55d" width="100%" />
</p>
