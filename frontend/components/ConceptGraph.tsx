"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { fetchGraphData } from "@/lib/api";
import SpriteText from "three-spritetext";

// Dynamically import force graph to avoid SSR issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

interface Node {
    id: string;
    name: string;
    type: "article" | "concept";
    subdomain?: string;
    val?: number;
    color?: string;
}

interface Link {
    source: string;
    target: string;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

// Subdomain Color Palette (Research Grade)
const SUBDOMAIN_COLORS: Record<string, string> = {
    "Artificial Intelligence": "#2563EB", // Blue
    "Data Science": "#0891B2",           // Cyan
    "Software Engineering": "#4F46E5",    // Indigo
    "Cybersecurity": "#BE123C",           // Rose
    "Networking & Cloud": "#059669",      // Emerald
    "Hardware & Robotics": "#EA580C",      // Orange
    "Human-Computer Interaction": "#7C3AED", // Violet
    "Emerging Technologies": "#DB2777",   // Pink
    "article": "#94A3B8",                // Slate
    "default": "#64748B"
};

export function ConceptGraph({ 
    filterSubdomain, 
    searchTerm,
    highlightNodeId 
}: { 
    filterSubdomain?: string, 
    searchTerm?: string,
    highlightNodeId?: string 
}) {
    const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const fgRef = useRef<any>();

    // States for interaction
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [hoverNode, setHoverNode] = useState<Node | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const graphData = await fetchGraphData();
            if (graphData) {
                // Calculate node sizes based on connections
                const connectionCounts: Record<string, number> = {};
                graphData.links.forEach((link: Link) => {
                    const src = typeof link.source === 'string' ? link.source : (link.source as any).id;
                    const tgt = typeof link.target === 'string' ? link.target : (link.target as any).id;
                    connectionCounts[src] = (connectionCounts[src] || 0) + 1;
                    connectionCounts[tgt] = (connectionCounts[tgt] || 0) + 1;
                });

                // Enrich nodes with visualization data
                const enrichedNodes = graphData.nodes.map((node: Node) => ({
                    ...node,
                    val: node.type === "article" ? 15 : 5 + (connectionCounts[node.id] || 0) * 2,
                    color: node.type === "article" 
                        ? SUBDOMAIN_COLORS.article 
                        : (SUBDOMAIN_COLORS[node.subdomain || ""] || SUBDOMAIN_COLORS.default)
                }));

                setData({ nodes: enrichedNodes, links: graphData.links });
            }
            setLoading(false);
        };
        loadData();
    }, []);

    // Filter logic
    const filteredData = useMemo(() => {
        let nodes = data.nodes;
        let links = data.links;

        // Apply subdomain filter
        if (filterSubdomain && filterSubdomain !== "all") {
            nodes = nodes.filter(n => n.type === "article" || n.subdomain === filterSubdomain);
            // Re-filter links to only include existing nodes
            const nodeIds = new Set(nodes.map(n => n.id));
            links = links.filter(l => {
                const src = typeof l.source === 'string' ? l.source : (l.source as any).id;
                const tgt = typeof l.target === 'string' ? l.target : (l.target as any).id;
                return nodeIds.has(src) && nodeIds.has(tgt);
            });
        }

        // Apply search term
        if (searchTerm) {
            const st = searchTerm.toLowerCase();
            nodes = nodes.filter(n => n.name.toLowerCase().includes(st));
            const nodeIds = new Set(nodes.map(n => n.id));
            links = links.filter(l => {
                const src = typeof l.source === 'string' ? l.source : (l.source as any).id;
                const tgt = typeof l.target === 'string' ? l.target : (l.target as any).id;
                return nodeIds.has(src) && nodeIds.has(tgt);
            });
        }

        return { nodes, links };
    }, [data, filterSubdomain, searchTerm]);

    // Highlight Logic
    const updateHighlight = useCallback((node: any) => {
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());

        if (node) {
            const hNodes = new Set();
            const hLinks = new Set();
            
            hNodes.add(node.id);
            data.links.forEach(link => {
                const src = typeof link.source === 'string' ? link.source : (link.source as any).id;
                const tgt = typeof link.target === 'string' ? link.target : (link.target as any).id;
                
                if (src === node.id) {
                    hNodes.add(tgt);
                    hLinks.add(link);
                } else if (tgt === node.id) {
                    hNodes.add(src);
                    hLinks.add(link);
                }
            });
            
            setHighlightNodes(hNodes);
            setHighlightLinks(hLinks);
        }
    }, [data]);

    const handleNodeHover = (node: any) => {
        setHoverNode(node);
        updateHighlight(node);
    };

    if (loading) return (
        <div className="flex h-full w-full items-center justify-center bg-slate-950">
            <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500 mx-auto"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Graph Engine</p>
            </div>
        </div>
    );

    return (
        <div className="relative h-full w-full bg-slate-950">
            <ForceGraph3D
                ref={fgRef}
                graphData={filteredData}
                backgroundColor="#020617" // Very dark slate
                nodeLabel={(node: any) => `
                    <div class="px-3 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl">
                        <p class="font-bold text-slate-900 dark:text-white text-sm">${node.name}</p>
                        <p class="text-[10px] text-slate-500 uppercase font-black mt-1">${node.type === 'concept' ? String(node.subdomain).toUpperCase() : 'RESEARCH ARTICLE'}</p>
                    </div>
                `}
                nodeVal="val"
                nodeColor={(node: any) => {
                    if (highlightNodes.size > 0 && !highlightNodes.has(node.id)) return "#1e293b"; // Dimmed
                    return node.color;
                }}
                nodeOpacity={0.9}
                linkColor={(link: any) => {
                    return highlightLinks.has(link) ? "#3b82f6" : "rgba(148, 163, 184, 0.2)";
                }}
                linkWidth={(link: any) => (highlightLinks.has(link) ? 2 : 0.5)}
                linkDirectionalParticles={(link: any) => (highlightLinks.has(link) ? 4 : 0)}
                linkDirectionalParticleWidth={2}
                linkDirectionalParticleSpeed={0.005}
                nodeThreeObject={(node: any) => {
                    // Only show text for highlighted or hovered nodes to keep it clean
                    const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node.id);
                    if (!isHighlighted) return null;

                    const sprite = new SpriteText(node.name);
                    sprite.color = node.color;
                    sprite.textHeight = node.type === "article" ? 6 : 4;
                    sprite.fontWeight = "bold";
                    sprite.fontFace = "Inter, sans-serif";
                    
                    // Reposition so it's not hidden behind the sphere
                    sprite.position.y = node.val / 2 + 5;
                    return sprite;
                }}
                nodeThreeObjectExtend={true}
                onNodeHover={handleNodeHover}
                onNodeClick={(node: any) => {
                  // Aim at node
                  const distance = 100;
                  const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
                  fgRef.current.cameraPosition(
                    { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                    node,
                    1500
                  );
                }}
                d3Force="link"
                d3VelocityDecay={0.3}
            />

            {/* Subdomain Legend Overlay */}
            <div className="absolute bottom-6 left-6 p-4 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 pointer-events-none transition-all hidden md:block">
              <p className="text-[10px] font-black tracking-widest text-white/40 mb-3 uppercase">Domain Classification</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {Object.entries(SUBDOMAIN_COLORS).filter(([k]) => k !== "article" && k !== "default").map(([label, color]) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shadow-lg shadow-white/10" style={{ background: color }}></div>
                    <span className="text-[11px] font-bold text-white/70 whitespace-nowrap">{label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full border border-white/20" style={{ background: "#94A3B8" }}></div>
                    <span className="text-[11px] font-bold text-white/70">Article Source</span>
                </div>
              </div>
            </div>
        </div>
    );
}
