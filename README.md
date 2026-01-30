# SyncFlow - Project Management for High Performers 🚀

SyncFlow is a modern, drag-and-drop Kanban board application designed to streamline task management. Built with performance and user experience in mind.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ Features (v1.0)

- **🎨 Visual Kanban Board**: Organize tasks into `Todo`, `In Progress`, and `Done`.
- **🤏 Drag & Drop**: Smooth drag-and-drop experience powered by `@dnd-kit`.
- **⚡️ Real-time Updates**: Instant state changes and auto-refresh upon editing.
- **🔒 Smart Locking**: Completed tasks are locked to prevent accidental moves.
- **🏷 Priority System**: Visual indicators for `High`, `Medium`, and `Low` priorities.
- **🔔 Interactive Feedback**: Beautiful toast notifications for user actions.

## 🛠 Tech Stack

**Frontend:**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State/Interaction**: @dnd-kit, Sonner, Lucide React

**Backend:**
- **Framework**: NestJS
- **Database**: MongoDB (Mongoose)
- **API**: RESTful API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/louie53/syncflow.git](https://github.com/louie53/syncflow.git)
   cd syncflow
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file with your MONGO_URI
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Visit the App**
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🗺 Roadmap

- [ ] **v1.1**: User Authentication (Login/Register UI Polish)
- [ ] **v1.2**: Due Dates & Calendar View
- [ ] **v1.3**: Activity Timeline & Audit Logs

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---
*Built with ❤️ by Yi Liu*