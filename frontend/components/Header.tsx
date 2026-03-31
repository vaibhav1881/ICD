"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/collisions": "Idea Collisions",
    "/graph": "Knowledge Graph",
    "/library": "Article Library",
    "/settings": "Settings",
};

export function Header() {
    const pathname = usePathname();
    
    let title = pageTitles[pathname] || "Dashboard";
    if (pathname.startsWith("/collisions/")) title = "Research Synthesis";

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = segments.map((seg, i) => {
        const path = "/" + segments.slice(0, i + 1).join("/");
        const label = pageTitles[path] || seg.charAt(0).toUpperCase() + seg.slice(1);
        return { label, path, isLast: i === segments.length - 1 };
    });

    return (
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-6 md:px-8 lg:px-10 dark:border-slate-800/60 dark:bg-slate-950/80 sticky top-0 z-30">
            <div className="flex flex-col justify-center ml-12 md:ml-0 overflow-hidden">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                    <span>Home</span>
                    {breadcrumbs.map((bc) => (
                        <div key={bc.path} className="flex items-center gap-1.5">
                            <ChevronRight className="h-2.5 w-2.5 opacity-50" />
                            <span className={bc.isLast ? "text-blue-500/80" : ""}>{bc.label}</span>
                        </div>
                    ))}
                </div>
                <h2 className="text-[20px] font-black text-slate-900 dark:text-white leading-none tracking-tight">{title}</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden sm:block px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400 dark:bg-slate-900 dark:border-slate-800">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
            </div>
        </header>
    );
}
