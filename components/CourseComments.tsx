"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Comment {
  id: number;
  name: string;
  date: string;
  avatar: string;
  text: string;
}

export default function CourseComments() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Student Name Goes Here",
      date: "Oct 10, 2021",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 2,
      name: "Student Name Goes Here",
      date: "Oct 15, 2021",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 3,
      name: "Student Name Goes Here",
      date: "Oct 19, 2021",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ]);

  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      name: "You (Student)",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120",
      text: commentText,
    };

    setComments([...comments, newComment]);
    setCommentText("");
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-6 font-cairo">
      <h3 className="text-3xl font-semibold text-black tracking-tight">
        Comments
      </h3>

      <ul className="flex flex-col">
        {comments.map((comment, index) => (
          <li
            key={comment.id}
            className={`flex items-start gap-4 md:gap-5 py-6 border-b border-[#E5E5E5]/60 ${
              index === comments.length - 1 ? "border-b-0 pb-2" : ""
            }`}
          >
            <Image
              src={comment.avatar}
              alt={comment.name}
              width={64}
              height={64}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col flex-1">
              <span className="text-lg font-medium text-gray-800 leading-snug">
                {comment.name}
              </span>
              <span className="text-sm text-gray-400 mt-0.5">
                {comment.date}
              </span>
              <p className="text-gray-500 text-base mt-2.5 leading-relaxed">
                {comment.text}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <label htmlFor="course-comment-input" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="course-comment-input"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment"
          rows={5}
          className="w-full p-4 bg-white border border-[#E5E5E5] rounded-lg outline-none focus:border-[#3CAEA3] text-gray-700 text-base placeholder-gray-400 resize-none transition-colors duration-200"
        />
        <button
          type="submit"
          className="self-start flex items-center justify-center gap-2 bg-[#3CAEA3] hover:bg-[#329a8f] active:scale-[0.98] text-white font-semibold text-base py-3 px-6 rounded-md transition-all duration-200 cursor-pointer"
        >
          <span>Submit Review</span>
          <span className="text-lg leading-none">&rarr;</span>
        </button>
      </form>
    </div>
  );
}
