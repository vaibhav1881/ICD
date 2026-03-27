"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCollision, exploreCollision } from "@/lib/api";
import { ArrowLeft, Beaker, Globe, Lightbulb, AlertTriangle, Blocks, Sparkles } from "lucide-react";
import Link from "next/link";

interface CollisionProps {
    id: number;
    concept1: string;
    concept2: string;
    insight: string;
    application: string;
    domain: string;
}

interface ReportProps {
    executive_summary: string;
    scientific_mechanism: string;
    market_validity: string;
    implementation_challenges: string;
    societal_impact: string;
    confidence_score: number;
    feasibility_score: number;
    market_potential_score: number;
}

function MetricBar({ label, score, colorClass }: { label: string, score: number, colorClass: string }) {
    return (
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{label}</span>
                <span className={`text-xl font-bold ${colorClass}`}>{score}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                    className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`} 
                    style={{ width: `${score}%`, transition: 'width 1s ease-in-out' }}
                ></div>
            </div>
        </div>
    );
}

export default function CollisionReportPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);

    const [collision, setCollision] = useState<CollisionProps | null>(null);
    const [report, setReport] = useState<ReportProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const baseData = await fetchCollision(id);
            if (!baseData) {
                router.push('/collisions');
                return;
            }
            setCollision(baseData);
            
            // Now fetch the deep dive report
            const exploreData = await exploreCollision(id);
            if (exploreData) {
                setReport(exploreData);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
                <p className="text-slate-500 dark:text-slate-400">Synthesizing research report...</p>
            </div>
        );
    }

    if (!collision) return null;

    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-12 animate-in fade-in duration-500">
            <Link 
                href="/collisions" 
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Collisions
            </Link>

            {/* Header section */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {collision.concept1}
                        </span>
                        <span className="text-slate-400 text-lg font-light">×</span>
                        <span className="rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            {collision.concept2}
                        </span>
                    </div>

                    <h1 className="mb-4 text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                        {collision.domain}
                    </h1>

                    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5 dark:border-amber-900/30 dark:bg-amber-900/10">
                        <div className="flex items-start gap-4">
                            <Lightbulb className="mt-1 h-6 w-6 text-amber-500 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Primary Application</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{collision.application}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Research Report Skeleton or Content */}
            {!report ? (
                <div className="flex justify-center py-12">
                    <div className="flex items-center space-x-2 text-slate-500">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                        <span>Generating deep-dive analysis and scoring metrics...</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Metrics Section */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <MetricBar label="AI Confidence" score={report.confidence_score || 0} colorClass="text-blue-500" />
                        <MetricBar label="Feasibility" score={report.feasibility_score || 0} colorClass="text-emerald-500" />
                        <MetricBar label="Market Potential" score={report.market_potential_score || 0} colorClass="text-purple-500" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Executive Summary taking full width */}
                        <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-3 mb-4">
                                <Blocks className="h-5 w-5 text-indigo-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Executive Summary</h2>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {report.executive_summary}
                            </p>
                        </div>

                        {/* Scientific Mechanism */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-3 mb-4">
                                <Beaker className="h-5 w-5 text-emerald-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scientific Mechanism</h2>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {report.scientific_mechanism}
                            </p>
                        </div>

                        {/* Market Validity */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="h-5 w-5 text-blue-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Market Validity</h2>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {report.market_validity}
                            </p>
                        </div>

                        {/* Challenges */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="h-5 w-5 text-rose-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Implementation Challenges</h2>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {report.implementation_challenges}
                            </p>
                        </div>

                        {/* Societal Impact */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="h-5 w-5 text-purple-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Societal Impact</h2>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {report.societal_impact}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
