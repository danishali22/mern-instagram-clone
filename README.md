# MERN Instagram Clone 📸

A full-featured Instagram-like social media application built using the MERN stack (MongoDB, Express.js, React, Node.js). Includes real-time chat, post creation, comments, likes, follow system, profile editing, notifications, and responsive UI with Tailwind CSS and Vite.

---

## 📁 Project Structure

```
danishali22-mern-instagram-clone/
├── backend/           # Express + MongoDB server
│   ├── controllers/   # Business logic for users, posts, comments, messages
│   ├── middlewares/   # Auth, error handling, file uploads
│   ├── models/        # Mongoose schemas
│   ├── routes/        # REST API routes
│   ├── socket/        # Socket.IO real-time communication
│   └── utils/         # DB connection, helper functions
├── frontend/          # Vite + React client
│   ├── components/    # Reusable and page-level components
│   ├── hooks/         # Custom hooks for API queries
│   ├── redux/         # Redux Toolkit for global state
│   └── lib/           # Utility functions
└── package.json       # Root dependency manager
```

---

## 🚀 Features

### 🔐 Authentication & User

* Signup / Login with JWT
* Protected routes using middleware
* Follow/unfollow users
* Edit profile (bio, avatar, etc.)

### 📸 Posts & Comments

* Create/edit/delete posts with image upload (via Multer)
* Like and comment on posts
* Nested replies on comments
* View user-specific feed and explore others

### 💬 Messaging

* Real-time messaging with Socket.IO
* One-on-one conversations
* Typing indicators and message status

### 🧽 UI/UX

* Fully responsive design
* Tailwind CSS + custom UI components
* Notification toasts and modals

---

## 💠 Tech Stack

### **Frontend**

* React + Vite
* Redux Toolkit
* Tailwind CSS
* Socket.IO client

### **Backend**

* Node.js + Express.js
* MongoDB + Mongoose
* Socket.IO server
* Multer (file upload)
* JWT Authentication

---

## 🧪 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/danishali22/mern-instagram-clone.git
cd danishali22-mern-instagram-clone
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the backend folder with the following:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 4. Run the development servers

```bash
# In backend/
npm run dev

# In frontend/
npm run dev
```

---

## 💪 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 👤 Author

Built with passion by [Danish Ali](https://github.com/danishali22)
