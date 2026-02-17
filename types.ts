export enum ThumbnailStyle {
  MR_BEAST = 'MrBeast',
  GAMING = 'Gaming',
  VLOG = 'Vlog',
  PODCAST = 'Podcast',
  MINIMALIST = 'Minimalist'
}

export interface GenerationRequest {
  title: string;
  prompt: string;
  style: ThumbnailStyle;
  referenceImage?: string; // Base64 string
  referenceImageMimeType?: string;
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  promptUsed: string;
}

export interface IconProps {
  className?: string;
  size?: number;
}