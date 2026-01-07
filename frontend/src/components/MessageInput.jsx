import { useRef, useState } from "react";
import { Image, Send, XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import useKeyboardSound from "../hooks/useKeyboardSound";
import toast from "react-hot-toast";

export default function MessageInput() {
    const playRandomKeyboardSound = useKeyboardSound();
    const { sendMessage, soundEnabled } = useChatStore();

    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return toast.error("Say something before sending 😊");
        if (soundEnabled) playRandomKeyboardSound();

        sendMessage({ text: text.trim(), image: imagePreview });
        // Reset all inputs
        setText("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Please select an image file");

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };
    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="w-full p-4 border-t border-slate-700/50">
            {imagePreview && (
                <div className="max-w-3xl mx-auto mb-4 flex items-center">
                    <div className="relative">
                        <img className="aspect-square w-20 object-cover rounded-lg border border-slate-700" src={imagePreview} alt="Preview" />
                        <button className="absolute -top-2 -right-2 size-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700" type="button" onClick={removeImage}>
                            <XIcon className="size-4" />
                        </button>
                    </div>
                </div>
            )}
            <form className="flex items-center gap-4" onSubmit={handleSubmit}>
                <input
                    className="text-sm placeholder:text-sm focus-within:border-slate-500 outline-none px-4 py-2 bg-slate-800 grow rounded-md border border-slate-700"
                    placeholder="Type your message..."
                    onChange={(e) => {
                        setText(e.target.value);
                        soundEnabled && playRandomKeyboardSound();
                    }}
                    value={text}
                    type="text"
                />
                <div className="flex gap-4 items-center">
                    <input ref={fileInputRef} onChange={handleImageUpload} type="file" className="hidden" />

                    <button type="button" className={`${imagePreview && "text-cyan-500"} text-slate-700 hover:bg-slate-700 hover:text-slate-300 border hover:border-slate-600 duration-300 cursor-pointer p-2 rounded-md`} onClick={() => fileInputRef.current.click()}>
                        <Image className="size-4 md:size-5" />
                    </button>

                    <button disabled={!text.trim() && !imagePreview} className="text-cyan-300 bg-cyan-700 hover:text-cyan-700 hover:bg-slate-800 hover:border-slate-300 disabled:cursor-not-allowed duration-300 cursor-pointer p-2 rounded-md" type="submit">
                        <Send className="size-4 md:size-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}

/*
REVIEW AND EXPLANATION:
Line 1-5: Imports React hooks (useRef, useState), icons from lucide-react, store, custom sound hook, and toast.

Line 7: Component definition.
Line 8: Initializes keyboard sound hook.
Line 9: Destructures sendMessage action and soundEnabled state from chat store.

Line 11-13: Local state for text input, image preview string, and a ref for the hidden file input.

Line 15: handleSubmit function for form submission.
Line 16: Prevents default form refresh behavior.
Line 17: Validation: checks if both text and image are empty. If so, shows error.
Line 18: Plays typing sound if enabled.
Line 20: Calls sendMessage action from store with text and image.
Line 22-24: Resets text state, image preview state, and clears the file input value.

Line 26: handleImageUpload function triggered by file input change.
Line 27: Gets the selected file.
Line 28-29: Validates file existence and type (must be image). Shows error if invalid.
Line 31-33: Reads file as DataURL using FileReader to show a preview before sending.

Line 35: removeImage function.
Line 36-37: Clears preview state and resets file input.

Line 40: Render start.
Line 41-50: Conditionally renders image preview area if an image is selected. Includes a remove button (XIcon).
Line 51: Form element with onSubmit handler.
Line 52-61: Text input field. Updates state on change and plays sound.
Line 62-72: Action buttons area.
Line 63: Hidden file input element.
Line 65-67: Image upload button (triggers hidden file input via ref). Highlights cyan if image is selected.
Line 69-71: Send button. Disabled if both text and image are empty.
*/
