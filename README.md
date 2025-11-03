# 💬 Real-Time Chat App <br>

A modern, real-time chat application built using **HTML**, **CSS**, and **JavaScript**, powered by **PieSocket WebSockets** for instant communication. <br>
It features live messaging, multiple rooms, markdown-style formatting, and a clean, responsive two-column UI. <br>

---

## 🚀 Features <br>

✨ **Real-Time Messaging** – Send and receive chat messages instantly using PieSocket WebSocket API. <br>
👥 **Multiple Chat Rooms** – Join or create different chat rooms for focused discussions. <br>
🧠 **Smart UI Transitions** – Smoothly switch between login and chat screens. <br>
💬 **Markdown-Style Formatting** – Supports **bold** and *italic* message text. <br>
🕓 **Timestamps** – Every message shows when it was sent. <br>
📱 **Responsive Layout** – Clean, two-column layout that adjusts beautifully on all devices. <br>
🧑‍💻 **User Identity** – Displays username and system notifications (joins/leaves). <br>

---

## 🧩 Tech Stack <br>

- **Frontend:** HTML, CSS, JavaScript (Vanilla JS) <br>
- **Realtime Engine:** PieSocket WebSocket API <br>
- **Icons:** Font Awesome <br>

---

## ⚙️ Setup Instructions <br>

1️⃣ Clone this repository <br>

git clone https://github.com/yourusername/realtime-chat-app.git
<br>
2️⃣ Open the project folder <br>

bash
Copy code
cd realtime-chat-app
<br>
3️⃣ Replace the PieSocket credentials in script.js with your own: <br>

javascript
Copy code
const PIESOCKET_CLUSTER_ID = 'your_cluster_id';
const PIESOCKET_API_KEY = 'your_api_key';
<br>
4️⃣ Run a simple local server (optional, for testing): <br>

bash
Copy code
npx serve
or simply open index.html in your browser. <br>

🧠 How It Works <br>
When a user enters their username and room name, they join that WebSocket channel. <br>

Messages are sent and received in real-time using PieSocket.publish() and PieSocket.subscribe(). <br>

Each message includes the sender, timestamp, and formatting for readability. <br>

The chat auto-scrolls to the latest message for a seamless experience. <br>

🪄 Message Formatting <br>
You can use markdown-style syntax while typing messages: <br>

**bold text** → bold text <br>

*italic text* → italic text <br>

📁 File Structure <br>
pgsql
Copy code
📦 realtime-chat-app
 ┣ 📜 index.html
 ┣ 📜 style.css
 ┗ 📜 script.js
<br>
index.html – Structure of the app (login + chat UI) <br>
style.css – Styling and responsive layout <br>
script.js – Handles WebSocket logic, DOM manipulation, and chat events <br>

preview-
<br>
<img width="949" height="628" alt="image" src="https://github.com/user-attachments/assets/c3cc5752-641e-4c0f-8713-49f1b42dfb12" />

<img width="1820" height="844" alt="image" src="https://github.com/user-attachments/assets/0efb44b8-3dc5-4593-9398-13468e4eda4f" />


