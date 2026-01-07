# 🧭 Chat App Development Roadmap

A detailed plan for upcoming features and improvements.

---

## ✅ Phase 1 — Core Additions (Next in Line)
- [ ] **Read / Unread Messages**  
  Track message status with `read` + `readAt` fields and emit `"messageRead"` when a user views a chat.

- [ ] **Notification Icon & Sound**  
  Add a badge or dot for new messages. Trigger subtle sound or browser notification when a chat isn’t active.

- [ ] **User Profile Update**  
  Let users update their name, profile picture, and status message.  
  Reuse Cloudinary for image handling.

---

## ⚡ Phase 2 — Real-Time Improvements
- [ ] **Typing Indicator**  
  Emit `"typing"` and `"stopTyping"` socket events. Display “User is typing…” live.

- [ ] **Last Seen / Active Status**  
  Store `lastSeen` timestamp on disconnect and show “Last seen 2m ago” for offline users.

---

## 💬 Phase 3 — Message Management
- [ ] **Message Deletion**  
  Allow users to delete messages with a placeholder like “Message deleted”.

- [ ] **Message Editing**  
  Allow users to update their own messages, showing an “edited” indicator.

- [ ] **File Uploads (Images, PDFs, Voice, etc.)**  
  Extend Cloudinary logic to support multiple file types.  
  Validate size and format on both ends.

---

## 🔍 Phase 4 — Functionality & Usability
- [ ] **Search**  
  Search chats and messages by name or content using MongoDB regex queries.

- [ ] **Group Chats**  
  Add a `Chat` model for group conversations.  
  Manage participant lists and broadcast messages to multiple sockets.

- [ ] **Message Pagination**  
  Load chats in chunks (20 at a time) with infinite scroll to improve performance.

---

## 🎨 Phase 5 — UI / UX Enhancements
- [ ] **Theme Toggle (Dark / Light)**  
  Use Tailwind’s `dark:` variants and save preference in `localStorage`.

- [ ] **Push / Browser Notifications**  
  Use the Notification API to alert users of new messages when the tab is inactive.

- [ ] **Status / Stories (Optional)**  
  Allow users to post temporary images/videos (WhatsApp-style).  
  Reuse Cloudinary for uploads and automatic expiry.

---

## 🧠 Phase 6 — Technical / Backend Upgrades
- [ ] **Socket Room Architecture**  
  Organize users into chat rooms for scalability and cleaner event handling.

- [ ] **Rate Limiting & Security**  
  Prevent spammy message sends with rate limits.  
  Validate uploads and protect Cloudinary endpoints.

- [ ] **Performance & Event Logging**  
  Monitor socket connections, message timings, and errors for better stability.

---

### 🧩 Suggested Build Order
1. Read / Unread Messages  
2. Notifications  
3. Profile Update  
4. Typing Indicator  
5. Last Seen  
6. Message Deletion / Edit  
7. Pagination  
8. Group Chats  
9. File Uploads  
10. Push Notifications  
11. Search  
12. Themes  
13. Stories

---

**Current Status:** `Core Chat App Complete ✅`  
Next focus → **Read/Unread messages + Notification badge.**

---

> 💬 Built with React, Zustand, Socket.IO, Tailwind, Node.js, Express, and MongoDB.
