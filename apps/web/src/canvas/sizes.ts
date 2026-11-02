import type { TCanvasSize } from "@/project/types";

export const DEFAULT_CANVAS_PRESETS: TCanvasSize[] = [
	{ width: 1920, height: 1080 }, // 16:9  YouTube, desktop
	{ width: 1080, height: 1920 }, // 9:16  TikTok, Reels, Shorts
	{ width: 1080, height: 1080 }, // 1:1   Instagram square
	{ width: 1080, height: 1350 }, // 4:5   Instagram / Facebook portrait
	{ width: 1440, height: 1080 }, // 4:3   Classic
	{ width: 1080, height: 1440 }, // 3:4   Portrait
	{ width: 2560, height: 1080 }, // 21:9  Ultrawide / cinematic
	{ width: 1620, height: 1080 }, // 3:2   Photo
	{ width: 1080, height: 1620 }, // 2:3   Pinterest
];

export const DEFAULT_CANVAS_SIZE: TCanvasSize = { width: 1920, height: 1080 };
