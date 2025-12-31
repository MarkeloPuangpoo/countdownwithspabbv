"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, MoveLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-blue-500/30 flex flex-col items-center justify-center p-4">
            {/* Background gradient orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative"
                >
                    <h1 className="text-[12rem] sm:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent select-none">
                        404
                    </h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-amber-200 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                            404 - หาม่ายเจอทูกกกวัน
                        </div>
                    </motion.div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-zinc-400 text-sm sm:text-base mt-4 mb-8 max-w-md mx-auto"
                >
                    หน้านี้ไม่มีอยู่จริง... เหมือนคะแนนสอบกลางภาคเราหรือเปล่า? 🤣
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">กลับหน้าหลัก</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
