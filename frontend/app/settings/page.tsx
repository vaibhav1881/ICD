"use client";

import { Settings as SettingsIcon, Database, Zap, Bell, Shield, Palette, Save, RotateCcw } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            {/* Page Header */}
            <div>
                <h1 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Settings
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Fine-tune your research environment and system integration
                </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* General Settings */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                    <div className="border-b border-slate-50 p-6 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                                <SettingsIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white">
                                Interaction
                            </h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="max-w-md">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">Live Capture</p>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                    Automatically process and extract concepts from research articles as you browse them.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer group">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                            <div className="max-w-md">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">Collision Alerts</p>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                    Receive real-time notifications when the engine detects a high-confidence cross-domain connection.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* API Configuration */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                    <div className="border-b border-slate-50 p-6 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
                                <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white">
                                Inference Engine
                            </h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">
                            Synthesis API Key
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••••••••••••••••••••••••••"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-mono focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                        <p className="mt-3 text-[11px] font-medium text-slate-400 leading-relaxed">
                            Required for deep-dive report generation. Your key is stored locally and never sent to our servers.
                        </p>
                    </div>
                </div>

                {/* Data Control */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                    <div className="border-b border-slate-50 p-6 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                                <Database className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                            </div>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white">
                                Archive Vault
                            </h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white">Persistence Status</p>
                                <p className="text-xs text-slate-500 mt-0.5">PostgreSQL + Neo4j instances operational</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                Operational
                            </span>
                        </div>
                        <button className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-900/10 dark:hover:text-blue-400">
                            Download Data Export (.JSON)
                        </button>
                    </div>
                </div>

                {/* Theme Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="rounded-lg bg-orange-50 p-2 dark:bg-orange-900/20">
                          <Palette className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Interface Theme</p>
                    </div>
                    <div className="flex gap-2">
                        {['Light', 'Dark', 'System'].map(mode => (
                          <button key={mode} className={`flex-1 h-9 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'Light' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 group hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                            {mode}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="rounded-lg bg-rose-50 p-2 dark:bg-rose-900/20">
                          <Shield className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Privacy Guard</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium leading-relaxed">Air-gap processing mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4">
                <button className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    <RotateCcw className="h-4 w-4" />
                    Restore Vault Defaults
                </button>
                <button className="flex items-center gap-2 bg-blue-600 px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-[0.1em] text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                    <Save className="h-4 w-4" />
                    Commit Changes
                </button>
            </div>
        </div>
    );
}
