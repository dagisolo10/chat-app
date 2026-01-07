import { useState } from "react";
import InputForm from "../components/InputForm";
import { Loader, Lock, Mail, MessageCircle, UserIcon } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import AuthAnimatedBorder from "../components/AuthAnimatedBorder";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
    const { signup, isSigningUp } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password)
            return toast.error("Input Field Missing");

        signup(formData);
        setFormData({ fullName: "", email: "", password: "" });
    };

    return (
        <AuthAnimatedBorder>
            <div className="lg:w-1/2 w-full flex px-8 py-6 flex-col items-center justify-center lg:border-r border-slate-600/30">
                <div className="p-4 flex flex-col items-center">
                    <MessageCircle className="md:size-12 size-10 text-slate-500" />
                    <h1 className="font-bold text-slate-300 md:text-2xl text-xl tracking-wide">
                        Create Account
                    </h1>
                    <p className="textarea-md text-slate-500">Signup for a new account</p>
                </div>
                <div className="max-w-lg w-full">
                    <form
                        className="w-full flex flex-col items-center gap-4"
                        onSubmit={handleSubmit}>
                        <InputForm
                            state="fullName"
                            icon={<UserIcon className="auth-input-icon" />}
                            label="Full Name"
                            placeholder="John Smith"
                            formData={formData}
                            setFormData={setFormData}
                        />
                        <InputForm
                            state="email"
                            icon={<Mail className="size-4 auth-input-icon" />}
                            label="Email"
                            placeholder="johnsmith@gmail.com"
                            formData={formData}
                            setFormData={setFormData}
                        />
                        <InputForm
                            state="password"
                            icon={<Lock className="size-4 auth-input-icon" />}
                            label="Password"
                            placeholder="Enter your password"
                            formData={formData}
                            setFormData={setFormData}
                        />
                        <button disabled={isSigningUp} className="auth-btn" type="submit">
                            {!isSigningUp && <p>Create Account</p>}
                            {isSigningUp && <Loader className="animate-spin" />}
                        </button>
                        <div className="text-sm md:text-base text-cyan-500 bg-cyan-600/20 px-4 py-1 rounded-md flex justify-center flex-col sm:flex-row gap-2 items-center">
                            <p>Already have an account?</p>
                            <Link className="hover:text-cyan-100 duration-300" to="/login">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden lg:flex lg:w-1/2 p-8 items-center justify-center bg-linear-to-bl from-slate-800/20 to-transparent">
                <div className="flex flex-col items-center">
                    <img src="public/signup.png" className="aspect-square w-11/12 object-contain" />
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium text-cyan-400">
                            Start Your Journey Today
                        </h3>
                        <div className="flex justify-center gap-4">
                            <span className="auth-badge">Free</span>
                            <span className="auth-badge">Easy Setup</span>
                            <span className="auth-badge">Private</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthAnimatedBorder>
    );
}
