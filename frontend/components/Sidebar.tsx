"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Share2, BookOpen, Settings, Activity } from "lucide-react";
import { clsx } from "clsx";

const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Collisions", href: "/collisions", icon: Share2 },
    { name: "Knowledge Graph", href: "/graph", icon: Activity },
    { name: "Library", href: "/library", icon: BookOpen },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
            <div className="flex h-16 items-center px-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Idea Collision
                </h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                isActive
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white",
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">User</p>
                        <p className="text-xs text-slate-400">View Profile</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
