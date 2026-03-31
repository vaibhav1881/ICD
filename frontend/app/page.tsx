"use client";

import { RecentArticles } from "@/components/RecentArticles";
import { Zap, Brain, Network, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchStats } from "@/lib/api";
import Link from "next/link";

export default function Home() {
  const [stats, setStats] = useState({
    total_concepts: 0,
    collisions_found: 0,
    connections: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchStats();
      if (data) setStats(data);
    };
    loadStats();
  }, []);

  const statCards = [
    { label: "Total Concepts", value: stats.total_concepts, icon: Brain, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Connections", value: stats.connections, icon: Network, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Collisions", value: stats.collisions_found, icon: Zap, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm card-hover dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-2.5 ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Knowledge Graph CTA */}
        <div className="lg:col-span-3 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Knowledge Graph</h3>
            <p className="text-sm text-slate-500 mt-1">Visual map of your concept network</p>
          </div>
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 mb-5">
              <Network className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs mb-5">
              Explore how your captured concepts and articles interconnect in an interactive 3D space.
            </p>
            <Link 
              href="/graph" 
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Open Graph Viewer
            </Link>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="lg:col-span-2 max-h-[500px] overflow-y-auto rounded-xl shadow-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 custom-scrollbar">
          <RecentArticles />
        </div>
      </div>
    </div>
  );
}
