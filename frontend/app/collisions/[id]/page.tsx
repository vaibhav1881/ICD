"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCollision, exploreCollision } from "@/lib/api";
import { ArrowLeft, ArrowRight, Beaker, Globe, Lightbulb, AlertTriangle, Blocks, Sparkles, Zap, ChevronRight } from "lucide-react";
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

function MetricCard({ label, score, colorClass }: { label: string, score: number, colorClass: string }) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">{label}</span>
                <span className={`text-lg font-bold ${colorClass} leading-none`}>{score}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                    className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`} 
                    style={{ width: `${score}%`, transition: 'width 1.2s cubic-bezier(0.65, 0, 0.35, 1)' }}
                ></div>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children, colorClass }: { title: string, icon: any, children: any, colorClass: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-[800px] mx-auto w-full">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('500', '50')} dark:${colorClass.replace('text-', 'bg-').replace('500', '900/20')}`}>
                  <Icon className={`h-5 w-5 ${colorClass}`} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{title}</h2>
            </div>
            <div className="border-t border-slate-50 dark:border-slate-800 pt-5">
                <div className="report-text text-slate-600 dark:text-slate-400 font-normal leading-relaxed text-[15px]">
                    {children}
                </div>
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
            <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="h-14 w-14 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
                  <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-slate-800 dark:text-white font-bold text-lg">Synthesizing Convergence</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Cross-referencing domain principles and market dynamics...</p>
                </div>
            </div>
        );
    }

    if (!collision) return null;

    return (
        <div className="mx-auto max-w-5xl space-y-8 pb-16">
            {/* Header Breadcrumb */}
            <div className="max-w-[800px] mx-auto w-full px-1">
              <Link 
                  href="/collisions" 
                  className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
              >
                  <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                  Synthesis Archive
              </Link>
            </div>

            {/* Title / Hero */}
            <div className="max-w-[800px] mx-auto w-full text-center space-y-5 py-6 px-1">
                <div className="flex items-center justify-center gap-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                      {collision.concept1}
                    </span>
                    <span className="text-slate-300 font-light text-xl">×</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800">
                      {collision.concept2}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight px-4">
                  {collision.domain}
                </h1>
                <div className="mx-auto w-12 h-1 bg-blue-600 rounded-full opacity-30"></div>
            </div>

            {/* Report Content */}
            {!report ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-400"></div>
                    <span className="text-sm font-medium">Drafting research sections...</span>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* Scores Section */}
                    <div className="max-w-[800px] mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard label="Confidence" score={report.confidence_score || 0} colorClass="text-blue-600" />
                        <MetricCard label="Feasibility" score={report.feasibility_score || 0} colorClass="text-emerald-600" />
                        <MetricCard label="Potential" score={report.market_potential_score || 0} colorClass="text-purple-600" />
                    </div>

                    {/* Section Stack */}
                    <Section title="Executive Summary" icon={Blocks} colorClass="text-indigo-500">
                        {report.executive_summary}
                    </Section>

                    <Section title="Technical Mechanism" icon={Beaker} colorClass="text-emerald-500">
                        {report.scientific_mechanism}
                    </Section>

                    {/* Application Highlight Card (Special) */}
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/10 p-7 shadow-sm dark:border-amber-900/20 dark:bg-amber-900/5 max-w-[800px] mx-auto w-full relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10 -rotate-12 translate-x-4">
                          <Lightbulb className="h-32 w-32 text-amber-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <Lightbulb className="h-5 w-5 text-amber-600" />
                            <h2 className="text-lg font-bold text-amber-900 dark:text-amber-300 tracking-tight">Practical Application</h2>
                        </div>
                        <p className="text-[16px] text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
                            {collision.application}
                        </p>
                    </div>

                    <Section title="Market Validity" icon={Globe} colorClass="text-blue-500">
                        {report.market_validity}
                    </Section>

                    <Section title="Implementation Hurdles" icon={AlertTriangle} colorClass="text-rose-500">
                        {report.implementation_challenges}
                    </Section>

                    <Section title="Societal Impact" icon={Sparkles} colorClass="text-purple-500">
                        {report.societal_impact}
                    </Section>
                </div>
            )}

            {/* Pagination / Footer */}
            <div className="pt-10 border-t border-slate-100 dark:border-slate-800 max-w-[800px] mx-auto w-full text-center">
              <button 
                onClick={() => router.push('/collisions')}
                className="inline-flex items-center px-6 py-2.5 text-slate-500 hover:text-slate-900 font-semibold group transition-all"
              >
                Back to Synthesis archive
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 duration-300" />
              </button>
            </div>
        </div>
    );
}
