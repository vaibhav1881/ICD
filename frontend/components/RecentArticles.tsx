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
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Reads</h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    View All
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {articles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                            <Clock className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-slate-900 dark:text-white">No articles yet</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Start capturing articles with the browser extension
                        </p>
                    </div>
                ) : (
                    articles.map((article) => (
                        <div key={article.id} className="group relative rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-500">
                            <div>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors dark:text-slate-100 dark:group-hover:text-blue-400 line-clamp-2 text-sm"
                                >
                                    {article.title}
                                </a>
                                <div className="flex items-center mt-2 space-x-2 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(article.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute right-4 top-4 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
