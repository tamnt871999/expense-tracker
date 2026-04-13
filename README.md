# 💰 Modern Expense Tracker

![Expense Tracker Preview](https://camo.githubusercontent.com/96e94943fcfcbffc32f8bda32bd1a7343e0921a41bb7a4eb31d9ca63f03b5db3/68747470733a2f2f7669612e706c616365686f6c6465722e636f6d2f31303030783435302f3466343665352f6666666666663f746578743d457870656e73652b547261636b65722b44617368626f617264)

A comprehensive, full-stack personal finance management application. Designed to process daily expenditures, evaluate monthly spending rhythms, and deliver immersive, category-based budget analysis through a beautifully crafted User Interface.

---

## 🛠 Tech Stack

**Frontend / UI:**
- **[React.js](https://react.dev/)** powered by **Vite** for lightning-fast HMR
- **[Tailwind CSS](https://tailwindcss.com/)** for highly responsive, modern Glassmorphism styling

**Backend / API:**
- **[Java Spring Boot 3](https://spring.io/projects/spring-boot)** - Robust RESTful architecture
- **[Spring Data JPA](https://spring.io/projects/spring-data-jpa)** - Powerful ORM mapping
- **[MySQL](https://www.mysql.com/)** - Permanent relational data storage
- **Lombok** - Boilerplate code reduction

---

## ✨ Core Features

* 📝 **Expense Operations (CRUD)** 
  * Frictionless creation and deletion of daily expense records.
  * Real-time sorting and filtering synchronized to selected month & year contexts.

* 📊 **Financial Summary Dashboard**
  * Auto-calculated top widgets displaying `Total Income`, `Total Expenses`, and real-time `Remaining Balance`.
  
* 🎯 **Smart Categorical Budgeting**
  * Set specific financial limits tailored to life categories (e.g., Food, Rent, Entertainment).
  * **Auto-Carryover Engine:** The system intelligently recognizes time-shifts and automatically clones prior budget settings to upcoming months, completely removing redundant setup tasks.
  * Interactive dual-layer progress bars featuring conditional warning colors (Green for safe, Red for exceeded limits).

---

## 🚀 Getting Started

Follow these steps to mount the project on your local machine for development.

### Prerequisites
* JDK 17+
* Node.js 18+
* MySQL Server (Running on default port `3306`)

### 1. Database Initialization
Create a blank database instance. Hibernate will handle schema generations automatically:
```sql
CREATE DATABASE tracker_db;
```

### 2. Backend Setup
Navigate into the `backend` block and launch the Spring Engine:
```bash
cd backend
# Windows
.\mvnw.cmd spring-boot:run
# macOS/Linux
./mvnw spring-boot:run
```
*(The API server will boot locally at `http://localhost:8080`)*

### 3. Frontend Setup
Open a separated terminal, jump into the `frontend` block, resolve dependencies and ignite the UI:
```bash
cd frontend
npm install
npm run dev
```
*(The React application is accessible at `http://localhost:5173`)*

---

## 💡 Architecture Highlights
- **"Lifting State" Strategy:** Engineered with root-level `refreshTrigger` chains in `App.jsx`, guaranteeing that isolated UI widgets sync perfectly and instantaneously whenever background data mutating (Add/Delete) occurs.
- **Data Encapsulation:** Safe payload traversing from Java Entity -> Service -> DTO -> React.
- **REST Precision:** Clean URL mapping patterns isolating Domain (`/expenses`) vs Sub-Domain structures (`/budgets/categories`).

---
> *Development Portfolio / Full-stack Java React Repository*
