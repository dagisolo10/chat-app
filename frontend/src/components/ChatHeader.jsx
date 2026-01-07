import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const isOnline = onlineUsers.includes(selectedUser._id);

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === "Escape") setSelectedUser(null);
        };
        window.addEventListener("keydown", handleEscKey);

        return () => window.removeEventListener("keydown", handleEscKey);
    }, [setSelectedUser]);

    return (
        <div className="w-full flex bg-slate-800/50 border-b rounded-tr-2xl border-slate-500/20 items-center p-4 justify-between">
            <div className="flex items-center gap-4">
                <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
                    <div className="size-10 md:size-12 rounded-full">
                        <img className="size-full object-cover" src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                    </div>
                </div>
                <div>
                    <h3 className="text-slate-200 text-sm font-medium">{selectedUser.fullName}</h3>
                    <p className="text-slate-400 text-xs">{isOnline ? "Online" : "Offline"}</p>
                </div>
            </div>
            <X onClick={() => setSelectedUser(null)} className="size-4 text-slate-500 hover:text-slate-300 duration-200 cursor-pointer" />
        </div>
    );
}
