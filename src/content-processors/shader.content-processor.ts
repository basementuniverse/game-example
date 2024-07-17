import { ContentProcessor } from '@basementuniverse/content-manager';
import { ShaderCanvas } from 'shader-canvas';

export const ShaderProcessor: ContentProcessor = async (
  content,
  item
): Promise<void> => {
  const shaderCanvas = new ShaderCanvas();
  shaderCanvas.setShader(item.content as string);

  // @ts-ignore
  item.content = shaderCanvas;
};
