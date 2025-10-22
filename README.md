# ⚡ CipherStudio - Browser-Based React IDE

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Sandpack](https://img.shields.io/badge/Sandpack-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A browser-based **React IDE** that allows users to create, edit, and preview React projects directly in the browser.  
Built as part of the **CipherStudio Assignment**, simulating online IDEs like **CodeSandbox**.

---

## 🧠 Objective

CipherStudio provides a seamless in-browser development experience where users can:

- 📝 Create and manage multiple files  
- 💻 Write and edit React code  
- 🚀 Run and preview projects live  
- 💾 Save and reload projects from `localStorage`  
- 🌗 Toggle between light and dark themes  

---

## ✨ Features

### 🧩 Core Features
- **File Management:** Create, delete, and organize files in a project tree view  
- **Code Editor:** Rich editor using `@codesandbox/sandpack-react`  
- **Live Preview:** Real-time rendering of React code  
- **Save & Load Projects:** Persist project data in `localStorage`  
- **Clean UI/UX:** Responsive, intuitive, and minimal design  

### 🌟 Implemented Bonus Features
- **Theme Switcher:** Light & Dark mode  
- **File Import Support:** Import files from local system  
- **Basic Terminal UI:** Placeholder terminal for future shell integration  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js |
| **Editor & Preview** | Sandpack (`@codesandbox/sandpack-react`) |
| **Styling** | Tailwind CSS |
| **Layout** | React Split Pane (`react-split-pane`) |
| **State Management** | React Hooks & Local Storage |
| **Utilities** | UUID for unique IDs |

---

## 📂 Folder Structure

CipherStudio/
│
├── src/
│ ├── components/
│ │ ├── FileTree.js
│ │ ├── EditorArea.js
│ │ ├── ThemeToggle.js
│ │ └── PreviewPane.js
│ │
│ ├── utils/
│ │ ├── storage.js
│ │ └── helpers.js
│ │
│ ├── App.js
│ ├── index.js
│ └── styles/
│ └── app.css
│
├── public/
│ ├── index.html
│ └── favicon.ico
│
└── package.json



---

## ⚙️ Installation & Usage

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/CipherStudio.git
cd CipherStudio


2️⃣ Install Dependencies
npm install

3️⃣ Run the App
npm start



4️⃣ Open in Browser

http://localhost:3000

🧱 Key Components
Component	Function
FileTree.js	File creation, deletion, organization
EditorArea.js	Sandpack editor & live preview
ThemeToggle.js	Light/Dark mode toggle
storage.js	Save & load project data
SplitPane	Editor & preview layout management
🚀 Future Enhancements

✅ Functional terminal integration

✅ File/folder rename

✅ User authentication (login/register)

✅ Cloud save using MongoDB + Express backend

✅ Project deployment from IDE

✅ Autosave toggle feature

💡 Learnings & Takeaways

Hands-on React state management & component design

Implemented real-time rendering with Sandpack

Managed file tree & local storage persistence

Built responsive developer UI using Tailwind & Split Pane

🧑‍💻 Author

Chandana Mukesh
📍 Lovely Professional University
👩‍💻 Frontend Developer | MERN Stack Learner
