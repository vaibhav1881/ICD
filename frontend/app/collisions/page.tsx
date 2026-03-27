"use client";

import { CollisionCard } from "@/components/CollisionCard";
import { Sparkles, Target, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCollisions, generateCollision, deleteCollision, fetchRecentArticles } from "@/lib/api";

interface Collision {
    id: number;
    concept1: string;
    concept2: string;
    insight: string;
    application: string;
    domain: string;
}

interface Article {
    id: number;
    title: string;
    url: string;
}

export default function CollisionsPage() {
    const [collisions, setCollisions] = useState<Collision[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>([]);

    useEffect(() => {
        loadCollisions();
        loadArticles();
    }, []);

    const loadCollisions = async () => {
        const data = await fetchCollisions();
        setCollisions(data);
    };

    const loadArticles = async () => {
        const data = await fetchRecentArticles();
        setArticles(data);
    };

    const toggleArticle = (id: number) => {
        if (selectedArticleIds.includes(id)) {
            setSelectedArticleIds(selectedArticleIds.filter(aId => aId !== id));
        } else if (selectedArticleIds.length < 5) {
            setSelectedArticleIds([...selectedArticleIds, id]);
        } else {
            alert("Maximum 5 articles can be selected.");
        }
    };

    const handleGenerate = async (articleIds?: number[]) => {
        setLoading(true);
        if (showModal) setShowModal(false);
        const newCollision = await generateCollision(articleIds ? { article_ids: articleIds } : undefined);
        if (newCollision) {
            setCollisions([newCollision, ...collisions]);
            setSelectedArticleIds([]);
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Idea Collisions</h1>
                    <p className="text-slate-500 dark:text-slate-400">Discover unexpected connections between your concepts.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={loading}
                        className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <Target className="mr-2 h-4 w-4" />
                        Custom Collision
                    </button>
                    <button
                        onClick={() => handleGenerate()}
                        disabled={loading}
                        className="flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        <Sparkles className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Generating...' : 'Generate Random'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {collisions.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No collisions generated yet. Click the buttons above to start!
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

            {/* Custom Collision Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl relative">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Targeted Collision</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Select up to 5 articles to extract concepts from and create a highly specific collision.
                        </p>

                        <div className="max-h-60 overflow-y-auto mb-6 space-y-2 pr-2">
                            {articles.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">No articles captured yet.</p>
                            ) : (
                                articles.map(article => {
                                    const isSelected = selectedArticleIds.includes(article.id);
                                    return (
                                        <div 
                                            key={article.id}
                                            onClick={() => toggleArticle(article.id)}
                                            className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border transition-all ${
                                                isSelected 
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                        >
                                            <div className="font-medium text-sm truncate pr-4 text-slate-800 dark:text-slate-200">
                                                {article.title}
                                            </div>
                                            <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                                                isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                                {isSelected && <Check className="h-3 w-3" />}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500 font-medium">
                                {selectedArticleIds.length}/5 Selected
                            </span>
                            <button
                                onClick={() => handleGenerate(selectedArticleIds)}
                                disabled={selectedArticleIds.length < 2 || loading}
                                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all active:scale-95"
                            >
                                Generate Idea
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
