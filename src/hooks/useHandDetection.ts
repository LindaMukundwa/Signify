import { useEffect } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

interface UseHandDetectionOptions {
	enabled: boolean;
	videoRef: React.RefObject<HTMLVideoElement | null>;
	onLandmarks: (landmarks: number[]) => void;
	onNoHand?: () => void;
}

export function useHandDetection({
	enabled,
	videoRef,
	onLandmarks,
	onNoHand,
}: UseHandDetectionOptions) {
	useEffect(() => {
		if (!enabled) return;

		const video = videoRef.current;
		if (!video) return;

		let cancelled = false;
		let landmarker: HandLandmarker | null = null;

		const init = async () => {
			const vision = await FilesetResolver.forVisionTasks(
				`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm`
			);

			if (cancelled) return;

			landmarker = await HandLandmarker.createFromOptions(vision, {
				baseOptions: {
					modelAssetPath:
						"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
					delegate: "GPU",
				},
				runningMode: "VIDEO",
				numHands: 1,
			});

			if (cancelled) {
				landmarker.close();
				return;
			}

			let frameCount = 0;
			const runDetection = () => {
				if (cancelled) return;

				frameCount++;
				if (
					frameCount % 3 === 0 &&
					video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
				) {
					const results = landmarker!.detectForVideo(video, performance.now());
					const hand = results.landmarks[0];

					if (hand && hand.length === 21) {
						onLandmarks(hand.flatMap((lm) => [lm.x, lm.y, lm.z]));
					} else {
						onNoHand?.();
					}
				}

				requestAnimationFrame(runDetection);
			};

			requestAnimationFrame(runDetection);
		};

		void init();

		return () => {
			cancelled = true;
			landmarker?.close();
		};
	}, [enabled, onLandmarks, onNoHand, videoRef]);
}
