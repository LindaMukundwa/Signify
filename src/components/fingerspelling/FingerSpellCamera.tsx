import { useEffect, useRef, useState, type FC } from "react";
import { LetterDisplay } from "./LetterDisplay";
import { classify, isMotionLetter } from "../../lib/classifyHandshape";
import { Card } from "../shared/Card";
import { useHandDetection } from "../../hooks/useHandDetection";

interface FingerspellCameraProps {
  modelReady: boolean;
}

export const FingerspellCamera: FC<FingerspellCameraProps> = ({ modelReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  useHandDetection({
    enabled: modelReady && hasPermission === true,
    videoRef,
    onLandmarks: (landmarks) => {
      if (landmarks.length !== 63) {
        setLetter(null);
        setConfidence(0);
        return;
      }

      const result = classify(landmarks);

      if (result.confidence > 0.85) {
        setLetter(result.letter);
        setConfidence(result.confidence);
        return;
      }

      setLetter(null);
      setConfidence(0);
    },
    onNoHand: () => {
      setLetter(null);
      setConfidence(0);
    },
  });

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        if (err instanceof DOMException) {
          if (err.name === "NotAllowedError") {
            setError("Camera permission denied. Please enable camera access.");
          } else if (err.name === "NotFoundError") {
            setError("No camera device found.");
          }
        }
        setHasPermission(false);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Camera Feed */}
      <Card>
        <div className="space-y-3">
          {/* Video is always mounted so videoRef is available when getUserMedia resolves */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full aspect-video bg-black rounded ${hasPermission ? "" : "hidden"}`}
          />
          {hasPermission === null && (
            <div className="w-full aspect-video bg-surface-secondary rounded flex items-center justify-center">
              <p className="text-sm text-text-muted">Requesting camera access...</p>
            </div>
          )}
          {hasPermission === false && (
            <div className="w-full aspect-video bg-surface-secondary rounded flex items-center justify-center">
              <div className="text-center">
                <p className="text-text-muted mb-2">📷</p>
                <p className="text-sm text-danger">{error}</p>
              </div>
            </div>
          )}
          {hasPermission === true && !modelReady && (
            <p className="text-sm text-text-muted">Loading model...</p>
          )}
        </div>
      </Card>

      {/* Letter Display */}
      <LetterDisplay
        letter={letter}
        confidence={confidence}
        isMotionLetter={letter ? isMotionLetter(letter) : false}
      />

      {/* Info */}
      <Card>
        <div className="space-y-2 text-sm text-text-secondary">
          <p>
            <span className="font-semibold">How it works:</span> Hold your hand in
            front of the camera. The app will recognize ASL letters and display them
            above.
          </p>
          <p className="mt-3">
            <span className="font-semibold">Note:</span> Letters J and Z require motion
            and are not supported in this static mode.
          </p>
        </div>
      </Card>
    </div>
  );
};