import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { overlayVariants, panelVariants } from "@/animations";
import { useUI } from "@/providers/UIProvider";
import { useSupabaseAuth } from "@/SupabaseProvider";
import { useSubmitBugReport } from "@/hooks/useSubmitBugReport";
import { cn } from "@/utils/cn";

const ReportBugModal = () => {
  const { showReportBug, toggleReportBug } = useUI();
  const { user } = useSupabaseAuth();
  const { mutateAsync, isPending, isSuccess, reset } = useSubmitBugReport();

  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (showReportBug) {
      setFrom((prev) => prev || user?.email || "");
    } else {
      setSubject("");
      setDescription("");
      setSubmitError(null);
      reset();
    }
  }, [showReportBug, user?.email, reset]);

  const closeModal = () => {
    toggleReportBug();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      setSubmitError("Please add a brief description of the issue.");
      return;
    }

    try {
      await mutateAsync({
        from: from.trim() || undefined,
        subject: subject.trim() || undefined,
        description: trimmedDescription,
        attachments: [],
      });
      setSubject("");
      setDescription("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit bug report.";
      setSubmitError(message);
    }
  };

  return (
    <AnimatePresence>
      {showReportBug && (
        <div className="fixed inset-0 z-30 flex items-end justify-center px-4 py-6 sm:items-center">
          <motion.div
            className="absolute inset-0 bg-neutral-950/30"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            onClick={closeModal}
          />
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-bug-title"
            className="relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-3xl border p-6 shadow-2xl border-gray-300 bg-white text-gray-900"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Picodia
                </p>
                <h2 id="report-bug-title" className="text-xl font-semibold leading-tight">
                  Report a Bug
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Tell us what happened so we can look into it.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 transition hover:bg-gray-100 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold text-gray-700">From (optional)</span>
                <input
                  type="email"
                  name="from"
                  autoComplete="email"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold text-gray-700">Subject (optional)</span>
                <input
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none"
                  placeholder="What were you doing?"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-gray-700">Description</span>
              <textarea
                name="description"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-28 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-gray-500 focus:outline-none"
                placeholder="What went wrong? What did you expect to happen?"
              />
            </label>

            {submitError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </div>
            )}
            {isSuccess && !submitError && (
              <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                Thanks! Your report has been sent.
              </div>
            )}

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:w-32 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !description.trim()}
                className={cn(
                  "w-full rounded-full px-4 py-2 text-sm font-semibold text-white transition sm:w-36 bg-gray-800 hover:bg-gray-700 cursor-pointer",
                  isPending || !description.trim() ? "opacity-70 cursor-not-allowed" : ""
                )}
              >
                {isPending ? "Sending…" : "Send Report"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReportBugModal;
