function MessagesLoadingSkeleton() {
    return (
        <div className="w-full p-10 mx-auto mt-16">
            {[...Array(6)].map((_, index) => (
                <div key={index} className={`chat ${index % 2 ? "chat-start" : "chat-end"} animate-pulse`}>
                    <div className={`rounded-2xl w-48 h-12 relative ${index % 2 === 0 ? "bg-cyan-900 rounded-br-none text-white" : "bg-slate-800 rounded-bl-none text-slate-200"}`}></div>
                </div>
            ))}
        </div>
    );
}
export default MessagesLoadingSkeleton;
