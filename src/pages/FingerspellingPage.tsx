import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { FingerspellCamera } from "../components/fingerspelling/FingerSpellCamera";

export default function FingerspellingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-app mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-secondary transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="text-xl font-semibold text-text-primary">Fingerspelling</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-app w-full mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <p className="text-text-secondary">
            Please hold your hand in front of the camera to recognize ASL letters in real-time.
          </p>
        </div>

        <FingerspellCamera />
      </main>
    </div>
  );
}