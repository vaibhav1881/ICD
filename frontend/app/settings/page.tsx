"use client";

import { Settings as SettingsIcon, Database, Zap, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Settings
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Manage your application preferences and configurations
                </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* General Settings */}
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                                <SettingsIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    General Settings
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Basic application preferences
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Auto-capture articles</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Automatically capture articles when you visit them
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Show notifications</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Get notified when new collisions are generated
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* API Configuration */}
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    API Configuration
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Configure external API integrations
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                OpenAI API Key
                            </label>
                            <input
                                type="password"
                                placeholder="sk-..."
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                                Required for AI-powered collision generation. Get your key from{" "}
                                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                                    OpenAI Platform
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Database Settings */}
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/20">
                                <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Database & Storage
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Manage your data and storage
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Database Status</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    All databases connected and operational
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                Connected
                            </span>
                        </div>
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                                Export All Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Privacy & Security */}
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
                                <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Privacy & Security
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Control your data privacy
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Local-only mode</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Keep all data on your local machine
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-pink-100 p-2 dark:bg-pink-900/20">
                                <Palette className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Appearance
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Customize the look and feel
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                                Theme
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                <button className="rounded-lg border-2 border-blue-600 bg-white p-4 text-center hover:bg-slate-50 dark:bg-slate-900">
                                    <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200"></div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Light</p>
                                </button>
                                <button className="rounded-lg border-2 border-slate-200 bg-white p-4 text-center hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                    <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900"></div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Dark</p>
                                </button>
                                <button className="rounded-lg border-2 border-slate-200 bg-white p-4 text-center hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                    <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 via-slate-500 to-slate-900"></div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Auto</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <button className="rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                    Reset
                </button>
                <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
