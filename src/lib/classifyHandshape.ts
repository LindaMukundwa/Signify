// This is a placeholder for the TensorFlow.js model-based handshape classification
// This will be integrated with @mediapipe/hands landmarks

export interface HandShapeResult {
  letter: string | null;
  confidence: number;
}

/**

 * Classify hand landmarks into ASL letters
 * Requires landmarks from MediaPipe Hands (21 landmarks × 3 coordinates)
 */
export const classifyHandshape = (landmarks: number[][]): HandShapeResult => {
  // Placeholder implementation
  // In production, this would use a pre-trained TensorFlow.js model
  return {
    letter: null,
    confidence: 0,
  };
};

// Letters that require motion (not supported in static mode)
export const MOTION_LETTERS = ["J", "Z"];

export const isMotionLetter = (letter: string): boolean => {
  return MOTION_LETTERS.includes(letter.toUpperCase());
};
