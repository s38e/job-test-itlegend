import React, { useState } from "react";
import { FiFileText, FiLock, FiChevronDown } from "react-icons/fi";

export interface TopicItem {
  id?: string | number;
  title: string;
  isLocked?: boolean;
  tags?: {
    text: string;
    type: "teal" | "rose" | "gray";
  }[];
}

export interface CourseTopicCardProps {
  weekTitle: string;
  description: string;
  items: TopicItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
  onItemClick?: (item: TopicItem) => void;
}

export default function CourseTopicCard({
  weekTitle,
  description,
  items,
  collapsible = false,
  defaultOpen = true,
  onItemClick,
}: CourseTopicCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={`w-full bg-white border border-[#E5E5E5] px-6 transition-all duration-300 ${
        collapsible && !isOpen ? "py-6" : "py-10"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-4 ${
          collapsible ? "cursor-pointer select-none" : ""
        }`}
        onClick={toggleOpen}
      >
        <h3 className="text-2xl font-medium text-gray-900 tracking-tight leading-none">
          {weekTitle}
        </h3>
        {collapsible && (
          <div className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <FiChevronDown
              size={24}
              className={`transform transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        )}
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          !collapsible || isOpen
            ? "grid-rows-[1fr] opacity-100 mt-6"
            : "grid-rows-[0fr] opacity-0 pointer-events-none mt-0"
        }`}
      >
        <div className="overflow-hidden">
          {description && (
            <p className="text-gray-500 text-lg leading-[1.2] mb-6">
              {description}
            </p>
          )}

          <ul className="flex flex-col">
            {items.map((item, index) => (
              <li key={item.id ?? index} className="w-full">
                <button
                  onClick={() => onItemClick?.(item)}
                  className="flex items-center gap-4 py-4.5 border-b border-[#E5E5E5] first:border-t last:border-b cursor-pointer hover:bg-neutral-50/70 transition-colors duration-150 w-full text-left bg-transparent border-x-0 border-t-0 focus:outline-none"
                  disabled={item.isLocked}
                  aria-label={`${item.title}${item.isLocked ? " (Locked)" : ""}`}
                >
                  <div className="text-neutral-500 shrink-0">
                    <FiFileText size={20} className="stroke-[1.75]" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
                    <span className="text-neutral-600 transition-colors duration-150 cursor-pointer text-base leading-snug wrap-break-word">
                      {item.title}
                    </span>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {item.tags.map((tag, tagIndex) => {
                          let bgClass = "bg-gray-50 text-gray-600";
                          if (tag.type === "teal") {
                            bgClass = "bg-[#EBFDF8] text-[#2E9D8F]";
                          } else if (tag.type === "rose") {
                            bgClass = "bg-[#FDF2F4] text-[#E15B64]";
                          }
                          return (
                            <span
                              key={tagIndex}
                              className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold tracking-wider ${bgClass}`}
                            >
                              {tag.text}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {item.isLocked && (
                    <div className="text-gray-400 shrink-0 ml-auto pl-2">
                      <FiLock size={18} className="stroke-[1.75]" />
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

