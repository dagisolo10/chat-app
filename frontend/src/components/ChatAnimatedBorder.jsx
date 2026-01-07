import React from "react";

export default function ChatAnimatedBorder({ children }) {
    return (
        <div className="h-[90vh] relative overflow-hidden w-full z-1 flex items-center justify-center">
            <div className="z-1 animated-border w-full h-full p-0.25 rounded-2xl">
                <div className="flex z-3 bg-main w-full h-full border border-white/10 rounded-2xl">{children}</div>
            </div>
        </div>
    );
}
