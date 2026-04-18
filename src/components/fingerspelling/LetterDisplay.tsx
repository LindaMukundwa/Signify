import React from "react";

interface LetterDisplayProps {
  letter: string | null;
  confidence: number;
  isMotionLetter: boolean;
}

export const LetterDisplay: React.FC<LetterDisplayProps> = ({
  letter,
  confidence,
  isMotionLetter,
}) => {
  return (
    <div className="text-center space-y-6">
      {letter ? (
        <>
          <div className="text-9xl font-bold text-primary select-none">
            {letter}
          </div>

          {isMotionLetter && (
            <div className="p-3 bg-warning/10 border border-warning rounded">
              <p className="text-sm text-warning font-semibold">
                {letter === "J" || letter === "Z" ? letter : "This letter"} requires motion
              </p>
            </div>
          )}

          {/* Confidence Bar */}
          <div className="space-y-2">
            <p className="text-sm text-text-muted">
              Confidence: {Math.round(confidence * 100)}%
            </p>
            <div className="w-full bg-surface-secondary rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-200"
                style={{ width: `${Math.min(confidence * 100, 100)}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="py-16 space-y-4">
          <p className="text-4xl text-text-muted">✋</p>
          <p className="text-text-muted text-lg">Show your hand</p>
        </div>
      )}
    </div>
  );
};