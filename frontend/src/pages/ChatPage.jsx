import ChatList from "../components/ChatList";
import ContactList from "../components/ContactList";
import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ChatContainer from "../components/ChatContainer";
import NoConversation from "../components/NoConversation";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatAnimatedBorder from "../components/ChatAnimatedBorder";
// import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatPage() {
    const { activeTab, selectedUser } = useChatStore();
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <ChatAnimatedBorder>
            <div className="w-80 backdrop-blur-sm flex flex-col items-start h-full rounded-l-2xl border-r border-slate-300/20">
                <ProfileHeader />
                <ActiveTabSwitch />
                <div className="overflow-y-auto w-full p-4">{activeTab === "chats" ? <ChatList /> : <ContactList />}</div>
            </div>

            <div className="flex grow flex-col rounded-2xl backdrop-blur-sm">{selectedUser ? <ChatContainer /> : <NoConversation />}</div>
        </ChatAnimatedBorder>
    );
}
