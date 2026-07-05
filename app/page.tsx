"use client";
import React, { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import CourseTopicCard from "@/components/CourseTopicCard";
import CourseVideoPlayer from "@/components/CourseVideoPlayer";
import {
  FiBookOpen,
  FiMessageSquare,
  FiHelpCircle,
  FiClock,
  FiBook,
  FiUser,
  FiGlobe,
} from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import CourseComments from "@/components/CourseComments";
import AskQuestionModal from "@/components/AskQuestionModal";
import LeaderboardModal from "@/components/LeaderboardModal";
import PdfModal from "@/components/PdfModal";

const courseWeeks = [
  {
    weekTitle: "Week 1-4",
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    items: [
      { title: "Introduction", isLocked: true },
      { title: "Course Overview", isLocked: true },
      {
        title: "Course Overview",
        isLocked: false,
        tags: [
          { text: "0 QUESTION", type: "teal" as const },
          { text: "10 MINUTES", type: "rose" as const },
        ],
      },
      { title: "Course Exercise / Reference Files", isLocked: true },
      {
        title: "Code Editor Installation (Optional if you have one)",
        isLocked: true,
      },
      { title: "Embedding PHP in HTML", isLocked: true },
    ],
  },
  {
    weekTitle: "Week 5-8",
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    items: [
      { title: "Defining Functions", isLocked: true },
      { title: "Functions Parameters", isLocked: true },
      {
        title: "Return Values From Functions",
        isLocked: false,
        tags: [
          { text: "2 QUESTIONS", type: "teal" as const },
          { text: "15 MINUTES", type: "rose" as const },
        ],
      },
      { title: "Global Variables and Scope", isLocked: true },
      {
        title: "Newer Way of creating a Constant",
        isLocked: true,
      },
      { title: "Constants", isLocked: true },
    ],
  },
  {
    weekTitle: "Week 5-8",
    description:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    items: [
      { title: "Defining Functions", isLocked: true },
      { title: "Functions Parameters", isLocked: true },
      {
        title: "Return Values From Functions",
        isLocked: false,
        tags: [
          { text: "2 QUESTIONS", type: "teal" as const },
          { text: "15 MINUTES", type: "rose" as const },
        ],
      },
      { title: "Global Variables and Scope", isLocked: true },
      {
        title: "Newer Way of creating a Constant",
        isLocked: true,
      },
      { title: "Constants", isLocked: true },
    ],
  },
];

const sections = [
  {
    icon: FiBookOpen,
    targetId: "curriculum-section",
  },
  {
    icon: FiMessageSquare,
    targetId: "comments-section",
  },
  {
    icon: FiHelpCircle,
    action: "ask-question",
  },
  {
    icon: FaTrophy,
    action: "leaderboard",
  },
];

const infoItems = [
  { icon: FiClock, label: "Duration:", value: "3 weeks" },
  { icon: FiBook, label: "Lessons:", value: "8" },
  { icon: FiUser, label: "Enrolled:", value: "65 students" },
  { icon: FiGlobe, label: "Language:", value: "English" },
];

export default function Home() {
  const [isWide, setIsWide] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedPdfTitle, setSelectedPdfTitle] = useState("");
  return (
    <main className="flex flex-col w-full max-w-[2000px] mx-auto gap-10 pb-20">
      <div className="flex flex-col w-full gap-10 bg-[#F5F9FA] py-5 px-8">
        <div className="text-foreground/80 flex items-center gap-1">
          <button className="cursor-pointer hover:underline">Home</button>{" "}
          <MdKeyboardArrowRight size={20} />{" "}
          <button className="cursor-pointer hover:underline">Courses</button>{" "}
          <MdKeyboardArrowRight size={20} />{" "}
          <button className="cursor-pointer hover:underline text-foreground">
            Course Details
          </button>
        </div>
        <h1 className="text-4xl font-semibold">Starting SEO as your Home</h1>
      </div>
      <div className="grid grid-cols-12 gap-10 lg:gap-20 px-8">
        <div className={`col-span-12 ${isWide ? "md:col-span-12 md:row-start-1" : "md:col-span-8 md:row-start-1"} order-1`}>
          <CourseVideoPlayer isWide={isWide} onWideToggle={() => setIsWide(!isWide)} />
        </div>

        <div className="col-span-12 md:col-span-8 flex flex-col gap-16 md:row-start-2 order-2">
          <div className="flex flex-col gap-8 w-full">
            <nav className="w-full flex flex-wrap items-center gap-3" aria-label="Course section navigation">
              {sections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if ("targetId" in section && section.targetId) {
                        document
                          .getElementById(section.targetId)
                          ?.scrollIntoView({ behavior: "smooth" });
                      } else if (
                        "action" in section &&
                        section.action === "ask-question"
                      ) {
                        setIsQuestionModalOpen(true);
                      } else if (
                        "action" in section &&
                        section.action === "leaderboard"
                      ) {
                        setIsLeaderboardOpen(true);
                      }
                    }}
                    className="flex items-center justify-center p-2 rounded-full border border-[#E5E5E5] text-[#808080] cursor-pointer hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-200"
                    aria-label={
                      "targetId" in section && section.targetId
                        ? `Scroll to ${section.targetId.replace("-section", "")}`
                        : "action" in section && section.action === "ask-question"
                        ? "Ask a question"
                        : "View leaderboard"
                    }
                  >
                    <div className="p-1.5 rounded-md shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-col gap-8 w-full">
            <h3 className="text-3xl font-medium">Course Materials</h3>
            <div className="w-full bg-white rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-10 md:gap-20 shadow-[0_4px_30px_rgba(0,0,0,0.06)] items-start">
              <ul className="flex flex-col w-full flex-1 divide-y divide-[#E5E5E5]">
                {infoItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-neutral-800 stroke-[1.75]" />
                        <span className="text-base md:text-lg text-neutral-600 font-normal">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-base md:text-lg text-neutral-800 font-medium">
                        {item.value}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <ul className="flex flex-col w-full flex-1 divide-y divide-[#E5E5E5]">
                {infoItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-neutral-800 stroke-[1.75]" />
                        <span className="text-base md:text-lg text-neutral-600 font-normal">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-base md:text-lg text-neutral-800 font-medium">
                        {item.value}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className={`col-span-12 md:col-span-4 md:col-start-9 min-h-96 flex flex-col w-full gap-18 ${isWide ? "md:row-start-2 md:row-span-2" : "md:row-start-1 md:row-span-3"} order-3`}>
          <h2
            id="curriculum-section"
            className="text-3xl font-medium scroll-mt-6"
          >
            Topics for This Course
          </h2>
          <span className="w-full bg-[#E6E6E6] h-1.25 relative block rounded-full">
            <span className="h-full w-[63%] block bg-[#6ABD8A] rounded-full" />
            <span className="flex items-center justify-center absolute p-1.5 bottom-[calc(100%+16px)] left-[calc(63%-(37.5167px/2))] aspect-square border-2 border-[#C8C8C8] rounded-full">
              <p className="text-sm leading-none text-[#485293] font-medium">
                You
              </p>
              <IoMdArrowDropdown className="text-[#C8C8C8] absolute top-full left-1/2 -translate-x-1/2 " />
            </span>
            <span className="absolute top-[calc(100%+7px)] left-[calc(63%-12.85px)] text-sm leading-none text-[#485293] font-medium">
              63%
            </span>
          </span>
          <div className="flex flex-col items-start w-full gap-8">
            {courseWeeks.map((week, index) => (
              <CourseTopicCard
                key={index}
                weekTitle={week.weekTitle}
                description={week.description}
                items={week.items}
                collapsible={true}
                defaultOpen={index === 0}
                onItemClick={(item) => {
                  if (!item.isLocked) {
                    setSelectedPdfTitle(item.title);
                    setIsPdfOpen(true);
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 md:row-start-3 order-4">
          <div id="comments-section" className="scroll-mt-6">
            <CourseComments />
          </div>
        </div>
      </div>
      <AskQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
      />
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        courseTitle="Starting SEO as your Home"
        initialProgress={63}
      />
      <PdfModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        pdfTitle={selectedPdfTitle}
        pdfUrl="/empty.pdf"
      />
    </main>
  );
}
