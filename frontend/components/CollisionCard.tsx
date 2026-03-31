"use client";

import { Zap, ArrowRight, Trash2, Layers } from "lucide-react";
import Link from "next/link";

interface CollisionProps {
    id: number;
    concept1: string;
    concept2: string;
    insight: string;
    application: string;
    domain: string;
    subdomain1?: string;
    subdomain2?: string;
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
        <div className="group flex flex-col h-full bg-white border border-slate-200/60 rounded-2xl premium-card overflow-hidden dark:bg-slate-900 dark:border-slate-800 transition-all">
            <div className="flex-1 p-5 md:p-6 pb-2">
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-1.5 flex-wrap flex-1 max-w-[calc(100%-2.5rem)]">
                        <div className="inline-flex items-center rounded-lg bg-blue-50/80 px-3 py-1 text-[11px] font-extrabold text-blue-700 ring-1 ring-blue-200 ring-inset dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800/60 transition-all max-w-full">
                            <span className="truncate">{collision.concept1}</span>
                        </div>
                        <span className="text-slate-300 text-xs font-mono">×</span>
                        <div className="inline-flex items-center rounded-lg bg-emerald-50/80 px-3 py-1 text-[11px] font-extrabold text-emerald-700 ring-1 ring-emerald-200 ring-inset dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800/60 transition-all max-w-full">
                            <span className="truncate">{collision.concept2}</span>
                        </div>
                    </div>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(collision.id)}
                            disabled={deleting}
                            className="flex-shrink-0 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all dark:hover:bg-red-900/20"
                        >
                            {deleting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-r-transparent"></div>
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-[0.1em] text-slate-400 dark:text-slate-500">
                    <Layers className="h-3 w-3" />
                    <span>Cross-Domain Synthesis</span>
                  </div>
                  <h3 className="text-[17px] font-extrabold text-slate-900 dark:text-white leading-[1.3] group-hover:text-blue-600 transition-colors">
                      {collision.domain}
                  </h3>
                  <p className="text-[14px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-[1.65] font-medium font-body mb-4">
                      {collision.insight}
                  </p>
                </div>
            </div>

            <div className="mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 px-5 md:px-6 py-4 transition-all group-hover:bg-blue-50/20 dark:group-hover:bg-blue-900/10">
                <div className="flex items-start gap-3 mb-4">
                    <div className="mt-0.5 rounded-md bg-amber-100/60 p-1 dark:bg-amber-900/30">
                      <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-[13px] text-slate-600 dark:text-slate-300 font-semibold line-clamp-2 leading-relaxed italic opacity-80">
                        {collision.application}
                    </p>
                </div>
                <div className="flex justify-end pt-1">
                    <Link 
                        href={`/collisions/${collision.id}`}
                        className="inline-flex items-center text-[12px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all active:scale-95 translate-x-0 hover:translate-x-1"
                    >
                        Report <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
