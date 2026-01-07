const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getChat, getAllContacts, getMessagesByUserId, sendMessage } = require("../controllers/message.controller");
const { arcjetProtection } = require("../middlewares/arcjet.middleware");
const router = express.Router();

router.use(arcjetProtection, protect);

// static -> dynamic

// static routes
router.get("/chats", getChat);
router.get("/contacts", getAllContacts); 

// dynamic routes
router.post("/send/:id", sendMessage); 
router.get("/:id", getMessagesByUserId); 

module.exports = router;
