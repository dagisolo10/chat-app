import { create } from "zustand";
import api from "../config/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLogginIn: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await api.get("/auth/get-profile");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            ("Error in authCheck:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await toast.promise(api.post("/auth/signup", data), {
                loading: "Signing up...",
                success: (res) => res.data.message || "Account created successfully!",
                error: (err) => err.response?.data?.message || "Signup failed.",
            });
            set({ authUser: res.data.user });
            get().connectSocket();
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLogginIn: true });
        try {
            const res = await toast.promise(api.post("/auth/login", data), {
                loading: "Logging in...",
                success: (res) => res.data.message || "Logged in successfully!",
                error: (err) => err.response?.data?.message || "Login failed.",
            });
            set({ authUser: res.data.user });
            get().connectSocket();
        } finally {
            set({ isLogginIn: false });
        }
    },

    logout: async () => {
        await toast.promise(api.post("/auth/logout"), {
            loading: "Logging out...",
            success: (res) => res.data.message || "Logged out successfully!",
            error: (err) => err.response?.data?.message || "Logout failed.",
        });
        set({ authUser: null });
        get().disconnectSocket();
    },

    updateProfile: async (data) => {
        const res = await toast.promise(api.put("/auth/update-profile", data), {
            loading: "Updating profile...",
            success: (res) => res.data.message || "Profile updated successfully",
            error: (err) => err.response?.data?.message || "Update failed.",
        });
        set({ authUser: res.data });
    },

    connectSocket: () => {
        const { authUser } = get();

        // if no authenticated user or already connected, return
        if (!authUser || get().socket?.connected) return;

        console.log("🔌 Attempting socket connection to:", BASE_URL);

        const socket = io(BASE_URL, {
            withCredentials: true,
            query: {
                userId: authUser._id,
            },
        });

        socket.connect();
        set({ socket });

        // listen for online user
        // same connect name as the backend
        socket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
    },

    disconnectSocket: () => {
        // disconnect only is user is connected

        if (get().socket?.connected) get().socket.disconnect();
    },
}));

/*
REVIEW AND EXPLANATION:
Line 1: Imports 'create' from zustand to create the global state store.
Line 2: Imports the configured axios instance for making API requests.
Line 3: Imports toast for displaying notifications to the user.
Line 4: Imports io from socket.io-client to handle real-time websocket connections.

Line 6: Defines BASE_URL based on the environment (development vs production).

Line 8: Creates the store using Zustand's create function.
Line 9-14: Initial state variables (authUser, loading states, socket instance, onlineUsers list).

Line 16: checkAuth function to verify if the user is logged in when the app starts.
Line 17-27: Tries to fetch profile. On success, sets authUser and connects socket. On error, clears authUser. Finally, stops loading.

Line 29: signup function taking user registration data.
Line 30: Sets signing up loading state to true.
Line 31-36: Makes POST request to /auth/signup. Uses toast.promise for UI feedback (loading/success/error).
Line 37: Sets authUser state with the user data from response.
Line 38: Connects the socket immediately after signup.
Line 39-41: Finally block to reset signing up state to false.

Line 43: login function taking credentials.
Line 44: Sets isLogginIn state to true to show loading UI.
Line 45-50: Makes POST request to /auth/login with toast feedback.
Line 51: Sets authUser state.
Line 52: Connects socket immediately after login.
Line 53-55: Resets logging in state.

Line 57: logout function.
Line 58-62: Makes POST request to /auth/logout with toast feedback.
Line 63: Clears authUser state (sets to null).
Line 64: Disconnects socket to stop receiving events.

Line 67: updateProfile function.
Line 68-72: PUT request to update profile data with toast feedback.
Line 73: Updates authUser state with the new data returned from backend.

Line 76: connectSocket function.
Line 77: Destructures authUser from state.
Line 80: Checks if user is not authenticated or socket is already connected to prevent duplicate connections.
Line 82-87: Initializes socket connection with credentials and passes userId as a query param.
Line 89: Establishes the connection.
Line 90: Stores the socket instance in the state.
Line 94: Sets up an event listener for "getOnlineUsers" to update the onlineUsers list in state.

Line 97: disconnectSocket function.
Line 100: Checks if socket exists and is connected, then disconnects it.
*/
