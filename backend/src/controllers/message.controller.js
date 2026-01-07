const User = require("../models/User");
const Message = require("../models/Message");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("express-async-handler");
const { io, getReceiverSocketId } = require("../config/socket");

exports.getChat = asyncHandler(async (req, res) => {
    const loggedInUser = req.user._id.toString();

    // Get all instances of message where logged in
    // user is either a receiver or a sender
    const messages = await Message.find({
        $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }],
    });

    // Create a set of the chap partner ids by looping
    // throught the messages and only getting their id
    const chatPartnerIds = [
        ...new Set(
            messages.map((msg) =>
                msg.senderId.toString() === loggedInUser ? msg.receiverId.toString() : msg.senderId.toString()
            )
        ),
    ];

    // Get all users from their ids
    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    // Response
    res.status(200).json(chatPartners);
});
exports.getAllContacts = asyncHandler(async (req, res) => {
    const loggedInUser = req.user._id;

    // Get all contacts except the user him self
    const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
    // Response
    res.status(200).json(filteredUsers);
});
exports.getMessagesByUserId = asyncHandler(async (req, res) => {
    const myId = req.user._id;
    const id = req.params.id;

    // Get both user-end messages
    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: id },
            { senderId: id, receiverId: myId },
        ],
    });

    // Response
    res.status(200).json(messages);
});
exports.sendMessage = asyncHandler(async (req, res) => {
    const { text, image } = req.body;

    const senderId = req.user._id;
    const receiverId = req.params.id;
    const receiverExists = await User.findById(receiverId);

    // Error Checks

    if (!text && !image) return res.status(400).json({ message: "Message content is required" });

    if (receiverId === senderId) return res.status(400).json({ message: "Can't send message to yourself" });

    if (!receiverExists) return res.status(404).json({ message: "Receiver not found" });

    // Upload image to cloudinary if there is any
    let imageURL = "";
    if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageURL = uploadResponse.secure_url;
    }

    // Create a new message
    const message = await Message.create({
        text,
        image: imageURL,
        receiverId,
        senderId: senderId,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
    }

    // Response
    res.status(201).json(message);
});

/*
REVIEW AND EXPLANATION:
Line 1-5: Imports dependencies: User/Message models, Cloudinary config, async handler wrapper, and socket utilities.

Line 7: getChat controller to fetch users the current user has chatted with.
Line 8: Gets current user's ID from the request object (set by auth middleware).
Line 12-14: Finds all messages where current user is either the sender OR the receiver.
Line 18-24: Extracts unique IDs of chat partners from the messages array using a Set to remove duplicates.
Line 27: Finds User documents for those IDs, excluding passwords for security.
Line 30: Returns the list of chat partners.

Line 32: getAllContacts controller.
Line 33: Gets current user's ID.
Line 36: Finds all users in the database except the current user ($ne = not equal), excluding passwords.
Line 38: Returns the list of users (contacts).

Line 40: getMessagesByUserId controller.
Line 41: Gets current user's ID.
Line 42: Gets the other user's ID from route parameters.
Line 45-49: Finds messages between these two users (sent by me to them OR sent by them to me).
Line 52: Returns the array of messages.

Line 54: sendMessage controller.
Line 55: Destructures text and image from request body.
Line 57: Gets sender ID from req.user.
Line 58: Gets receiver ID from route params.
Line 59: Checks if receiver exists in DB.

Line 63: Validation: Checks if message has content (either text or image) before sending.
Line 65: Validation: Prevents sending message to self.
Line 67: Validation: Returns 404 if receiver not found.

Line 70-74: Handles image upload to Cloudinary if an image string (base64) is provided.
Line 77-82: Creates a new Message document in MongoDB with text, image URL, sender, and receiver.
Line 84: Gets receiver's socket ID using the helper function.
Line 85-87: If receiver is online (has socket ID), emits "newMessage" event to them in real-time.
Line 90: Returns the created message object.
*/
