import { GoogleGenAI } from "@google/genai";
import { GenerationRequest, ThumbnailStyle } from "../types";

const getStylePrompt = (style: ThumbnailStyle, title: string, userPrompt: string): string => {
  // Enhanced realism boost with specific camera gear and rendering terms for maximum fidelity
  const realismBoost = "photorealistic, 8k uhd, highly detailed, shot on Sony A7R IV, 85mm lens, f/1.8, sharp focus, professional photography, cinematic lighting, raw photo quality, skin texture, visible pores, subsurface scattering, hyper-realistic, masterpiece, ray tracing, global illumination";
  
  // Explicit constraints to avoid common AI artifacts and unwanted elements
  const negativePrompt = "Ensure the image is pristine. Exclude: blurry, low quality, extra people, cluttered background, small text, watermark, logo, distorted faces, bad anatomy, cartoonish, low resolution, pixelated, grain, noise.";

  const base = `Create a professional, viral YouTube thumbnail for a video titled "${title}". ${userPrompt}`;
  
  let styleDescription = "";

  switch (style) {
    case ThumbnailStyle.MR_BEAST:
      styleDescription = `Style: MrBeast. ${realismBoost}. Hyper-realistic composite. Close-up of a person with an exaggerated shocked or excited expression (wide eyes, open mouth). High saturation, high contrast. Bright, vibrant background with high stakes elements (money, explosion, luxury). Studio lighting with strong rim light. Clear separation between subject and background.`;
      break;
    case ThumbnailStyle.GAMING:
      styleDescription = `Style: Gaming. ${realismBoost}. 3D render style mixed with real photography. Intense action, neon lighting (purple, blue, red), esports tournament atmosphere. Character or player in focus with glowing effects. Detailed textures.`;
      break;
    case ThumbnailStyle.VLOG:
      styleDescription = `Style: Vlog. ${realismBoost}. Lifestyle photography, golden hour lighting, authentic emotion. Wide angle shot, GoPro or high-end mirrorless aesthetic. Travel or daily life setting. Bokeh background, natural skin tones.`;
      break;
    case ThumbnailStyle.PODCAST:
      styleDescription = `Style: Podcast. ${realismBoost}. Professional studio setting. Two or more subjects engaging in deep conversation. Warm, rich lighting. Microphones clearly visible. Depth of field. Serious and intellectual atmosphere.`;
      break;
    case ThumbnailStyle.MINIMALIST:
      styleDescription = `Style: Minimalist. ${realismBoost}. Clean composition, solid or gradient background, high contrast subject. Bold, simple elements. Negative space. Modern design, Apple advertisement aesthetic.`;
      break;
    default:
      styleDescription = `${realismBoost}`;
      break;
  }

  return `${base}. ${styleDescription} ${negativePrompt}`;
};

export const generateThumbnails = async (request: GenerationRequest, count: number = 3): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const fullPrompt = getStylePrompt(request.style, request.title, request.prompt);
    
    // Switch to the standard Flash model to avoid Pro-only billing requirements
    const model = 'gemini-2.5-flash-image';

    const promises = Array.from({ length: count }).map(async () => {
      const parts: any[] = [];
      
      // If a reference image is provided, add it to the parts
      if (request.referenceImage && request.referenceImageMimeType) {
        // Strip the data:image/xyz;base64, prefix if present for the API call
        const base64Data = request.referenceImage.split(',')[1] || request.referenceImage;
        
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: request.referenceImageMimeType,
          },
        });
        
        parts.push({
          text: `${fullPrompt} Use the person in the provided image as the main subject. Maintain their facial features and likeness exactly but adapt the lighting and expression to match the requested style. Blend them seamlessly into the scene.`,
        });
      } else {
        parts.push({
          text: fullPrompt,
        });
      }

      // Call the API
      const response = await ai.models.generateContent({
        model: model,
        contents: {
          parts: parts,
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            // imageSize is removed as it is not supported by gemini-2.5-flash-image
          }
        },
      });

      // Extract image from response
      if (response.candidates && response.candidates.length > 0) {
        const content = response.candidates[0].content;
        if (content && content.parts) {
          for (const part of content.parts) {
            if (part.inlineData && part.inlineData.data) {
              return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            }
          }
        }
      }
      
      throw new Error("No image data found in response");
    });

    const results = await Promise.all(promises);
    return results;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};