import * as tf from "@tensorflow/tfjs";

export interface HandShapeResult {
  letter: string;
  confidence: number;
}

let model: tf.GraphModel | null = null;
let modelLoadPromise: Promise<void> | null = null;
let labels: string[] = [];

export async function loadModel() {
  if (model) {
    return;
  }

  if (!modelLoadPromise) {
    modelLoadPromise = (async () => {
      try {
        await tf.ready();
        model = await tf.loadGraphModel("/model/model.json");

        const response = await fetch("/model/label_classes.json");
        if (!response.ok) {
          throw new Error(`Failed to load label classes: ${response.status}`);
        }

        labels = await response.json();
      } catch (error) {
        model = null;
        modelLoadPromise = null;
        throw error;
      }
    })();
  }

  await modelLoadPromise;
}

export function classify(landmarks: number[]): HandShapeResult {
  if (!model) {
    throw new Error("Model not loaded");
  }

  const input = tf.tensor2d([landmarks]);
  const probs = model.predict(input) as tf.Tensor;
  const idx = probs.argMax(1).dataSync()[0];
  const confidence = probs.max().dataSync()[0];

  input.dispose();
  probs.dispose();

  return {
    letter: labels[idx] ?? "",
    confidence,
  };
}

export const classifyHandshape = classify;

export const MOTION_LETTERS = ["J", "Z"];

export const isMotionLetter = (letter: string): boolean => {
  return MOTION_LETTERS.includes(letter.toUpperCase());
};
