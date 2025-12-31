"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Users } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatTimeUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

interface AnimatedDigitProps {
  digit: string;
  index: number;
}

function AnimatedDigit({ digit, index }: AnimatedDigitProps) {
  return (
    <div className="relative h-[1.2em] w-[0.65em] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`${index}-${digit}`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
          className="absolute inset-0 flex items-center justify-center font-mono tabular-nums"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}


interface TimeUnitProps {
  value: string;
  label: string;
  isGiant?: boolean;
}

// Update text sizes for better fit without transform scaling
function TimeUnit({ value, label, isGiant = false }: TimeUnitProps) {
  const digits = value.split("");

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 transition-all duration-500 ease-in-out">
      <div className={cn(
        "flex font-bold tracking-tight leading-none transition-all duration-500",
        // ถ้าเป็นโหมด Giant ให้ใหญ่เต็มจอ (ใช้ vw), ถ้าปกติใช้ขนาดเดิม
        isGiant
          ? "text-[35vw] sm:text-[30vw] md:text-[25vw] lg:text-[20vw] text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]"
          : "text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem]"
      )}>
        {digits.map((digit, i) => (
          <AnimatedDigit key={i} digit={digit} index={i} />
        ))}
      </div>
      <span className={cn(
        "uppercase text-zinc-500 font-semibold transition-all duration-500",
        isGiant
          ? "text-lg sm:text-2xl md:text-4xl tracking-[0.5em] mt-4 sm:mt-8 text-amber-200/80"
          : "text-[10px] xs:text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] mt-2 sm:mt-4"
      )}>
        {label}
      </span>
    </div>
  );
}


function Separator() {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 px-0.5 xs:px-1 sm:px-4 pb-4 sm:pb-8">
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/50"
      />
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/50"
      />
    </div>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="absolute top-0 left-0 p-4 sm:p-6 z-20"
    >
      <div className="flex items-center gap-3 sm:gap-4 pointer-events-none select-none">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="BBV Logo"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white/90">
            spaBBV
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">นับถอยหลังปีใหม่ 2026</p>
        </div>
      </div>
    </motion.div>
  );
}

