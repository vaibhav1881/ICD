"use client";

import { ConceptGraph } from "@/components/ConceptGraph";
import { Search, Filter, Maximize2, Minimize2, ZoomIn, ZoomOut, Target, Compass, X, Network } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";

const SUBDOMAINS = [
    "Artificial Intelligence",
    "Data Science",
    "Software Engineering",
    "Cybersecurity",
    "Networking & Cloud",
    "Hardware & Robotics",
    "Human-Computer Interaction",
    "Emerging Technologies"
];

export default function GraphPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSubdomain, setFilterSubdomain] = useState("all");
    const [isFullscreen, setIsFullscreen] = useState(true); // Default to fullscreen view

    return (
        <div className={`fixed inset-0 z-50 flex flex-col bg-slate-950 transition-all ${isFullscreen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            
            {/* Minimal Control Bar Overlay */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl px-4 flex flex-col items-center gap-4 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/40 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl shadow-2xl">
                  {/* Search */}
                  <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                          type="text"
                          placeholder="Trace concept pathway..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-48 sm:w-64 bg-transparent border-none py-2.5 pl-9 pr-4 text-xs font-bold text-white placeholder-white/20 focus:outline-none transition-all"
                      />
                  </div>

                  <div className="w-[1px] h-6 bg-white/5 mx-1"></div>

                  {/* Filter Subdomain Select */}
                  <div className="relative group">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <select
                      value={filterSubdomain}
                      onChange={(e) => setFilterSubdomain(e.target.value)}
                      className="appearance-none bg-transparent border-none py-2.5 pl-9 pr-8 text-[11px] font-black uppercase tracking-widest text-white/50 focus:outline-none focus:text-white cursor-pointer transition-all"
                    >
                      <option value="all">Global Matrix</option>
                      {SUBDOMAINS.map(s => (
                        <option key={s} value={s} className="bg-slate-900 text-white font-bold">{s.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
              </div>

              {/* Status Indicator */}
              <div className="flex gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/80">Neural Connectivity Active</span>
                </div>
              </div>
            </div>

            {/* Exit Control */}
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              <Link 
                href="/"
                className="flex items-center justify-center h-10 px-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-xl text-white/40 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
              >
                  <X className="h-4 w-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Leave Matrix</span>
              </Link>
            </div>

            {/* Graph Visualization */}
            <div className="flex-1 w-full h-full">
                <ConceptGraph 
                    searchTerm={searchTerm} 
                    filterSubdomain={filterSubdomain} 
                />
            </div>

            {/* Global Legend Summary (Bottom Right) */}
            <div className="absolute bottom-6 right-6 z-10 hidden xl:flex flex-col gap-2 p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Compass className="h-4 w-4 text-blue-500" />
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-white/60">Navigation Command</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-[10px] font-bold text-white/40 group">
                    <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-blue-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                      <Target className="h-2.5 w-2.5" />
                    </div>
                    <span>Click a node to isolate and center viewpoint</span>
                  </li>
                  <li className="flex items-center gap-3 text-[10px] font-bold text-white/40 group">
                    <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-blue-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                      <Network className="h-2.5 w-2.5" />
                    </div>
                    <span>Hover to visualize bidirectional connectivity</span>
                  </li>
                  <li className="flex items-center gap-3 text-[10px] font-bold text-white/40 group">
                    <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-blue-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                      <ZoomIn className="h-2.5 w-2.5" />
                    </div>
                    <span>Scroll to adjust observational scale (Zoom)</span>
                  </li>
                </ul>
            </div>
        </div>
    );
}

// Helper to remove scroll when in graph view
if (typeof window !== "undefined") {
    // We could use effect here, but keeping it simple for now
}
