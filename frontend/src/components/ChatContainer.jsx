import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistory from "./NoChatHistory";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageInput from "./MessageInput";

export default function ChatContainer() {
    const { messages, selectedUser, getMessagesByUserId, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessagesByUserId(selectedUser._id);
        subscribeToMessages();
        // clean up
        return () => unsubscribeFromMessages();
    }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current) messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (isMessagesLoading) return <MessagesLoadingSkeleton />;
    return (
        <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                {messages.length > 0 && !isMessagesLoading ? (
                    <div className=" mx-auto space-y-1">
                        {messages.map((msg) => (
                            <div key={msg._id} className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                                <div className={`rounded-xl space-y-2 min-w-24 max-w-3/4 p-2 relative ${msg.senderId === authUser._id ? "bg-cyan-950 rounded-br-none text-white" : "bg-slate-800 rounded-bl-none text-slate-200"}`}>
                                    {msg.image && <img src={msg.image} alt="Shared" className="rounded-md size-48 object-cover hover:object-contain" />}
                                    {msg.text && <p className="text-sm wrap-break-word whitespace-pre-wrap">{msg.text}</p>}
                                    <p className="text-xs mt-1 opacity-50 flex items-center gap-1">{new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</p>
                                </div>
                            </div>
                        ))}
                        {/* 👇 scroll target */}
                        <div ref={messageEndRef} />
                    </div>
                ) : isMessagesLoading ? (
                    <MessagesLoadingSkeleton />
                ) : (
                    <NoChatHistory name={selectedUser.fullName} />
                )}
            </div>
            <MessageInput />
        </div>
    );
}
