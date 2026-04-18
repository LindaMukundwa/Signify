import React, { useEffect, useRef, useState } from "react";
import { LetterDisplay } from "./LetterDisplay";
import { classifyHandshape, isMotionLetter } from "../../lib/classifyHandshape";
import { Card } from "../shared/Card";

export const FingerspellCamera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

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

          // Start inference loop
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              const processFrame = () => {
                ctx.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height);

                // Placeholder: In production, we would use MediaPipe Hands here
                // For now, we'll just show the camera feed
                const result = classifyHandshape([]);

                if (result.letter && result.confidence > 0.85) {
                  setLetter(result.letter);
                  setConfidence(result.confidence);
                } else {
                  setLetter(null);
                  setConfidence(0);
                }

                requestAnimationFrame(processFrame);
              };

              processFrame();
            }
          }
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
          {hasPermission ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-video bg-black rounded"
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="hidden"
              />
            </>
          ) : (
            <div className="w-full aspect-video bg-surface-secondary rounded flex items-center justify-center">
              <div className="text-center">
                <p className="text-text-muted mb-2">📷</p>
                {error ? (
                  <p className="text-sm text-danger">{error}</p>
                ) : (
                  <p className="text-sm text-text-muted">Requesting camera access...</p>
                )}
              </div>
            </div>
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