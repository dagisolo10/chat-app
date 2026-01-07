import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowUpLeftFromSquareIcon, LogOutIcon, Volume2, VolumeOffIcon, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useUtilStore } from "../store/useUtilStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

export default function ProfileHeader() {
    const { logout, authUser, updateProfile } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState(null);
    const { soundEnabled, toggleSound } = useChatStore();
    const { setSideBar, sideBar } = useUtilStore();

    const fileInputRef = useRef(null);

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

    return (
        <div className="w-full rounded-tl-2xl bg-slate-800/50 p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Profile */}
                    <div className="avatar group avatar-online">
                        {/* Avatar Button Icon */}
                        <button onClick={() => fileInputRef.current.click()} className="size-12 cursor-pointer rounded-full overflow-hidden relative">
                            <img className="size-full object-cover" src={selectedImage || authUser.profilePic || "/avatar.png"} alt="User image" />
                            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs">Change</span>
                            </div>
                        </button>

                        {/* File input */}
                        <input ref={fileInputRef} onChange={handleImageUpload} type="file" accept="image/*" className="hidden" />
                    </div>

                    {/* User status */}
                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">{authUser.fullName}</h3>
                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 items-center">
                    <button className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" onClick={logout}>
                        <LogOutIcon size={16} />
                    </button>
                    <button
                        onClick={() => {
                            mouseClickSound.currentTime = 0;
                            mouseClickSound.play().catch((error) => console.log("Audio play failed", error));
                            toggleSound();
                        }}
                        className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                        {soundEnabled ? <Volume2 size={16} /> : <VolumeOffIcon size={16} />}
                    </button>
                    <button onClick={() => setSideBar(!sideBar)}>
                        <X className="size-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
                    </button>
                </div>
            </div>
        </div>
    );
}
