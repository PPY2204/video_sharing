/**
 * Video Assets Helper
 * Maps video identifiers from database to local asset files
 */

// Local video assets mapping
const VIDEO_ASSETS: Record<string, any> = {
  video1: require("@/assets/video/video1.mp4"),
  video2: require("@/assets/video/video2.mp4"),
  video3: require("@/assets/video/video3.mp4"),
};

/**
 * Get video source from URL or local identifier
 * @param videoUrl - Can be a URL string or local identifier like "video1"
 * @returns Video source suitable for Video component
 */
export function getVideoSource(videoUrl: string | undefined): any {
  if (!videoUrl) return null;

  // If it's a URL (starts with http), return as URI
  if (videoUrl.startsWith("http")) {
    return { uri: videoUrl };
  }

  // If it's a local identifier, return the require'd asset
  if (VIDEO_ASSETS[videoUrl]) {
    return VIDEO_ASSETS[videoUrl];
  }

  // Fallback: try to parse as URI
  return { uri: videoUrl };
}

/**
 * Check if video is a local asset
 */
export function isLocalVideo(videoUrl: string | undefined): boolean {
  if (!videoUrl) return false;
  return !videoUrl.startsWith("http") && !!VIDEO_ASSETS[videoUrl];
}