function FooterStats() {
  const [count, setCount] = useState(124);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    // 1. Subscribe to Extra Viewers and Simulation from Admin
    const channel = supabase.channel('stats-channel')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload) => {
        if (payload.new.extra_viewers !== undefined) {
          setExtra(payload.new.extra_viewers);
        }
        // Update simulation target if changed
        if (payload.new.simulation_timestamp !== undefined) {
          simulationTargetRef.current = payload.new.simulation_timestamp;
        }
      })
      .subscribe();

    // 2. Load initial
    supabase.from('settings').select('extra_viewers, simulation_timestamp').single().then(({ data }) => {
      if (data) {
        setExtra(data.extra_viewers);
        simulationTargetRef.current = data.simulation_timestamp;
      }
    });

    const simulationTargetRef = { current: null as string | null }; // Use ref to avoid re-running effect

    // เช็คทุก 2 วินาที (ปรับให้เร็วกว่าเดิมนิดนึง จะได้ดู Live ขึ้น)
    const interval = setInterval(() => {
      const now = new Date().getTime();
      // Use simulation target if available, otherwise default to 2026
      const targetString = simulationTargetRef.current || "2026-01-01T00:00:00+07:00";
      const targetDate = new Date(targetString).getTime();

      const diff = targetDate - now;

      // 10 นาที = 600,000 milliseconds
      const isLast10Minutes = diff <= 600000 && diff > -60000; // นับรวมช่วงหลังปีใหม่ไปอีก 1 นาทีด้วย

      setCount((prev) => {
        if (isLast10Minutes) {
          // --- โหมด Hype โค้งสุดท้าย (เป้าหมาย 480-520 คน) ---

          // ถ้าคนยังไม่ถึง 450 ให้คนไหลเข้ามาเยอะๆ (ทีละ 10-25 คน)
          if (prev < 480) {
            return prev + Math.floor(Math.random() * 15) + 10;
          }

          // พอคนเยอะแล้ว ให้แกว่งๆ อยู่แถวๆ 480-510 (Simulation ธรรมชาติ)
          const wobble = Math.floor(Math.random() * 9) - 4; // -4 ถึง +4
          return Math.max(480, prev + wobble);
        } else {
          // --- โหมดปกติ ---
          const change = Math.floor(Math.random() * 5) - 2; // -2 ถึง +2
          return Math.max(100, prev + change);
        }
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const totalCount = count + extra;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="absolute bottom-8 sm:bottom-12 left-0 right-0 flex justify-center z-20 pointer-events-none select-none"
    >
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
        <div className="flex items-center gap-2">
          {/* เพิ่ม Animation กระพริบให้จุดเขียวดูตื่นเต้นขึ้น */}
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
          />
          <span className="text-xs text-zinc-300 font-bold tracking-wider">LIVE</span>
        </div>

        <div className="w-px h-3 bg-white/10" />

        <div className="flex items-center gap-1.5">
          <Users className="w-3 h-3 text-zinc-400" />
          <span className="text-xs tabular-nums text-zinc-300 font-medium w-16 text-right">
            {totalCount.toLocaleString()} watching
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function TimeCapsule() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isNewYear, setIsNewYear] = useState(false);

  // State ใหม่สำหรับเช็คว่าเหลือแค่วินาทีหรือยัง
  const [isFinalCountdown, setIsFinalCountdown] = useState(false);
  const [forceNewYear, setForceNewYear] = useState(false);

  const confettiTriggered = useRef(false);

  // Refs สำหรับเสียง
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const fireworkAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedSecond = useRef<number | null>(null); // กันเสียงเล่นซ้ำในวิเดิม

  // Init Audio
  useEffect(() => {
    tickAudioRef.current = new Audio("/sounds/tick.mp3");
    fireworkAudioRef.current = new Audio("/sounds/firework.mp3");

    // Preload เสียงเพื่อไม่ให้ดีเลย์
    tickAudioRef.current.load();
    fireworkAudioRef.current.load();
  }, []);

  // Subscribe to Admin Commands
  // Refs to track last triggered timestamps
  const lastFireworksTime = useRef<string | null>(null);
  const lastSoundTime = useRef<string | null>(null);

  // Subscribe to Admin Commands
  // State for simulated target time
  const [simulationTarget, setSimulationTarget] = useState<string | null>(null);

  // Subscribe to Admin Commands
  useEffect(() => {
    // โหลดค่าเริ่มต้น
    supabase.from('settings').select('*').single().then(({ data }) => {
      if (data) {
        setForceNewYear(data.is_force_new_year);
        setSimulationTarget(data.simulation_timestamp);
        // Initialize timestamp refs to prevent triggering on load
        lastFireworksTime.current = data.trigger_fireworks;
        lastSoundTime.current = data.test_sound;
      }
    });

    const channel = supabase.channel('command-channel')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload) => {
        const newData = payload.new;

        // 1. Force New Year
        setForceNewYear(newData.is_force_new_year);

        // 4. Time Simulation
        setSimulationTarget(newData.simulation_timestamp);

        // 2. Manual Fireworks - Only trigger if timestamp CHANGED
        if (newData.trigger_fireworks && newData.trigger_fireworks !== lastFireworksTime.current) {
          lastFireworksTime.current = newData.trigger_fireworks;
          triggerFireworks();
          (fireworkAudioRef.current?.cloneNode() as HTMLAudioElement).play().catch(() => { });
        }

        // 3. Test Sound - Only trigger if timestamp CHANGED
        if (newData.test_sound && newData.test_sound !== lastSoundTime.current) {
          lastSoundTime.current = newData.test_sound;
          (tickAudioRef.current?.cloneNode() as HTMLAudioElement).play().catch(() => { });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Logic เสียง Effect
  useEffect(() => {
    // 1. ถ้าเข้าสู่ปีใหม่ และยังไม่เคยเล่นเสียงพลุ
    if (isNewYear) {
      const playFirework = () => {
        const sound = fireworkAudioRef.current?.cloneNode() as HTMLAudioElement;
        sound?.play().catch(() => { });
      };

      playFirework();
      setTimeout(playFirework, 6000);
      setTimeout(playFirework, 12000);
      return;
    }

    // 2. ถ้าอยู่ในช่วง 10 วินาทีสุดท้าย และยังไม่ปีใหม่
    if (isFinalCountdown && timeLeft.seconds <= 10 && timeLeft.seconds > 0) {
      // เช็คว่าวินาทีนี้เล่นเสียงไปหรือยัง (กันเล่นซ้ำเพราะ re-render)
      if (lastPlayedSecond.current !== timeLeft.seconds) {
        // Clone node เพื่อให้เล่นเสียงซ้อนกันได้ (เผื่อวิเก่ายังไม่จบ)
        const sound = tickAudioRef.current?.cloneNode() as HTMLAudioElement;
        sound?.play().catch(() => { });
        lastPlayedSecond.current = timeLeft.seconds;
      }
    }
  }, [timeLeft.seconds, isFinalCountdown, isNewYear]);

  const triggerFireworks = () => {
    const duration = 20 * 1000;
    const animationEnd = Date.now() + duration;

    // ฟังก์ชันสุ่มช่วงตัวเลข
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 100;

      // Pulse fireworks from random positions in the top half
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 100,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2 // Start slightly above visible area or top
        },
        colors: ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#ee82ee"],
        shapes: ['circle', 'square'],
      });

      // Add some "glitter"
      confetti({
        startVelocity: 45,
        spread: 100,
        ticks: 90,
        zIndex: 100,
        particleCount: 50,
        origin: {
          x: randomInRange(0.2, 0.8),
          y: Math.random() * 0.5 // Top half
        },
        colors: ["#FFD700", "#FFFFFF"], // Gold and White
        shapes: ['circle'],
        scalar: 0.5
      });

    }, 800); // Burst every 0.8s
  };

  const calculateTimeLeft = useCallback(() => {
    // ถ้า Admin สั่ง Force ให้ return 0 หมดเลย
    if (forceNewYear) {
      setIsNewYear(true);
      if (!confettiTriggered.current) {
        confettiTriggered.current = true;
        triggerFireworks();
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Use simulated target if available, otherwise default to Thailand New Year 2026
    // If using simulation, we treat it as UTC time string directly or ensure it has offset if generated by Date.toISOString()
    const targetString = simulationTarget || "2026-01-01T00:00:00+07:00";
    const targetDate = new Date(targetString).getTime();

    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      setIsNewYear(true);
      if (!confettiTriggered.current) {
        confettiTriggered.current = true;
        triggerFireworks();
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Reset new year state if time is positive (e.g. admin toggled back)
    if (isNewYear && difference > 0) {
      setIsNewYear(false);
      confettiTriggered.current = false;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // เช็ค Logic ว่าเหลือแค่วินาทีหรือยัง (วัน=0, ชม=0, นาที=0, วิ>0)
    const isFinal = days === 0 && hours === 0 && minutes === 0 && seconds > 0;
    setIsFinalCountdown(isFinal);

    return { days, hours, minutes, seconds };
  }, [forceNewYear, isNewYear, simulationTarget]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-col items-center justify-center relative z-10 w-full"
    >
      <AnimatePresence mode="wait">
        {isNewYear ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-center relative z-10"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="mb-4"
            >
              <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-amber-400" />
            </motion.div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black celebration-text bg-gradient-to-r from-blue-400 via-amber-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              WELCOME 2026
            </h2>
            <p className="mt-8 text-white/80 text-xl sm:text-2xl font-light">
              🎉 ขอให้ปี 2026 เป็นปีที่ดีของชาวบวรฯ ทุกคน! <br />
              <span className="text-base opacity-70 mt-2 block">- สภานักเรียน BBV -</span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="countdown"
            layout // เพิ่ม layout prop เพื่อให้ Framer Motion จัดตำแหน่งให้อัตโนมัติเวลา item หาย
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center w-full"
          >
            {/* Logic การแสดงผล: ถ้าเป็น Final Countdown ให้โชว์แค่ Seconds แบบ Giant */}

            {!isFinalCountdown && (
              /* ส่วนปกติ: แสดงครบทุกหน่วย */
              <motion.div
                className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8"
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
              >
                <TimeUnit value={formatTimeUnit(timeLeft.days)} label="วัน" />
                <Separator />
                <TimeUnit value={formatTimeUnit(timeLeft.hours)} label="ชั่วโมง" />
                <Separator />
                <TimeUnit value={formatTimeUnit(timeLeft.minutes)} label="นาที" />
                <Separator />
              </motion.div>
            )}

            {/* ส่วนวินาที: แยกออกมาเพื่อควบคุมแยก */}
            <motion.div
              layout // ให้มันเลื่อนตำแหน่ง smooth
              className={cn(isFinalCountdown ? "fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50" : "")}
            >
              <TimeUnit
                value={formatTimeUnit(timeLeft.seconds)}
                label={isFinalCountdown ? "FINAL SECONDS" : "วินาที"}
                isGiant={isFinalCountdown} // ส่ง prop ไปบอกว่าให้ใหญ่
              />
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {!isNewYear && !isFinalCountdown && (
        <p className="mt-12 text-zinc-500 text-sm sm:text-base text-center relative z-10 uppercase tracking-[0.2em] font-medium">
          Counting down to January 1, 2026
        </p>
      )}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-blue-500/30">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <Header />

      {/* Main Content Area */}
      <main className="relative z-10 h-screen flex flex-col items-center justify-center w-full max-w-[100vw] overflow-hidden">
        <div className="w-full flex justify-center">
          <TimeCapsule />
        </div>
      </main>

      <FooterStats />
    </div>
  );
}
