# Freelance Project Board API

A full-stack backend assessment project built with Node.js, Express.js, MongoDB, Socket.io, Stripe, and Google Gemini AI.

This project implements:

- JWT Authentication
- Role-Based Access Control (RBAC)
- Real-Time Notifications with Socket.io
- Stripe Payment Integration
- AI-Powered Project Description Generator

---

# Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io
- Stripe Checkout
- Google Gemini API
- Postman

---

# Features

## Task 1 — RBAC + JWT Authentication

### Roles

- Client
- Freelancer
- Admin

### Authentication

- User Registration
- User Login
- JWT-based Authentication

### RBAC

- Clients can create projects
- Freelancers can apply to projects
- Admin can manage everything

### Models

- User
- Project
- Application
- Notification
- Transaction

---

# Task 2 — Real-Time Notifications

Implemented using Socket.io.

### Notifications

- Client receives notification when Freelancer applies
- Freelancer receives notification when Client accepts/rejects application
- Notifications saved in MongoDB
- Handles socket disconnects gracefully

---

# Task 3 — Stripe Payment Integration

Implemented Stripe Checkout in test mode.

### Payment Flow

1. Client accepts Freelancer application
2. Client creates Stripe checkout session
3. Stripe payment page URL returned via API
4. Client completes payment
5. Stripe webhook updates project payment status

### Stripe Features

- Stripe Checkout Session
- Stripe Webhook Handling
- Transaction History
- Payment Status Tracking

### Stripe Test Card

```bash
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date
CVV: Any 3 digits
ZIP: Any 5 digits
```

---

# Task 4 — AI-Powered Project Description Assistant

Implemented using Google Gemini API (Free Tier).

### AI Endpoint Features

- Accepts rough project ideas
- Sends prompt to Gemini API
- Returns clean and professional project descriptions

### Example Request

```json
{
  "idea": "Build a freelance platform for developers"
}
```

### Example Response

```json
{
  "success": true,
  "data": "Title: Remote Developer Job Platform\nDescription: Develop a web-based platform to connect freelance and full-time developers with remote job opportunities. Features include job posting, developer profiles, search functionality, and applicant management.\nRequired Skills: Full-Stack Development (React, Node.js/Python), RESTful API Design, Database Management (SQL/NoSQL), Cloud Deployment (AWS/Azure), UI/UX Principles."
}
```

---

# Project Setup Instructions

## 1. Clone Repository

```bash
git clone <your-github-repository-link>
```

---

## 2. Navigate to Project Folder

```bash
cd freelance-project-board
```

---

## 3. Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
server_PORT=
JWT_SECRET=
JWT_EXPIRES_IN=
MONGODB_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PAYMENT_SUCCESS=
PAYMENT_CANCEL=
GEMINI_API_KEY=
```

---

# How to Run Locally

## Start Development Server

```bash
npm run start
```

Server will run on:

```bash
http://localhost:PORT
```

---

# MongoDB Setup

This project uses MongoDB Atlas Free Tier.

## Steps

1. Create a free MongoDB Atlas account
2. Create an M0 Free Cluster
3. Create database user credentials
4. Whitelist your IP address
5. Copy MongoDB connection string
6. Add it inside `.env`

### Example

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/databaseName
```

---

# Stripe Setup

## Steps

1. Create a free Stripe account
2. Enable Test Mode
3. Copy Stripe Secret Key
4. Add key inside `.env`

```env
STRIPE_SECRET_KEY=your_secret_key
```

---

# Stripe Webhook Setup

## Install Stripe CLI

```bash
npm install -g stripe
```

---

## Login to Stripe

```bash
stripe login
```

---

## Forward Webhook to Local Server

```bash
stripe listen --forward-to localhost:4000/webhook
```

---

## Add Webhook Secret to `.env`

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxx
```

---

# Google Gemini API Setup

This project uses Google Gemini API Free Tier for AI-powered project description generation.

## Steps

### 1. Open Google AI Studio

Visit:

```bash
https://aistudio.google.com/
```

---

### 2. Create API Key

- Login with your Google account
- Click on "Get API Key"
- Create a new API key

---

### 3. Add API Key to `.env`

```env
GEMINI_API_KEY=your_api_key
```

---

# API Testing

Use Postman to test all APIs.

# Folder Structure

```bash
project-root/
│
├── config/
├── controller/
├── middlewares/
├── models/
├── routes/
├── socket/
├── utils/
├── server.js
├── package.json
└── README.md
```

---

# Author

Harjeet Singh

MERN Stack Developer
