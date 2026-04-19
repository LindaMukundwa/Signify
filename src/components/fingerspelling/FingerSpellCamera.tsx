import { useEffect, useRef, useState, useCallback, type FC } from "react";
import { classify, isMotionLetter } from "../../lib/classifyHandshape";
import { useHandDetection } from "../../hooks/useHandDetection";

const HOLD_MS = 800;

interface HeldState {
  letter: string;
  since: number;
  committed: boolean;
}

interface FingerspellCameraProps {
  modelReady: boolean;
}

export const FingerspellCamera: FC<FingerspellCameraProps> = ({ modelReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const heldRef = useRef<HeldState | null>(null);

  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [word, setWord] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        if (err instanceof DOMException) {
          if (err.name === "NotAllowedError") {
            setError("Camera permission denied. Please enable camera access.");
          } else if (err.name === "NotFoundError") {
            setError("No camera device found.");
          } else {
            setError("Could not access camera.");
          }
        }
        setHasPermission(false);
      }
    };

    void initCamera();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const onLandmarks = useCallback(
    (landmarks: number[]) => {
      if (landmarks.length !== 63) {
        setCurrentLetter(null);
        setHoldProgress(0);
        heldRef.current = null;
        return;
      }

      const result = classify(landmarks);

      if (result.confidence <= 0.85 || result.letter === "nothing") {
        setCurrentLetter(null);
        setHoldProgress(0);
        heldRef.current = null;
        return;
      }

      const l = result.letter;
      setCurrentLetter(l);

      const now = Date.now();

      if (heldRef.current?.letter !== l) {
        heldRef.current = { letter: l, since: now, committed: false };
        setHoldProgress(0);
      } else if (!heldRef.current.committed) {
        const elapsed = now - heldRef.current.since;
        const progress = Math.min((elapsed / HOLD_MS) * 100, 100);
        setHoldProgress(progress);

        if (elapsed >= HOLD_MS) {
          heldRef.current.committed = true;
          setHoldProgress(0);

          if (l === "space") {
            setWord((w) => (w.endsWith(" ") ? w : w + " "));
          } else if (l === "del") {
            setWord((w) => w.slice(0, -1));
          } else if (!isMotionLetter(l)) {
            setWord((w) => w + l);
          }
        }
      }
    },
    []
  );

  const onNoHand = useCallback(() => {
    setCurrentLetter(null);
    setHoldProgress(0);
    heldRef.current = null;
  }, []);

  useHandDetection({
    enabled: modelReady && hasPermission === true,
    videoRef,
    onLandmarks,
    onNoHand,
  });

  const showMotionWarning = currentLetter && isMotionLetter(currentLetter);
  const displayLetter =
    currentLetter && currentLetter !== "nothing" && currentLetter !== "space" && currentLetter !== "del"
      ? currentLetter
      : null;

  return (
    <div className="space-y-4">
      {/* Camera + overlay */}
      <div className="relative w-full rounded-xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full object-cover ${hasPermission ? "block" : "hidden"}`}
          style={{ aspectRatio: "4/4", maxHeight: "60vh" , alignContent: "center", borderRadius: "10%"}}
        />

        {/* Placeholder states */}
        {hasPermission === null && (
          <div
            className="w-full bg-surface-secondary flex items-center justify-center"
            style={{ aspectRatio: "4/4" }}
          >
            <p className="text-sm text-text-muted">Requesting camera…</p>
          </div>
        )}
        {hasPermission === false && (
          <div
            className="w-full bg-surface-secondary flex items-center justify-center"
            style={{ aspectRatio: "4/4" }}
          >
            <div className="text-center px-4">
              <p className="text-3xl mb-2">📷</p>
              <p className="text-sm text-danger">{error}</p>
            </div>
          </div>
        )}
        {hasPermission === true && !modelReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-white text-sm font-medium">Loading model…</p>
          </div>
        )}

        {/* Letter overlay */}
        {hasPermission === true && modelReady && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
            {displayLetter ? (
              <div className="bg-black/65 rounded-2xl px-6 py-2 flex flex-col items-center gap-1">
                <span className="text-7xl font-bold text-white leading-none select-none">
                  {displayLetter}
                </span>
              </div>
            ) : currentLetter === "space" ? (
              <div className="bg-black/65 rounded-2xl px-5 py-2">
                <span className="text-white text-sm font-semibold">SPACE</span>
              </div>
            ) : currentLetter === "del" ? (
              <div className="bg-black/65 rounded-2xl px-5 py-2">
                <span className="text-white text-sm font-semibold">DELETE</span>
              </div>
            ) : (
              <div className="bg-black/40 rounded-2xl px-4 py-2">
                <span className="text-white/60 text-sm">Show your hand ✋</span>
              </div>
            )}
          </div>
        )}

        {/* Hold progress bar */}
        {holdProgress > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-75 ease-out rounded-br-xl"
            style={{ width: `${holdProgress}%` }}
          />
        )}

        {/* Motion letter warning */}
        {showMotionWarning && (
          <div className="absolute top-3 inset-x-3">
            <div className="bg-warning/90 rounded-lg px-3 py-2 text-center">
              <p className="text-white text-xs font-semibold">
                {currentLetter} requires motion — not supported in static mode
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Word display */}
      <div className="bg-surface border border-border rounded-xl px-4 py-3 min-h-[56px] flex items-center justify-between gap-3">
        <p className="text-xl font-semibold text-text-primary tracking-wider flex-1 min-w-0 break-all">
          {word || (
            <span className="text-text-muted text-sm font-normal">
              Hold a letter for {HOLD_MS / 1000}s to commit — use SPACE and DEL gestures
            </span>
          )}
        </p>
        {word && (
          <button
            onClick={() => setWord("")}
            className="flex-shrink-0 text-xs text-text-muted hover:text-danger transition-colors font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Info card */}
      <div className="card text-sm text-text-secondary space-y-1">
        <p>
          <span className="font-semibold text-text-primary">How it works:</span>{" "}
          Hold a letter steady for {HOLD_MS / 1000}s to add it to your word. Use the{" "}
          <span className="font-semibold">SPACE</span> gesture to add a space and{" "}
          <span className="font-semibold">DEL</span> to backspace.
        </p>
        <p>Letters J and Z require motion and are not supported.</p>
      </div>
    </div>
  );
};
