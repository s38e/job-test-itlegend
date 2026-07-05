"use client";

import React from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  initialProgress: number;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  progress: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardModal({
  isOpen,
  onClose,
  courseTitle,
  initialProgress = 63,
}: LeaderboardModalProps) {
  const progress = initialProgress;

  const baseLeaderboard: Omit<LeaderboardUser, "isCurrentUser" | "progress">[] =
    [
      {
        rank: 1,
        name: "أحمد محمد محمود",
        avatar:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=80&h=80",
      },
      {
        rank: 2,
        name: "سارة عبد الرحمن",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80",
      },
      {
        rank: 3,
        name: "عمر خالد سليمان",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80",
      },
      {
        rank: 4,
        name: "مريم علي حسن",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80&h=80",
      },
      {
        rank: 5,
        name: "سعيد خالد (أنت)",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80&h=80",
      },
      {
        rank: 6,
        name: "يوسف هشام توفيق",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80&h=80",
      },
    ];

  const getLeaderboardData = (): LeaderboardUser[] => {
    return baseLeaderboard
      .map((user) => {
        if (user.rank === 5) {
          return {
            ...user,
            progress: progress,
            isCurrentUser: true,
          };
        }
        const progresses = { 1: 95, 2: 88, 3: 79, 4: 70, 6: 52 };
        return {
          ...user,
          progress: progresses[user.rank as keyof typeof progresses] || 50,
        };
      })
      .sort((a, b) => b.progress - a.progress)
      .map((user, idx) => ({ ...user, rank: idx + 1 }));
  };

  const getAliShaheenSpeech = (p: number) => {
    if (p <= 30) {
      return {
        text: `يا صديقي الكسل ده مش هينفع! 😴 مستواك الحالي ${p}% وده بعيد خالص عن الليدر بورد.. الكورس ده محتاج تركيزك وشدّة منك، البداية دايماً صعبة بس البطل بيكمل. يلا قوم ابدأ ووريني اسمك فوق! 💪🔥`,
        style: "border-[#F87171] bg-red-50 text-red-900",
      };
    }
    if (p <= 60) {
      return {
        text: `بداية كويسة يا صديقي بس لسه مقصر في حق نفسك! 🚀 مستواك ${p}% مش طموحنا خالص.. شد حيلك شوية كمان وركز في المحاضرات الجاية عشان الليدر بورد مستنيك فوق! 😉📈`,
        style: "border-[#FCD34D] bg-amber-50 text-amber-900",
      };
    }
    if (p <= 80) {
      return {
        text: `عظيم يا صديقي.. أداءك في الكورس ده أفضل من ${p}% من باقي الطلبة.. كمّل عايز أشوف اسمك في الليدر بورد هنا! 🤩💪`,
        style: "border-[#E5E5E5] bg-[#F5F9FA] text-[#485293]",
      };
    }
    return {
      text: `الله ينور يا صديقي! 👑 بطل والله.. أداءك استثنائي وأفضل من ${p}% من الطلبة! مكانك في الليدر بورد محجوز في الصدارة، استمر وماتوقفش! 🏆🔥`,
      style: "border-[#6abd8a]/30 bg-[#EBFDF8] text-[#2E9D8F]",
    };
  };

  const speech = getAliShaheenSpeech(progress);
  const sortedUsers = getLeaderboardData();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-[#E5E5E5] font-cairo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-6 pt-8 pb-5 flex flex-col items-center justify-center text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>

              <span className="text-sm font-medium text-[#080264] mb-1">
                {courseTitle}
              </span>
              <h3 className="text-2xl font-bold text-[#080264] tracking-tight">
                Leaderboard
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-6">
              <div
                className={`p-5 rounded-xl border text-center text-base leading-relaxed font-medium transition-all duration-300 ${speech.style}`}
                dir="rtl"
              >
                {speech.text}
              </div>

              <ul className="bg-gray-50 border border-[#E5E5E5]/60 rounded-2xl p-4 flex flex-col gap-3">
                {sortedUsers.map((user) => (
                  <li
                    key={user.name}
                    className={`flex items-center justify-between p-3.5 bg-white border rounded-xl transition-all duration-300 ${
                      user.isCurrentUser
                        ? "border-[#6abd8a] ring-1 ring-[#6abd8a]/30 scale-[1.01]"
                        : "border-[#E5E5E5]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          user.rank === 1
                            ? "bg-amber-100 text-amber-700"
                            : user.rank === 2
                              ? "bg-slate-100 text-slate-700"
                              : user.rank === 3
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.rank}
                      </span>

                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100"
                      />

                      <span
                        className={`text-sm font-semibold text-gray-800 ${
                          user.isCurrentUser ? "text-[#6abd8a]" : ""
                        }`}
                        dir="rtl"
                      >
                        {user.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            user.isCurrentUser ? "bg-[#6abd8a]" : "bg-gray-400"
                          }`}
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {user.progress}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
