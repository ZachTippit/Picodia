import { useMutation } from "@tanstack/react-query";

type BugReportInput = {
  from?: string;
  subject?: string;
  description: string;
  attachments: File[];
};

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkgdqkll";
const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // guardrail in case many files are added later

const sendBugReport = async (input: BugReportInput) => {
  const formData = new FormData();

  const fallbackEmail = "anonymous@picodia.com";
  const fromValue = input.from?.trim();
  const subjectValue = input.subject?.trim();

  formData.append("email", fromValue || fallbackEmail);
  formData.append("name", fromValue || "Anonymous Picodia player");
  formData.append("subject", subjectValue || "Picodia bug report");

  const message = subjectValue
    ? `Subject: ${subjectValue}\n\n${input.description}`
    : input.description;
  formData.append("message", message);

  let totalSize = 0;
  input.attachments.forEach((file) => {
    totalSize += file.size;
    formData.append("attachments", file);
  });

  if (totalSize > MAX_TOTAL_SIZE) {
    throw new Error("Attachments exceed the maximum total size allowed.");
  }

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  const isOk = response.ok && (data?.ok || data?.success);
  if (!isOk) {
    const errorText =
      data?.errors?.map((err: { message?: string }) => err.message).filter(Boolean).join(", ") ||
      data?.message ||
      "Failed to submit bug report.";
    throw new Error(errorText);
  }

  return data;
};

export const useSubmitBugReport = () =>
  useMutation({
    mutationFn: sendBugReport,
  });
