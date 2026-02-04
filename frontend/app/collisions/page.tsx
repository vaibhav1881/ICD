"use client";

import { CollisionCard } from "@/components/CollisionCard";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCollisions, generateCollision, deleteCollision } from "@/lib/api";

interface Collision {
    id: number;
    concept1: string;
    concept2: string;
    insight: string;
    application: string;
    domain: string;
}

export default function CollisionsPage() {
    const [collisions, setCollisions] = useState<Collision[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        loadCollisions();
    }, []);

    const loadCollisions = async () => {
        const data = await fetchCollisions();
        setCollisions(data);
    };

    const handleGenerate = async () => {
        setLoading(true);
        const newCollision = await generateCollision();
        if (newCollision) {
            setCollisions([newCollision, ...collisions]);
        }
        setLoading(false);
    };

    const handleDelete = async (collisionId: number) => {
        if (!confirm("Are you sure you want to delete this collision?")) {
            return;
        }

        setDeleting(collisionId);
        try {
            await deleteCollision(collisionId);
            setCollisions(collisions.filter(c => c.id !== collisionId));
        } catch (error) {
            alert("Failed to delete collision. Please try again.");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Idea Collisions</h1>
                    <p className="text-slate-500 dark:text-slate-400">Discover unexpected connections between your concepts.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    <Sparkles className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Generating...' : 'Generate New'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {collisions.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No collisions generated yet. Click the button above to start!
                    </div>
                ) : (
                    collisions.map((collision) => (
                        <CollisionCard
                            key={collision.id}
                            collision={collision}
                            onDelete={handleDelete}
                            deleting={deleting === collision.id}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
