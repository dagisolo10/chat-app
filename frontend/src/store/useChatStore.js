import { create } from "zustand";
import api from "../config/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    contacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,

    isUsersLoading: false,
    isMessagesLoading: false,
    soundEnabled: JSON.parse(localStorage.getItem("soundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("soundEnabled", JSON.stringify(!get().soundEnabled));
        set({ soundEnabled: !get().soundEnabled });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await api.get("/messages/contacts");
            set({ contacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getChats: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await api.get("/messages/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await api.get(`/messages/${userId.toString()}`);
            set({ messages: res.data });
        } catch (error) {
            console.log("Error while getting messages", error);
            toast.error("Something went wrong. Try again");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // optional
        };
        set({ messages: [...messages, optimisticMessage] }); // immediate update of ui (optimistic)
        try {
            const res = await api.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: messages.concat(res.data) });
        } catch (error) {
            // remove optimitsic message on failure
            set((state) => ({ messages: state.messages.filter((message) => message._id !== tempId) }));
            // set({ messages }); // simpler
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    },
    subscribeToMessages: () => {
        const { selectedUser, soundEnabled } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return; 

            const currentMessages = get().messages;
            set({ messages: [...currentMessages, newMessage] });

            if (soundEnabled) {
                const notification = new Audio("/sounds/notification.mp3");

                notification.currentTime = 0;
                notification.play().catch((e) => console.log("Notification audio play failed", e));
            }
        });
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}));
