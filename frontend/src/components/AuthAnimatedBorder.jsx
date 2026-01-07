import React from "react";

export default function AuthAnimatedBorder({ children }) {
    return (
        <div className="w-10/12 z-1 flex items-center justify-center">
            <div className="z-1 animated-border w-11/12 p-0.25 rounded-2xl">
                <div
                    className="flex z-3 bg-main w-full h-full border border-white/10 rounded-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
