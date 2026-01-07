export default function InputForm({ state, icon, label, placeholder, formData, setFormData, type = "text" }) {
    return (
        <div className="w-full flex flex-col items-start gap-1">
            <label className="auth-input-label" htmlFor={label}>
                {label}
            </label>
            <div className="w-full focus-within:outline-2 outline-slate-700 flex items-center outline ouline-slate-400/50 rounded-md px-2 py-1">
                {icon}
                <input
                    className="w-full md:text-base text-sm px-2 outline-none py-1"
                    value={formData[state]}
                    onChange={(e) => setFormData({ ...formData, [state]: e.target.value })}
                    type={type}
                    placeholder={placeholder}
                    id={label}
                />
            </div>
        </div>
    );
}
