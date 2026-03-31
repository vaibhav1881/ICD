"use client";

import { CollisionCard } from "@/components/CollisionCard";
import { Zap, Target, X, Check, Search, Plus, Filter, SortAsc } from "lucide-react";
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
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredCollisions = collisions.filter(c => 
        c.concept1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.concept2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.insight.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 max-w-[1600px] mx-auto py-4">
            {/* Header / Actions */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="relative group flex-1 max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search your library of collisions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200/80 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-white shadow-sm shadow-blue-500/5"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 mr-2">
                        <SortAsc className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Date Newest</span>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={loading}
                        className="inline-flex items-center px-5 h-11 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-[13px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 active:scale-95 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                        <Target className="mr-2 h-4 w-4" />
                        Targeted
                    </button>
                    <button
                        onClick={() => handleGenerate()}
                        disabled={loading}
                        className="inline-flex items-center px-6 h-11 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-[13px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95"
                    >
                        <Plus className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Synthesizing...' : 'Discover New'}
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {filteredCollisions.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-100 rounded-3xl dark:border-slate-800/40">
                        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/10 mb-6">
                          <Zap className="h-10 w-10 text-blue-500" />
                        </div>
                        <p className="text-[18px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Archives Depleted</p>
                        <p className="text-sm text-slate-400 mt-2 text-center max-w-sm font-medium">Trigger your first cross-domain synthesis to populate the research grid.</p>
                    </div>
                ) : (
                    filteredCollisions.map((collision) => (
                        <div key={collision.id} className="h-auto">
                          <CollisionCard
                              collision={collision}
                              onDelete={handleDelete}
                              deleting={deleting === collision.id}
                          />
                        </div>
                    ))
                )}
            </div>

            {/* Custom Collision Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-lg">
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden dark:bg-slate-900 dark:border dark:border-slate-800/60">
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                                  <Target className="h-5 w-5" />
                                </div>
                                <h2 className="text-[20px] font-black text-slate-900 dark:text-white tracking-tight leading-none">Directed Synthesis</h2>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-all dark:hover:bg-slate-800"
                            >
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
                                Cross-pollinate the concepts of up to five distinct technical manuscripts. This targeted approach prioritizes specific domain intersections.
                            </p>

                            <div className="space-y-2.5 max-h-[400px] overflow-y-auto custom-scrollbar pr-3 mb-8">
                                {articles.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400 italic text-sm font-medium">
                                        Vault is currently empty. Capture research to begin.
                                    </div>
                                ) : (
                                    articles.map(article => {
                                        const isSelected = selectedArticleIds.includes(article.id);
                                        return (
                                            <button 
                                                key={article.id}
                                                onClick={() => toggleArticle(article.id)}
                                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                    isSelected 
                                                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-600/10 shadow-lg shadow-blue-500/5' 
                                                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/20 dark:border-slate-800 dark:hover:border-slate-700'
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0 pr-6">
                                                    <p className={`text-[14px] font-bold truncate ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                                        {article.title}
                                                    </p>
                                                </div>
                                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-200 dark:border-slate-700'
                                                }`}>
                                                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                                </div>
                                            </button>
                                        )
                                    })
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saturation</span>
                                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                      {selectedArticleIds.length} / 5 Resources
                                  </span>
                                </div>
                                <button
                                    onClick={() => handleGenerate(selectedArticleIds)}
                                    disabled={selectedArticleIds.length < 2 || loading}
                                    className="px-8 h-12 bg-blue-600 text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/10 transition-all active:scale-95"
                                >
                                    {loading ? 'Processing...' : 'Engage Synthesis'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
