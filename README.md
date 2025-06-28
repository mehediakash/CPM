
# 📦 Courier Management System

A full-stack MERN (MongoDB, Express, React, Node.js) web application for managing parcel deliveries with support for agent assignment, live status tracking, bar chart analytics, email notifications, and exportable reports.



## 🚀 Features

- ✅ Customer parcel booking with geolocation
- ✅ Agent dashboard to update parcel status
- ✅ Live parcel tracking with status updates
- ✅ Analytics dashboard (bar charts for last 30 days)
- ✅ Export reports as **CSV** or **PDF**
- ✅ Email notifications to customers (parcel booked, status changed)
- ✅ Admin: Assign agents to bookings
- ✅ Barcode scan for pickup/delivery confirmation
- ✅ Authentication system with JWT
- ✅ Responsive and clean UI (Ant Design)

---

## 🛠️ Tech Stack

| Frontend         | Backend          | Database   | Others             |
|------------------|------------------|------------|--------------------|
| React.js         | Express.js       | MongoDB    | Nodemailer (email) |
| React Router     | Node.js          | Mongoose   | jsPDF + autoTable  |
| Ant Design       | JWT Auth         |            | Recharts, CSVLink  |

---

## 📂 Folder Structure

```
📦 courier-management
├── client (React frontend)
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── api (axios config)
│   │   ├── App.js, index.js
│   └── ...
├── server (Node/Express backend)
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── utils (email.js)
│   ├── .env
│   └── server.js
```

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js & npm
- MongoDB (cloud)
- Gmail account or SendGrid (for email)

---

### 🔧 Backend Setup

1. **Navigate to server folder**

```bash
cd server
```

2. **Install dependencies**

```bash
npm install
```


4. **Start backend**

```bash
npm run start
```

---

### 🎨 Frontend Setup

1. **Navigate to client folder**

```bash
cd client
```

2. **Install dependencies**

```bash
npm install
```

3. **Start React app**

```bash
npm run dev
```

---

## 📬 Email Notification Setup

> 📧 Uses Gmail SMTP by default. Use App Passwords if 2FA is enabled.

- File: `/server/utils/email.js`
- Modify if you want to use SendGrid, Mailgun, etc.

---

## 🧪 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/parcels` | Book new parcel |
| `PUT` | `/api/parcels/status/:id` | Update parcel status |
| `PUT` | `/api/parcels/assign/:id` | Assign agent |
| `GET` | `/api/parcels` | All parcels |
| `GET` | `/api/analytics/metrics` | Parcel analytics |
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login user |

---

## 📊 Dashboard Analytics

- Shows bookings over the last 30 days
- COD collection total
- Failed delivery counts
- Exportable reports: **CSV**, **PDF**

---




- Booking form
- Analytics chart
- Assign agent UI
- PDF report
- Email example (Gmail)

---

## 🙋‍♂️ Author

Developed by MD Mehedi Hasan Akash (https://github.com/mehediakash)  
Contact: dev.mhakash@gmail.com

---
