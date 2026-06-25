# 🏥 HealthAI - AI-Powered Healthcare Dashboard

A highly scalable, production-ready Full Stack application engineered to provide medical practitioners with real-time clinical data analysis and intuitive patient health tracking. This system features a robust Java Spring Boot REST API backend paired with a modern, state-managed React.js frontend interface.

🔗 **Live Frontend Demo:** [health-ai-flame.vercel.app](https://health-ai-flame.vercel.app)

---

## 🛠️ Tech Stack & Architecture

- **Backend:** Java, Spring Boot, Spring Security, RESTful APIs
- **Frontend:** React.js (ES6+), Data Visualization (Recharts), Lucide Icons
- **Database & Cloud Infrastructure:** Supabase Cloud Database, Vercel (Frontend Hosting)
- **DevOps & Containerization:** Docker, Multi-environment Deployment Configuration

---

## 📐 Project Structure & Directory Hierarchy

The repository is architected using a decoupled frontend/backend structure to ensure clean separation of concerns and independent scalability:

```text
├── healthcare-frontend/   <-- React.js UI, Component States & Recharts Analytics
├── healthcare-backend/    <-- Spring Boot REST API, JPA Entities & Business Logic
├── Dockerfile             <-- Environment Containerization & Multi-stage Build Config
└── README.md              <-- System Architecture & Deployment Documentation
