"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadCourseDocument } from "@/app/actions/course-documents";

export default function UploadDocumentForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("courseId", courseId);

    startTransition(async () => {
      const result = await uploadCourseDocument(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h3 className="font-medium text-study-800">Upload Material</h3>
      <input
        type="text"
        name="title"
        placeholder="Document title"
        className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
        required
      />
      <input
        type="file"
        name="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.epub,.png,.jpg,.jpeg"
        className="w-full text-sm"
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-study-600 text-white text-sm px-4 py-2 hover:bg-study-700 disabled:opacity-60"
      >
        {isPending ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
