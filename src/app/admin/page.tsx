"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Sparkles, Volume2, Users, AlertTriangle, Play, Lock, ChevronRight, Activity, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_CODE = "bbv2026"; // รหัสเข้าหน้า Admin

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

export default function AdminControl() {
    const [passcode, setPasscode] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [extraViewers, setExtraViewers] = useState(0);
    const [activeTab, setActiveTab] = useState<"control" | "settings">("control");

    // States for visual feedback on buttons
    const [lastAction, setLastAction] = useState<string | null>(null);

    useEffect(() => {
        // Load initial extra viewers
        supabase.from('settings').select('extra_viewers').single().then(({ data }) => {
            if (data) setExtraViewers(data.extra_viewers);
        });
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === ADMIN_CODE) {
            setIsAuthenticated(true);
        } else {
            // Small shake animation or error feedback could go here
            alert("Wrong passcode!");
        }
    };

    const updateSetting = async (column: string, value: any) => {
        await supabase.from("settings").update({ [column]: value }).eq("id", 1);
    };

    const triggerAction = async (action: "fireworks" | "sound", actionName: string) => {
        const timestamp = new Date().toISOString();
        setLastAction(actionName);

        if (action === "fireworks") await updateSetting("trigger_fireworks", timestamp);
        if (action === "sound") await updateSetting("test_sound", timestamp);

        setTimeout(() => setLastAction(null), 2000);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Ambient */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                            <Lock className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Security Check
                    </h1>
                    <p className="text-zinc-500 text-center mb-8 text-sm">restricted area // authorized personnel only</p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="password"
                            placeholder="Enter Access Code"
                            className="w-full px-4 py-3 bg-black/40 text-center text-white rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-600 tracking-widest"
                            onChange={(e) => setPasscode(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                        >
                            Authenticate
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30">
            {/* Background Ambient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-900/5 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto p-4 sm:p-8 relative z-10">
                {/* Header */}
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                            <AlertTriangle className="text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">Mission Control</h1>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs text-green-500 font-mono uppercase tracking-wider">System Online</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-xs text-zinc-500 hover:text-white transition-colors"
                    >
                        LOGOUT
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Control Panel */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => triggerAction("sound", "Sound Test")}
                                className="group relative overflow-hidden p-6 bg-zinc-900/40 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all duration-300 hover:bg-blue-500/5"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:to-blue-500/5 transition-all" />
                                <Volume2 className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-zinc-200">Sound Check</h3>
                                <p className="text-xs text-zinc-500 mt-1">Play tick sound locally</p>
                                {lastAction === "Sound Test" && (
                                    <span className="absolute top-4 right-4 text-xs text-blue-400 font-mono animate-pulse">SENT</span>
                                )}
                            </button>

                            <button
                                onClick={() => triggerAction("fireworks", "Fireworks Launched")}
                                className="group relative overflow-hidden p-6 bg-zinc-900/40 border border-white/5 hover:border-amber-500/30 rounded-2xl transition-all duration-300 hover:bg-amber-500/5"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:to-amber-500/5 transition-all" />
                                <Sparkles className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-zinc-200">Fireworks</h3>
                                <p className="text-xs text-zinc-500 mt-1">Trigger celebration effect</p>
                                {lastAction === "Fireworks Launched" && (
                                    <span className="absolute top-4 right-4 text-xs text-amber-400 font-mono animate-pulse">FIRED</span>
                                )}
                            </button>
                        </div>

                        {/* Traffic Control */}
                        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Users className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Traffic Simulation</h2>
                                </div>
                                <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-mono text-purple-300">
                                    +{extraViewers} BOOST
                                </div>
                            </div>

                            <div className="relative pt-6 pb-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    step="50"
                                    value={extraViewers}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setExtraViewers(val);
                                        updateSetting("extra_viewers", val);
                                    }}
                                    className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-purple-500 relative z-10"
                                />

                                <div className="flex justify-between mt-4 text-xs text-zinc-500 font-mono">
                                    <span>0</span>
                                    <span>500</span>
                                    <span>1000</span>
                                    <span>1500</span>
                                    <span>2000+</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Danger Zone Sidebar */}
                    <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 h-fit">
                        <h2 className="text-red-400 font-bold flex items-center gap-2 mb-6 text-sm tracking-widest uppercase">
                            <Activity className="w-4 h-4" /> Danger Zone
                        </h2>

                        <div className="space-y-4">

                            <div className="space-y-4">
                                {/* Force New Year */}
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <h3 className="text-red-200 font-semibold mb-2 text-sm">Force New Year</h3>
                                    <p className="text-red-400/60 text-xs mb-4 leading-relaxed">
                                        Immediately overrides the countdown and triggers the "Welcome 2026" state for all users.
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => updateSetting("is_force_new_year", true)}
                                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-red-900/20 text-sm"
                                        >
                                            ACTIVATE NOW
                                        </button>
                                        <button
                                            onClick={() => updateSetting("is_force_new_year", false)}
                                            className="w-full py-2 bg-transparent hover:bg-red-500/10 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all text-sm"
                                        >
                                            DEACTIVATE
                                        </button>
                                    </div>
                                </div>

                                {/* Time Simulation */}
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <h3 className="text-blue-200 font-semibold mb-2 text-sm">Time Travel Sim</h3>
                                    <p className="text-blue-400/60 text-xs mb-4 leading-relaxed">
                                        Set countdown to specific time remaining for rehearsal.
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                // Set target to 90 seconds from now
                                                const target = new Date(Date.now() + 90000).toISOString();
                                                updateSetting("simulation_timestamp", target);
                                            }}
                                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20 text-xs"
                                        >
                                            SIMULATE T-90s
                                        </button>
                                        <button
                                            onClick={() => updateSetting("simulation_timestamp", null)}
                                            className="w-full py-2 bg-transparent hover:bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 rounded-lg transition-all text-xs"
                                        >
                                            RESET TO REAL TIME
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                                    <div className="flex items-start gap-3">
                                        <Radio className="w-4 h-4 text-zinc-500 mt-1" />
                                        <div>
                                            <h4 className="text-zinc-300 text-sm font-medium">Status</h4>
                                            <p className="text-zinc-600 text-xs mt-1">
                                                Connected to Supabase Realtime <br />
                                                Latency: &lt; 50ms
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
