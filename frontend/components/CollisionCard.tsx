"use client";

import { Sparkles, ArrowRight, Share2, Trash2 } from "lucide-react";

interface CollisionProps {
    id: number;
    concept1: string;
    concept2: string;
    insight: string;
    application: string;
    domain: string;
}

export function CollisionCard({
    collision,
    onDelete,
    deleting
}: {
    collision: CollisionProps;
    onDelete?: (id: number) => void;
    deleting?: boolean;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-2xl transition-all group-hover:from-purple-500/20 group-hover:to-blue-500/20"></div>

            <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {collision.concept1}
                        </span>
                        <span className="text-slate-400">+</span>
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            {collision.concept2}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                            <Share2 className="h-4 w-4" />
                        </button>
                        {onDelete && (
                            <button
                                onClick={() => onDelete(collision.id)}
                                disabled={deleting}
                                className="rounded-full p-2 text-slate-400 hover:bg-red-100 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            >
                                {deleting ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-red-600 border-r-transparent"></div>
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {collision.domain}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {collision.insight}
                </p>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                    <div className="flex items-start space-x-3">
                        <Sparkles className="mt-0.5 h-4 w-4 text-amber-500" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Potential Application
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-200">
                                {collision.application}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Explore Details <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
