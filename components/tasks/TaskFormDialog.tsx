"use client";

import type { ReactNode } from "react";
import { XIcon } from "@/components/layout/icons";

export function TaskFormDialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 md:flex md:items-center md:justify-center md:p-4"
      onClick={onClose}
    >
      <div
        className="h-full w-full overflow-y-auto bg-white p-6 md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-lg md:shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-combat-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-sand-500 hover:bg-sand-100 hover:text-sand-800"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
