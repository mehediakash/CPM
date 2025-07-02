# 📦 Courier Management System

A full-stack **MERN (MongoDB, Express, React, Node.js)** web application for managing parcel deliveries with features like agent assignment, live tracking, analytics, email notifications, and exportable reports.

---

## 🔐 Access Credentials (Demo)

| Role     | Email                          | Password   |
|----------|--------------------------------|------------|
| Customer | dev.mhakash@gmail.com          | 12345678   |
| Agent    | freelancer.mhakash@gmail.com   | 12345678   |
| Admin    | mylogicbd3@gmail.com           | 12345678   |

---

## 🚀 Features

- ✅ Customer parcel booking with geolocation
- ✅ Agent dashboard to update parcel status
- ✅ Live parcel tracking with real-time updates
- ✅ Analytics dashboard with bar charts (last 30 days)
- ✅ Export reports as **CSV** or **PDF**
- ✅ Email notifications (booking & status updates)
- ✅ Admin panel to assign agents
- ✅ Barcode scanning for pickup/delivery confirmation
- ✅ JWT authentication system
- ✅ Fully responsive UI using Ant Design

---

## 🛠️ Tech Stack

| Frontend         | Backend          | Database   | Tools & Libraries        |
|------------------|------------------|------------|---------------------------|
| React.js         | Node.js          | MongoDB    | Nodemailer (SMTP Email)   |
| React Router     | Express.js       | Mongoose   | jsPDF + autoTable (PDF)   |
| Ant Design       | JWT Auth         |            | Recharts, CSVLink         |

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js & npm
- MongoDB Atlas (or local MongoDB)
- Gmail account / SMTP service for email

---

### 🔧 Backend Setup

```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Run the backend server
npm run start
```

---

### 🎨 Frontend Setup

```bash
# Navigate to the client folder
cd client

# Install dependencies
npm install

# Run the frontend React app
npm run dev
```

---

## 📬 Email Notification Setup

> 📧 By default, Gmail SMTP is used. If 2FA is enabled on your Gmail account, use an App Password.

- Configuration file: `/server/utils/email.js`
- Can be modified for SendGrid, Mailgun, etc.

---

## 🧪 API Endpoints Overview

API Documentation: https://documenter.getpostman.com/view/40735701/2sB34ZskJa

---

## 📊 Dashboard Analytics

- Total bookings over the last 30 days
- COD collection summary
- Failed delivery stats
- Exportable reports as **CSV** and **PDF**

---

## 📷 Screenshots / Components

- 📦 Booking Form  
- 📈 Analytics Dashboard  
- 👥 Agent Assignment UI  
- 📄 PDF Export Example  
- 📧 Email Notification (via Gmail)

---

## 🙋‍♂️ Author

Developed by **MD Mehedi Hasan Akash**  
🔗 [GitHub Profile](https://github.com/mehediakash)  
📧 Email: dev.mhakash@gmail.com

---
