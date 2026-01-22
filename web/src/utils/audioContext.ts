/**
 * Helper to create AudioContext (handles browser restrictions)
 * Must be called after user interaction
 */
export const createAudioContext = async (
  options?: AudioContextOptions & { id?: string }
): Promise<AudioContext> => {
  // Try to create immediately (works after user interaction)
  try {
    const audio = new Audio();
    audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    await audio.play();
    return new AudioContext(options);
  } catch (e) {
    // Wait for user interaction if needed
    await new Promise((resolve) => {
      window.addEventListener("pointerdown", resolve, { once: true });
      window.addEventListener("keydown", resolve, { once: true });
    });
    return new AudioContext(options);
  }
};

// Alias for compatibility
export const audioContext = createAudioContext;

/**
 * Convert ArrayBuffer to Base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
