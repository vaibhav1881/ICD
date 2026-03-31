"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, Network, BookOpen, Settings, Menu, X, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Collisions", href: "/collisions", icon: Zap },
    { name: "Knowledge Graph", href: "/graph", icon: Network },
    { name: "Library", href: "/library", icon: BookOpen },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navContent = (
        <>
            <div className="flex h-[72px] items-center px-6 border-b border-slate-100 dark:border-slate-800/60">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[17px] font-black text-slate-900 dark:text-white leading-none tracking-tight">ICD</span>
                        <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest mt-1">Idea Generator</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1">
                <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 opacity-60">Matrix Navigation</p>
                {navigation.map((item) => {
                    const isActive = pathname === item.href || 
                        (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={clsx(
                                isActive
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white",
                                "group flex items-center rounded-xl px-4 py-3 text-[13px] font-black uppercase tracking-widest transition-all active:scale-95"
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500",
                                    "mr-4 h-4.5 w-4.5 flex-shrink-0 transition-all"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-blue-100/60 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">Active Node</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate">Researcher-01</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
            >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar Container */}
            <div className={clsx(
                "fixed md:static z-40 h-full w-[240px] flex-shrink-0 flex flex-col bg-white border-r border-slate-200/80 dark:bg-slate-950 dark:border-slate-800/60 transition-all duration-300 ease-in-out shadow-2xl md:shadow-none",
                mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {navContent}
            </div>
        </>
    );
}
