import { useChatStore } from "../store/useChatStore";

export default function ActiveTabSwitch() {
    const { activeTab, setActiveTab } = useChatStore();

    return (
        <div className="w-full flex justify-between p-4">
            <button className={`px-8 py-1 rounded-lg ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`} onClick={() => setActiveTab("chats")}>
                Chats
            </button>
            <button className={`px-8 py-1 rounded-lg ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`} onClick={() => setActiveTab("contacts")}>
                Contacts
            </button>
        </div>
    );
}
