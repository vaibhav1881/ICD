"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

// Mock data generator for visualization
const generateGraphData = (count = 20) => {
    const nodes = [];
    const links = [];

    // Create nodes
    for (let i = 0; i < count; i++) {
        nodes.push({
            id: i,
            name: i % 3 === 0 ? `Article ${i}` : `Concept ${i}`,
            type: i % 3 === 0 ? 'article' : 'concept',
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            )
        });
    }

    // Create links
    for (let i = 0; i < count; i++) {
        const target = Math.floor(Math.random() * count);
        if (target !== i) {
            links.push({
                source: i,
                target: target
            });
        }
    }

    return { nodes, links };
};

function Node({ node, hovered, setHovered }: any) {
    const color = node.type === 'article' ? '#8b5cf6' : '#3b82f6'; // Purple for article, Blue for concept

    useFrame((state) => {
        // Gentle floating animation
        // Use randomOffset if available, otherwise fallback to 0 (or hash of id if we wanted)
        const offset = node.randomOffset || 0;
        node.position.y += Math.sin(state.clock.elapsedTime + offset) * 0.002;
    });

    return (
        <group position={node.position}>
            <Sphere
                args={[0.2, 16, 16]}
                onClick={() => console.log('clicked', node.name)}
                onPointerOver={() => setHovered(node.id)}
                onPointerOut={() => setHovered(null)}
            >
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </Sphere>
            {hovered === node.id && (
                <Text
                    position={[0, 0.4, 0]}
                    fontSize={0.3}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="white"
                >
                    {node.name}
                </Text>
            )}
        </group>
    );
}

function Connection({ start, end }: { start: THREE.Vector3, end: THREE.Vector3 }) {
    return (
        <Line
            points={[start, end]}
            color="#cbd5e1"
            lineWidth={1}
            transparent
            opacity={0.3}
        />
    );
}

import { fetchGraphData } from "@/lib/api";

interface GraphNode {
    id: string;
    name: string;
    type: 'article' | 'concept';
    position: THREE.Vector3;
}

interface GraphLink {
    source: string;
    target: string;
}

function GraphScene() {
    const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    useEffect(() => {
        const loadGraph = async () => {
            console.log("Fetching graph data...");
            try {
                const data = await fetchGraphData();
                console.log("Graph data received:", data);
                // Process data to add positions
                const processedNodes = data.nodes.map((node: any) => ({
                    ...node,
                    position: new THREE.Vector3(
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    ),
                    randomOffset: Math.random() * 100
                }));
                setGraphData({ nodes: processedNodes, links: data.links });
            } catch (e) {
                console.error("Error loading graph:", e);
            }
        };
        loadGraph();
    }, []);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {graphData.nodes.map((node) => (
                <Node
                    key={node.id}
                    node={node}
                    hovered={hoveredNode}
                    setHovered={setHoveredNode}
                />
            ))}

            {graphData.links.map((link, i) => {
                const sourceNode = graphData.nodes.find(n => n.id === link.source);
                const targetNode = graphData.nodes.find(n => n.id === link.target);
                if (!sourceNode || !targetNode) return null;

                return (
                    <Connection
                        key={i}
                        start={sourceNode.position}
                        end={targetNode.position}
                    />
                );
            })}

            <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
        </>
    );
}

export function ConceptGraph() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Knowledge Graph</h3>
                <div className="flex space-x-3">
                    <span className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> Concept
                    </span>
                    <span className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span> Article
                    </span>
                </div>
            </div>
            <div className="flex-1 w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-b-xl overflow-hidden border-t border-slate-200 dark:border-slate-800 min-h-[400px]">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <GraphScene />
                </Canvas>
            </div>
        </div>
    );
}
