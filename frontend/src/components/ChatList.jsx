import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UserLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatList() {
    const { getChats, chats, isUsersLoading, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    useEffect(() => {
        getChats();
    }, [getChats]);

    if (isUsersLoading) return <UsersLoadingSkeleton />;
    if (chats.length === 0) return <NoChatsFound />;
    return (
        <div className="space-y-2">
            {chats.map((chat) => (
                <div key={chat._id} onClick={() => setSelectedUser(chat)} className="bg-cyan-500/10 p-2 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`avatar ${onlineUsers.includes(chat._id) ? "avatar-online" : "avatar-offline"}`}>
                            <div className="size-12 overflow-hidden rounded-full">
                                <img className="object-cover" src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
                            </div>
                        </div>

                        <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
}
