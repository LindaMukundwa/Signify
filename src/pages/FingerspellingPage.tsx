import { useEffect, useState } from "react";
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
        if (active) setModelReady(true);
      } catch (error) {
        console.error("Model load error:", error);
        if (active) setModelError("Unable to load the fingerspelling model.");
      }
    };

    void initializeModel();
    return () => { active = false; };
  }, []);

  return (
    <div className="bg-bg">
      <main className="max-w-app w-full mx-auto px-4 py-8 pb-6">
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