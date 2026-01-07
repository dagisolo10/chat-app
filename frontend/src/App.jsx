import Deco from "./components/Deco";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import SignUpPage from "./pages/SignUpPage";
import LoadingPage from "./components/LoadingPage";
import { useAuthStore } from "./store/useAuthStore";
import { Navigate, Route, Routes } from "react-router";
import { useEffect } from "react";

function App() {
    const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        console.log("🚀 App mounted — running checkAuth()");
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingPage />;

    return (
        <div className="h-screen py-8 lg:px-8 bg-main relative flex items-center justify-center overflow-hidden">
            <Deco />
            <Routes>
                <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
