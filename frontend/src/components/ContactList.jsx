import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UserLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";
import { useUtilStore } from "../store/useUtilStore";

export default function ContactList() {
    const { getContacts, contacts, isUsersLoading, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const { setSideBar, sideBar } = useUtilStore();

    useEffect(() => {
        getContacts();
    }, [getContacts]);

    if (isUsersLoading) return <UsersLoadingSkeleton />;
    return (
        <div className="space-y-2">
            {contacts.map((contact) => (
                <div
                    key={contact._id}
                    onClick={() => {
                        setSelectedUser(contact);
                        setSideBar(!sideBar);
                    }}
                    className="bg-cyan-500/10 p-2 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`avatar  ${onlineUsers.includes(contact._id) ? "avatar-online" : "avatar-offline"}`}>
                            <div className="size-12 overflow-hidden rounded-full">
                                <img className="object-cover" src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
                            </div>
                        </div>
                        <h4 className="text-slate-200 font-medium truncate">{contact.fullName}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
}
