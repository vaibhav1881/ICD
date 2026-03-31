"use client";

import { Clock, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchRecentArticles } from "@/lib/api";

interface Article {
    id: number;
    title: string;
    url: string;
    created_at: string;
}

export function RecentArticles() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const loadArticles = async () => {
            const data = await fetchRecentArticles();
            setArticles(data);
        };
        loadArticles();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Articles</h3>
                <span className="text-xs font-medium text-slate-400">{articles.length} total</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {articles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <Clock className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No articles yet</p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            Capture articles with the browser extension
                        </p>
                    </div>
                ) : (
                    articles.map((article) => (
                        <a
                            key={article.id}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {article.title}
                                </p>
                                <p className="mt-1 flex items-center text-xs text-slate-400">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(article.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <ExternalLink className="mt-1 w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}
