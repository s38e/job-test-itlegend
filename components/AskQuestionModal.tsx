import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AskQuestionModal({
  isOpen,
  onClose,
}: AskQuestionModalProps) {
  const [questionTitle, setQuestionTitle] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("draft_question_title") || "";
    }
    return "";
  });
  const [questionDetails, setQuestionDetails] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("draft_question_details") || "";
    }
    return "";
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("draft_question_title", questionTitle);
  }, [questionTitle]);

  useEffect(() => {
    sessionStorage.setItem("draft_question_details", questionDetails);
  }, [questionDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionDetails.trim()) return;

    setIsSubmitted(true);

    setQuestionTitle("");
    setQuestionDetails("");
    sessionStorage.removeItem("draft_question_title");
    sessionStorage.removeItem("draft_question_details");

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] font-cairo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5]">
              <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Ask a Question
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-[#EBFDF8] text-[#2E9D8F] rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">
                    Question Submitted!
                  </h4>
                  <p className="text-gray-500">
                    Your question has been posted to the course discussions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="question-title" className="text-base font-medium text-gray-700">
                      Question Title
                    </label>
                    <input
                      id="question-title"
                      type="text"
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                      placeholder="e.g., How to handle nested flexbox centering?"
                      className="w-full p-4 bg-white border border-[#E5E5E5] rounded-lg outline-none focus:border-[#3CAEA3] text-gray-700 text-base placeholder-gray-400 transition-colors duration-200"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="question-details" className="text-base font-medium text-gray-700">
                      Details
                    </label>
                    <textarea
                      id="question-details"
                      value={questionDetails}
                      onChange={(e) => setQuestionDetails(e.target.value)}
                      placeholder="Write details about your question..."
                      rows={6}
                      className="w-full p-4 bg-white border border-[#E5E5E5] rounded-lg outline-none focus:border-[#3CAEA3] text-gray-700 text-base placeholder-gray-400 resize-none transition-colors duration-200"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#E5E5E5]">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-3 border border-[#E5E5E5] hover:bg-gray-50 text-gray-700 font-semibold text-base rounded-md transition-colors duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 bg-[#3CAEA3] hover:bg-[#329a8f] active:scale-[0.98] text-white font-semibold text-base py-3 px-6 rounded-md transition-all duration-200 cursor-pointer"
                    >
                      <span>Submit Question</span>
                      <span className="text-lg leading-none">&rarr;</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
