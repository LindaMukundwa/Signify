import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { FingerspellCamera } from "../components/fingerspelling/FingerSpellCamera";
import { loadModel } from "../lib/classifyHandshape";

export default function FingerspellingPage() {
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState<string>("");

  useEffect(() => {
    let active = true;

    const initializeModel = async () => {
      try {
        await loadModel();

        if (active) {
          setModelReady(true);
        }
      } catch (error) {
        console.error("Model load error:", error);

        if (active) {
          setModelError("Unable to load the fingerspelling model.");
        }
      }
    };

    void initializeModel();

    return () => {
      active = false;
    };
  }, []);

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
          {!modelReady && !modelError && (
            <p className="mt-2 text-sm text-text-muted">Loading fingerspelling model...</p>
          )}
          {modelError && <p className="mt-2 text-sm text-danger">{modelError}</p>}
        </div>

        <FingerspellCamera modelReady={modelReady} />
      </main>
    </div>
  );
}