"use client";

import { useEffect, useState } from "react";
import { fetchRecentArticles, deleteArticle } from "@/lib/api";
import { BookOpen, Calendar, ExternalLink, Search, Filter, Trash2 } from "lucide-react";

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
            // Remove from local state
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
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Article Library
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Browse and manage all your captured articles
                </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Articles</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{articles.length}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">This Week</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {articles.filter(a => {
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return new Date(a.created_at) > weekAgo;
                        }).length}
                    </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Today</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {articles.filter(a => {
                            const today = new Date().toDateString();
                            return new Date(a.created_at).toDateString() === today;
                        }).length}
                    </p>
                </div>
            </div>

            {/* Articles List */}
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        All Articles ({filteredArticles.length})
                    </h2>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Loading articles...</p>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="p-12 text-center">
                            <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
                            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                                {searchTerm ? "No articles found matching your search" : "No articles captured yet"}
                            </p>
                        </div>
                    ) : (
                        filteredArticles.map((article) => (
                            <div
                                key={article.id}
                                className="group p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 truncate">
                                            {article.url}
                                        </p>
                                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(article.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            disabled={deleting === article.id}
                                            className="flex-shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:border-red-500 hover:text-red-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-red-500 dark:hover:text-red-400"
                                        >
                                            {deleting === article.id ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-red-600 border-r-transparent"></div>
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
