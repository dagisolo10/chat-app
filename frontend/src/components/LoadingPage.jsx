import Deco from "./Deco";
export default function LoadingPage() {
    return (
        <div className="h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
            <Deco />
            <div className="size-36 rounded-full animate-spin border-4 border-[#008cff7a] border-b-0 border-l-0" />
        </div>
    );
}
