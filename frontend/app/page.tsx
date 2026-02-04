"use client";

import { RecentArticles } from "@/components/RecentArticles";
import { ConceptGraph } from "@/components/ConceptGraph";
import { Sparkles, Brain, Network } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchStats } from "@/lib/api";

export default function Home() {
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

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Total Concepts</p>
              <p className="text-3xl font-bold">{stats.total_concepts}</p>
            </div>
            <div className="rounded-lg bg-white/20 p-3">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Collisions Found</p>
              <p className="text-3xl font-bold">{stats.collisions_found}</p>
            </div>
            <div className="rounded-lg bg-white/20 p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-100">Connections</p>
              <p className="text-3xl font-bold">{stats.connections}</p>
            </div>
            <div className="rounded-lg bg-white/20 p-3">
              <Network className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[600px]">
          <ConceptGraph />
        </div>
        <div className="h-[600px] overflow-y-auto">
          <RecentArticles />
        </div>
      </div>
    </div>
  );
}
