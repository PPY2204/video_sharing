/**
 * Video Compression Service
 * Compress videos before upload to reduce file size and improve upload speed
 */

import { getInfoAsync } from "expo-file-system/legacy";

export interface CompressionOptions {
  quality?: "low" | "medium" | "high";
  maxDuration?: number;
  maxSize?: number; // in MB
}

interface VideoInfo {
  uri: string;
  size: number;
  duration: number;
}

const MAX_VIDEO_SIZE_MB = 50; // Supabase free tier limit
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export const videoCompressionService = {
  /**
   * Get video file info
   */
  async getVideoInfo(uri: string): Promise<VideoInfo> {
    try {
      const fileInfo = await getInfoAsync(uri);

      if (!fileInfo.exists) {
        throw new Error("Video file not found");
      }

      return {
        uri,
        size: fileInfo.size || 0,
        duration: 0,
      };
    } catch (error) {
      throw new Error("Failed to get video info");
    }
  },

  /**
   * Check if video exceeds size limit
   */
  exceedsLimit(size: number): boolean {
    return size > MAX_VIDEO_SIZE_BYTES;
  },

  /**
   * Check if video needs compression
   */
  needsCompression(size: number, maxSize: number = 30): boolean {
    const sizeInMB = size / (1024 * 1024);
    return sizeInMB > maxSize;
  },

  /**
   * Validate video before upload
   */
  async validateVideo(
    uri: string
  ): Promise<{ valid: boolean; message?: string; size?: number }> {
    try {
      const info = await this.getVideoInfo(uri);

      if (info.size === 0) {
        return { valid: false, message: "Video file is empty" };
      }

      if (this.exceedsLimit(info.size)) {
        const sizeMB = this.formatFileSize(info.size);
        return {
          valid: false,
          message: `Video is too large (${sizeMB}). Maximum size is ${MAX_VIDEO_SIZE_MB}MB. Please record a shorter video.`,
          size: info.size,
        };
      }

      return { valid: true, size: info.size };
    } catch (error) {
      return { valid: false, message: "Failed to validate video" };
    }
  },

  /**
   * Get optimal compression settings based on video size
   */
  getCompressionSettings(size: number): CompressionOptions {
    const sizeInMB = size / (1024 * 1024);

    if (sizeInMB < 20) {
      return { quality: "high" };
    } else if (sizeInMB < 50) {
      return { quality: "medium" };
    } else {
      return { quality: "low" };
    }
  },

  /**
   * Estimate compressed size (rough approximation)
   */
  estimateCompressedSize(
    originalSize: number,
    quality: "low" | "medium" | "high"
  ): number {
    const compressionRatios = {
      low: 0.3, // 70% reduction
      medium: 0.5, // 50% reduction
      high: 0.7, // 30% reduction
    };

    return Math.floor(originalSize * compressionRatios[quality]);
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  },
};
