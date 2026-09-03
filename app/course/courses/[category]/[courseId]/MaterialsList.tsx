"use client";

import { useMemo, useState } from "react";

type Document = { id: string; title: string; originalName: string };

export default function MaterialsList({ documents }: { documents: Document[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter(
      (d) => d.title.toLowerCase().includes(q) || d.originalName.toLowerCase().includes(q),
    );
  }, [documents, query]);

  if (documents.length === 0) {
    return <p className="text-sm text-parchment-500">No materials posted yet.</p>;
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search materials..."
        className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-parchment-500">No materials match &quot;{query}&quot;.</p>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
          {filtered.map((doc) => (
            <a
              key={doc.id}
              href={`/course/api/files/${doc.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 hover:bg-parchment-50"
            >
              <span className="font-medium text-study-700">{doc.title}</span>
              <span className="text-xs text-parchment-500">Download</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
