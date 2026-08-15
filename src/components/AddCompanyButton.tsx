"use client";

import { useState, useEffect } from "react";
import AddCompanyModal from "./AddCompanyModal";
import { Plus } from "lucide-react";

export default function AddCompanyButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add company</span>
        <span className="hidden sm:inline-block text-blue-200 text-xs font-normal border border-blue-400/30 rounded px-1.5 py-0.5 ml-1">⌘K</span>
      </button>

      <AddCompanyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAdded={() => {
          // The Server Action handles revalidation
          // So the list will auto-refresh
        }}
      />
    </>
  );
}
