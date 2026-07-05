import React, { useState, useEffect, useRef } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  pdfTitle?: string;
}

interface PDFRenderTask {
  cancel: () => void;
  promise: Promise<void>;
}

export default function PdfModal({
  isOpen,
  onClose,
  pdfUrl = "/empty.pdf",
  pdfTitle = "Course Document",
}: PdfModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<PDFRenderTask | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadPdfJS = async () => {
      try {
        const globalProps = window as unknown as Record<string, unknown>;
        if (!globalProps.pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("Failed to load PDF viewer library."));
            document.body.appendChild(script);
          });
        }

        const pdfjsLib = globalProps.pdfjsLib as {
          GlobalWorkerOptions: { workerSrc: string };
          getDocument: (url: string) => {
            promise: Promise<{
              getPage: (pageNo: number) => Promise<{
                getViewport: (params: { scale: number }) => {
                  width: number;
                  height: number;
                };
                render: (params: {
                  canvasContext: CanvasRenderingContext2D;
                  viewport: unknown;
                }) => PDFRenderTask;
              }>;
            }>;
          };
        };
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const viewport = page.getViewport({ scale: 2.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "auto";

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        setIsLoading(false);
      } catch (err) {
        console.error("PDF render error:", err);
        setError("Could not render PDF document.");
        setIsLoading(false);
      }
    };

    loadPdfJS();

    return () => {
      setIsLoading(true);
      setError(null);
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [isOpen, pdfUrl]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white w-full h-full max-w-4xl max-h-[92vh] rounded-2xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-100 bg-white">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#3CAEA3] uppercase tracking-wider mb-0.5">
                  Reference Material
                </span>
                <h3 className="text-lg font-semibold text-neutral-800 tracking-tight leading-none">
                  {pdfTitle}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-full transition-all cursor-pointer flex items-center justify-center"
                aria-label="Close viewer"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="flex-1 bg-white overflow-auto p-4 md:p-8 flex justify-center items-start min-h-0 relative">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10">
                  <FiLoader className="animate-spin text-[#3CAEA3]" size={36} />
                  <span className="text-sm text-neutral-400 font-medium animate-pulse">
                    Rendering PDF...
                  </span>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white z-10 text-center px-6">
                  <p className="text-sm text-red-500 font-medium">{error}</p>
                  <button
                    onClick={onClose}
                    className="text-xs text-neutral-500 hover:underline mt-2 cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}

              <div className="w-full max-w-2xl bg-white rounded-lg overflow-hidden border border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                <canvas ref={canvasRef} className="block w-full bg-white" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
