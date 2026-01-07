import { useState } from "react";
import InputForm from "../components/InputForm";
import { Loader, Lock, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import AuthAnimatedBorder from "../components/AuthAnimatedBorder";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login, isLogginIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) return toast.error("Input Field Missing");

        login(formData);
        setFormData({ email: "", password: "" });
    };

    return (
        <AuthAnimatedBorder>
            <div className="lg:w-1/2 w-full flex px-8 py-6 flex-col items-center justify-center lg:border-r border-slate-600/30">
                <div className="p-4 flex flex-col items-center">
                    <MessageCircle className="md:size-12 size-10 text-slate-500" />
                    <h1 className="font-bold text-slate-300 md:text-2xl text-xl tracking-wide">
                        Welcome Back
                    </h1>
                    <p className="textarea-md text-slate-500">Log in to access your account</p>
                </div>
                <div className="max-w-lg w-full">
                    <form
                        className="w-full flex flex-col items-center gap-4"
                        onSubmit={handleSubmit}>
                        <InputForm
                            state="email"
                            icon={<Mail className="size-4 auth-input-icon" />}
                            label="Email"
                            placeholder="Enter your email"
                            formData={formData}
                            setFormData={setFormData}
                        />
                        <InputForm
                            state="password"
                            icon={<Lock className="size-4 auth-input-icon" />}
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            formData={formData}
                            setFormData={setFormData}
                        />
                        <button disabled={isLogginIn} className="auth-btn" type="submit">
                            {!isLogginIn && <p>Login</p>}
                            {isLogginIn && <Loader className="animate-spin" />}
                        </button>
                        <div className="text-sm md:text-base text-cyan-500 bg-cyan-600/20 px-4 py-1 rounded-md flex justify-center flex-col sm:flex-row gap-2 items-center">
                            <p>Don't have an account?</p>
                            <Link className="hover:text-cyan-100 duration-300" to="/signup">
                                Signup
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden lg:flex lg:w-1/2 p-8 items-center justify-center bg-linear-to-bl from-slate-800/20 to-transparent">
                <div className="flex flex-col items-center">
                    <img src="/login.png" className="aspect-square w-11/12 object-contain" />
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium text-cyan-400">
                            Connect Anytime, Anywhere
                        </h3>
                        <div className="flex justify-center gap-4">
                            <span className="auth-badge">Secure</span>
                            <span className="auth-badge">Free</span>
                            <span className="auth-badge">Reliable</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthAnimatedBorder>
    );
}
