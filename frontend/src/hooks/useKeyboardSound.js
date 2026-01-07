const keyStrokeSound = [new Audio("/sounds/keystroke1.mp3"), new Audio("/sounds/keystroke2.mp3"), new Audio("/sounds/keystroke3.mp3"), new Audio("/sounds/keystroke4.mp3")];
export default function useKeyboardSound() {
    const playRandomKeyboardSound = () => {
        keyStrokeSound.forEach((sound) => sound.load());
        const randomSound = keyStrokeSound[Math.floor(Math.random() * keyStrokeSound.length)];

        // Restart sound
        randomSound.currentTime = 0;
        randomSound.play().catch((error) => console.log("Keyboard sound failed", error));
    };

    return playRandomKeyboardSound;
}
