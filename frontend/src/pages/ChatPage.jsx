import ChatList from "../components/ChatList";
import ContactList from "../components/ContactList";
import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ChatContainer from "../components/ChatContainer";
import NoConversation from "../components/NoConversation";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatAnimatedBorder from "../components/ChatAnimatedBorder";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useUtilStore } from "../store/useUtilStore";

export default function ChatPage() {
    const { sideBar, setSideBar } = useUtilStore();
    const { activeTab, selectedUser, setSelectedUser, chats } = useChatStore();
    const { checkAuth, authUser, onlineUsers, updateProfile } = useAuthStore();

    const [selectedImage, setSelectedImage] = useState(null);

    const sidebarRef = useRef(null);
    const fileInputRef = useRef(null);

    const online = chats.filter((chat) => onlineUsers.includes(chat));
    const offline = chats.filter((chat) => !onlineUsers.includes(chat));

    const all = [...online, ...offline];

    console.log("Online", online);
    console.log("Offline", offline);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setSideBar(false);
            }
        };
        if (sideBar) window.addEventListener("mousedown", handleClickOutside);

        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [sideBar, setSideBar]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    };

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <ChatAnimatedBorder>
            <div ref={sidebarRef} className={`absolute top-0 ${sideBar ? "left-0" : "-left-full"} duration-1000 z-20 w-3/4 sm:max-w-1/2 lg:max-w-1/3 bg-slate-900/90 backdrop-blur-sm flex flex-col items-start h-full rounded-l-2xl border-r border-slate-300/20`}>
                <ProfileHeader />
                <ActiveTabSwitch />
                <div className="overflow-y-auto w-full p-4">{activeTab === "chats" ? <ChatList /> : <ContactList />}</div>
            </div>

            <div className="flex flex-col gap-4 items-center border-r p-2 sm:p-4 border-slate-300/20">
                <div className="avatar group avatar-online">
                    <div onClick={() => fileInputRef.current.click()} className="size-12 cursor-pointer rounded-full overflow-hidden relative">
                        <img className="size-full object-cover" src={selectedImage || authUser.profilePic || "/avatar.png"} alt="User image" />
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-xs">Change</span>
                        </div>
                    </div>

                    <input ref={fileInputRef} onChange={handleImageUpload} type="file" accept="image/*" className="hidden" />
                </div>
                <hr className="w-full text-slate-700" />
                {all.map((chat) => (
                    <div key={chat._id} onClick={() => setSelectedUser(chat)} className={`avatar ${onlineUsers.includes(chat._id) ? "avatar-online" : "avatar-offline"}`}>
                        <div className="size-10 sm:size-12 cursor-pointer p-1 bg-slate-800 hover:bg-slate-700 duration-300 rounded-lg overflow-hidden ">
                            <img className="object-cover rounded-full" src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
                        </div>
                    </div>
                ))}
                <Menu className="mt-auto mb-4 size-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" onClick={() => setSideBar((prev) => (prev = !prev))} />
            </div>

            <div className="flex flex-1 flex-col rounded-2xl backdrop-blur-sm">{selectedUser ? <ChatContainer /> : <NoConversation />}</div>
        </ChatAnimatedBorder>
    );
}
