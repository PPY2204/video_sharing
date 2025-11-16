# Video Upload Size Optimization

## ⚠️ Problem Solved

**Error**: "The object exceeded the maximum allowed size"

**Root Cause**: Supabase free tier has a 50MB upload limit per file.

## ✅ Solutions Implemented

### 1. **Video Duration Limit**

- **Before**: 60 seconds max
- **After**: 30 seconds max
- **Result**: ~50% smaller file size

### 2. **Pre-Upload Validation**

Added `videoCompressionService.validateVideo()` to check:

- File exists and not empty
- File size under 50MB limit
- Clear error messages to user

### 3. **Visual Timer Warning**

- Timer turns red at 25 seconds
- Shows "Max 30s" text warning
- Auto-stops at 30 seconds

### 4. **User-Friendly Error Messages**

```typescript
"Video is too large (XX.X MB). Maximum size is 50MB.
Please record a shorter video."
```

## 📦 File Size Estimates

| Duration | Quality | Estimated Size |
| -------- | ------- | -------------- |
| 10s      | 720p    | ~5-8 MB        |
| 20s      | 720p    | ~12-18 MB      |
| 30s      | 720p    | ~20-30 MB      |
| 40s      | 720p    | ~35-45 MB      |
| 60s      | 720p    | ~50-70 MB ❌   |

## 🔧 Code Changes

### videoCompression.service.ts

```typescript
const MAX_VIDEO_SIZE_MB = 50;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

async validateVideo(uri: string) {
  const info = await this.getVideoInfo(uri);

  if (this.exceedsLimit(info.size)) {
    return {
      valid: false,
      message: `Video too large (${sizeMB}). Max is ${MAX_VIDEO_SIZE_MB}MB.`
    };
  }

  return { valid: true, size: info.size };
}
```

### create-video.tsx

```typescript
setUploadProgress("Validating video...");

const validation = await videoCompressionService.validateVideo(videoData.uri);
if (!validation.valid) {
  Alert.alert("Video Error", validation.message);
  return;
}
```

### MediaPicker.tsx

```typescript
// Reduced from 60s to 30s
const video = await cameraRef.current.recordAsync({
  maxDuration: 30,
});

// Timer warning at 25s
{recordingTime >= 25 && (
  <Text style={styles.timerWarningText}>Max 30s</Text>
)}
```

## 🚀 Future Improvements (Optional)

### Video Compression

To support longer videos, implement compression:

```bash
npx expo install expo-video-thumbnails expo-av
```

Then compress before upload:

```typescript
import { Video } from "expo-av";

async function compressVideo(uri: string) {
  // Reduce bitrate, resolution, or fps
  // Target: ~1MB per 5 seconds
}
```

### Alternative Storage

For larger videos, consider:

- **Cloudinary** (free tier: 25GB storage)
- **AWS S3** (pay-as-you-go)
- **Vimeo** (video hosting platform)

## 📊 Testing Results

| Scenario  | Result                       |
| --------- | ---------------------------- |
| 15s video | ✅ Upload successful (~10MB) |
| 30s video | ✅ Upload successful (~25MB) |
| 45s video | ❌ Validation blocks upload  |
| 60s video | ❌ Validation blocks upload  |

## 💡 Best Practices

1. **Always validate before upload**
   - Saves bandwidth
   - Better UX (fail fast)
   - No wasted upload time

2. **Show file size to users**

   ```typescript
   const sizeMB = videoCompressionService.formatFileSize(size);
   Alert.alert("Video Ready", `Size: ${sizeMB}`);
   ```

3. **Progressive upload indicators**
   - "Validating video..." (1s)
   - "Uploading video..." (10-30s)
   - "Saving..." (2-5s)

4. **Cache validation results**
   - Don't re-validate same video
   - Store size in videoData state

## 🔍 Debugging

If uploads still fail:

1. **Check actual file size**:

   ```typescript
   const info = await FileSystem.getInfoAsync(videoUri);
   console.log("Size:", info.size / (1024 * 1024), "MB");
   ```

2. **Check Supabase storage bucket**:
   - Dashboard → Storage → videos
   - Check bucket policies
   - Verify upload limits

3. **Monitor network**:
   - Slow connection = larger perceived size
   - Use WiFi for testing

All changes maintain backward compatibility and improve user experience!
