"use client";

import { useEffect, useState } from "react";
import { ConceptGraph } from "@/components/ConceptGraph";
import { Network, Sparkles, TrendingUp } from "lucide-react";
import { fetchStats } from "@/lib/api";

export default function GraphPage() {
    const [stats, setStats] = useState({
        total_concepts: 0,
        collisions_found: 0,
        connections: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            const data = await fetchStats();
            if (data) {
                setStats(data);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Knowledge Graph
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Explore the connections between your captured concepts and articles
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Concepts</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.total_concepts}</p>
                        </div>
                        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
                            <Network className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Connections</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.connections}</p>
                        </div>
                        <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
                            <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Collisions</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.collisions_found}</p>
                        </div>
                        <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/20">
                            <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Graph Visualization */}
            <div className="h-[calc(100vh-280px)] min-h-[500px]">
                <ConceptGraph />
            </div>
        </div>
    );
}
