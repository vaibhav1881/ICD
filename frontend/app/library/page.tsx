"use client";

import { useEffect, useState } from "react";
import { fetchRecentArticles, deleteArticle } from "@/lib/api";
import { BookOpen, Calendar, ExternalLink, Search, Filter, Trash2, Globe, Clock, ChevronRight } from "lucide-react";

interface Article {
    id: number;
    title: string;
    url: string;
    created_at: string;
}

export default function LibraryPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        setLoading(true);
        const data = await fetchRecentArticles();
        setArticles(data);
        setLoading(false);
    };

    const handleDelete = async (articleId: number) => {
        if (!confirm("Are you sure you want to delete this article? This will also remove it from the knowledge graph.")) {
            return;
        }

        setDeleting(articleId);
        try {
            await deleteArticle(articleId);
            setArticles(articles.filter(a => a.id !== articleId));
        } catch (error) {
            alert("Failed to delete article. Please try again.");
        } finally {
            setDeleting(null);
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Control Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-[56px] z-20 bg-[#F8FAFC]/80 backdrop-blur-md py-4 dark:bg-slate-950/80">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search article titles and sources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-white shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 px-4 h-10 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-500 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                      <BookOpen className="h-4 w-4" />
                      <span>{articles.length} Resources</span>
                    </div>
                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 h-10 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                        <Filter className="h-4 w-4" />
                        Refine
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-4">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
                        <p className="text-sm font-medium text-slate-500">Accessing archives...</p>
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-2xl dark:border-slate-800">
                        <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-800 font-bold dark:text-white">Empty Archive</p>
                        <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                            {searchTerm ? "No results found for your search criteria." : "Start capturing research articles via the browser extension to build your library."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredArticles.map((article) => (
                            <div
                                key={article.id}
                                className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 relative"
                            >
                                <div className="flex items-start justify-between gap-6 mr-10 sm:mr-0">
                                    <div className="flex-1 min-w-0 pr-10">
                                        <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
                                          <Globe className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                          <p className="text-[11px] font-bold text-blue-600/70 dark:text-blue-400/50 uppercase tracking-widest truncate">
                                              {new URL(article.url).hostname}
                                          </p>
                                        </div>
                                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-snug group-hover:text-blue-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <div className="mt-3 flex items-center gap-4 text-xs font-semibold">
                                            <span className="flex items-center gap-1.5 text-slate-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(article.created_at).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                            <a 
                                              href={article.url} 
                                              target="_blank" 
                                              className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                                            >
                                              External Source <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            disabled={deleting === article.id}
                                            className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-400 hover:border-red-100 hover:text-red-500 hover:bg-red-50/50 transition-all dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-red-900/20"
                                        >
                                            {deleting === article.id ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-r-transparent"></div>
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
