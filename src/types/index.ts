export type MotionStyle = 'magnates' | 'fern' | 'vox';

export type NvidiaModel = 
  | 'deepseek-ai/deepseek-r1'
  | 'meta/llama-3.3-70b-instruct'
  | 'qwen/qwen2.5-coder-32b-instruct'
  | 'nvidia/llama-3.1-nemotron-70b-instruct';

export interface ShotDirection {
  id: string;
  timestamp: string; // e.g. "0:00 - 0:06"
  title: string;
  sceneType: 'parallax' | 'newspaper' | 'kinetic-stat' | 'conspiracy-board' | 'map';
  narration: string;
  visualPrompt: string;
  cameraMovement: string; // e.g. "Slow 2.5D push-in on subject eye line"
  sfx: string; // e.g. "Cinematic boom + analog vinyl crackle"
  headlineText?: string;
  statValue?: string;
  statLabel?: string;
  remotionComponent?: string;
}

export interface DocumentaryProject {
  id: string;
  title: string;
  channel: string; // "@byrook_tv"
  topic: string;
  style: MotionStyle;
  model: NvidiaModel;
  hookFormula: string;
  totalDurationSeconds: number;
  thinkingTrace?: string;
  fullScript: string;
  shots: ShotDirection[];
  createdAt: number;
}
