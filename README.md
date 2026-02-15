# 📋 MERN Task Manager

A full-stack Task Manager application built with **MongoDB, Express.js, React.js, Node.js** and **Material-UI (MUI)**. Supports full CRUD operations, PDF file attachments, and smart status tracking.

---

## ✨ Features

- ✅ **Create, Read, Update, Delete** tasks with a clean UI
- 📎 **PDF file attachments** stored as Blobs in MongoDB
- 🧠 **Smart status rendering** — In Progress / Achieved / Failed
- 📅 **Deadline tracking** with visual alerts
- 📊 **Task statistics** — Total, Done, Pending counts
- 📥 **PDF download** directly from the table
- 🔔 **Toast notifications** for all actions
- ✔️ **Form validation** with inline error messages

---

## 🚦 Status Logic

| Condition | Display Status |
|-----------|---------------|
| Task is TODO and before deadline | **In Progress** |
| Task is DONE and past deadline | **Achieved** |
| Task is TODO and on/past deadline | **Failed** |

---

## 🏗️ Project Structure

```
task-manager/
├── backend/                    # Node.js + Express API
│   ├── models/
│   │   └── Task.js             # Mongoose schema
│   ├── routes/
│   │   └── tasks.js            # CRUD routes
│   ├── middleware/
│   │   └── upload.js           # Multer PDF upload handler
│   ├── server.js               # Express server entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
├── frontend/                   # React + MUI application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.js      # Axios API service
│   │   ├── components/
│   │   │   ├── TaskModal.jsx   # Add/Edit modal
│   │   │   ├── StatusChip.jsx  # Status display chip
│   │   │   └── DeleteConfirmDialog.jsx
│   │   ├── hooks/
│   │   │   └── useTasks.js     # Custom hook for task state
│   │   ├── pages/
│   │   │   └── TaskPage.jsx    # Main page with table
│   │   ├── App.jsx             # MUI Theme + App root
│   │   └── index.js            # React entry point
│   └── package.json
│
└── package.json                # Root: run both servers
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (or MongoDB Atlas URI)

### 1. Clone & Install

```bash
git clone <repo-url>
cd task-manager
npm run install:all
```

### 2. Configure Environment

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Run the Application

**Option A — Run both together:**
```bash
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

### 4. Access the App
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/:id` | Get single task |
| `POST` | `/api/tasks` | Create task (multipart/form-data) |
| `PUT` | `/api/tasks/:id` | Update task (multipart/form-data) |
| `PATCH` | `/api/tasks/:id/status` | Mark task as DONE |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `GET` | `/api/tasks/:id/file` | Download PDF file |

---

## 📦 Task Schema

```javascript
{
  title: String,        // required, max 100 chars
  description: String,  // required, max 500 chars
  status: Enum,         // 'TODO' | 'DONE', default: 'TODO'
  linkedFile: {
    data: Buffer,       // PDF blob (optional)
    contentType: String,
    filename: String
  },
  createdOn: Date,      // auto-generated
  deadline: Date        // required
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Material-UI v5 |
| State | React Hooks (useState, useEffect, useCallback) |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose ODM |
| File Upload | Multer (memory storage → MongoDB Buffer) |
| Styling | MUI + Emotion |

---

## 📸 Sample Data

On first run, the app automatically seeds:
```
Title: Study TypeScript
Description: Read the documentation and make notes.
Created On: 16/08/2024
Deadline: 19/08/2024
Status: TODO
```

---

*Built with ❤️ using the MERN Stack*
