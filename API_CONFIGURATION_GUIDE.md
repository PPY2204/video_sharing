# 🔌 Hướng Dẫn Cấu Hình và Sử Dụng API

## 📋 Tổng Quan

Project đã được cấu hình sẵn một **API Service** hoàn chỉnh với:

- ✅ Axios client với interceptors
- ✅ Authentication (JWT token management)
- ✅ Auto token refresh
- ✅ Error handling
- ✅ TypeScript types đầy đủ
- ✅ Tất cả endpoints theo SDLC spec

## 📁 Cấu Trúc API Files

```
src/
├── api/
│   ├── endpoints.ts      # Định nghĩa tất cả API endpoints
│   ├── restApi.ts        # API service class chính
│   └── types.ts          # Request/Response types
├── types/
│   └── app.types.ts      # Entity types (User, Video, Comment, etc.)
└── services/
    ├── api.service.ts    # Service wrappers (optional)
    └── auth.service.ts   # Auth helpers (optional)
```

---

## 🔧 Cấu Hình Environment

### 1. Tạo File `.env`

Tạo file `.env` ở root project:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_API_TIMEOUT=30000

# Optional
EXPO_PUBLIC_ENV=development
```

### 2. Các Environment Khác

**Development (.env.development):**

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Staging (.env.staging):**

```env
EXPO_PUBLIC_API_URL=https://staging-api.videosharing.com
```

**Production (.env.production):**

```env
EXPO_PUBLIC_API_URL=https://api.videosharing.com
```

---

## 🚀 Sử Dụng API Service

### Import API Service

```typescript
import apiService from "@/api/restApi";
```

### 1. **Authentication APIs**

#### Login

```typescript
try {
  const response = await apiService.auth.login({
    email: "user@example.com",
    password: "password123",
  });

  // Response type: AuthResponse
  console.log("Token:", response.token);
  console.log("User:", response.user);
} catch (error) {
  console.error("Login failed:", error.message);
}
```

#### Register

```typescript
try {
  const response = await apiService.auth.register({
    username: "newuser",
    email: "newuser@example.com",
    password: "password123",
    fullName: "New User",
  });

  console.log("Registered:", response.user);
} catch (error) {
  console.error("Registration failed:", error.message);
}
```

#### Logout

```typescript
await apiService.auth.logout();
```

### 2. **Video APIs**

#### Get Video Feed

```typescript
// Get paginated feed
const videos = await apiService.videos.getFeed(1, 20);
console.log("Videos:", videos.data);
console.log("Total pages:", videos.totalPages);

// Usage in component:
const [videos, setVideos] = useState([]);
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);

const loadVideos = async () => {
  setLoading(true);
  try {
    const response = await apiService.videos.getFeed(page, 20);
    setVideos((prev) => [...prev, ...response.data]);
  } catch (error) {
    console.error("Failed to load videos:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadVideos();
}, [page]);
```

#### Get Trending Videos

```typescript
const trending = await apiService.videos.getTrending(1, 10);
```

#### Get Video Detail

```typescript
const video = await apiService.videos.getDetail("video-id-123");
console.log("Video:", video);
```

#### Upload Video

```typescript
// Prepare video data
const videoData = {
  title: "My Amazing Video",
  description: "Check this out!",
  videoFile: {
    uri: "file:///path/to/video.mp4",
    type: "video/mp4",
    name: "video.mp4",
  },
  thumbnail: {
    uri: "file:///path/to/thumb.jpg",
    type: "image/jpeg",
    name: "thumbnail.jpg",
  },
  hashtags: ["funny", "pets", "cute"],
};

// Upload
const uploadedVideo = await apiService.videos.upload(videoData);
console.log("Uploaded:", uploadedVideo);
```

#### Like/Unlike Video

```typescript
await apiService.videos.like("video-id-123");
await apiService.videos.unlike("video-id-123");
```

#### Track Video View

```typescript
await apiService.videos.view("video-id-123");
```

### 3. **User APIs**

#### Get User Profile

```typescript
const user = await apiService.users.getProfile("user-id-123");
console.log("User:", user);
```

#### Update Profile

```typescript
const updated = await apiService.users.updateProfile("user-id", {
  fullName: "Updated Name",
  bio: "New bio text",
  profileImage: {
    uri: "file:///path/to/image.jpg",
    type: "image/jpeg",
    name: "profile.jpg",
  },
});
```

#### Follow/Unfollow User

```typescript
await apiService.users.follow("user-id-123");
await apiService.users.unfollow("user-id-123");
```

#### Get Followers/Following

```typescript
const followers = await apiService.users.getFollowers("user-id", 1, 20);
const following = await apiService.users.getFollowing("user-id", 1, 20);
```

### 4. **Comment APIs**

#### Get Comments

```typescript
const comments = await apiService.comments.getComments("video-id", 1, 50);
```

#### Add Comment

```typescript
const newComment = await apiService.comments.addComment("video-id", {
  content: "Great video!",
  parentId: null, // null for top-level, or comment-id for reply
});
```

#### Like Comment

```typescript
await apiService.comments.likeComment("comment-id");
```

### 5. **Search APIs**

#### Search Videos

```typescript
const results = await apiService.search.videos("funny cats", 1, 20);
console.log("Found:", results.data);
```

#### Search Users

```typescript
const users = await apiService.search.users("john", 1, 10);
```

#### Search Hashtags

```typescript
const hashtags = await apiService.search.hashtags("funny");
```

### 6. **Notification APIs**

#### Get Notifications

```typescript
const notifications = await apiService.notifications.getAll(1, 20);
```

#### Mark as Read

```typescript
await apiService.notifications.markAsRead("notification-id");
```

---

## 🎯 Ví Dụ Component Thực Tế

### Example 1: Trending Videos Component

```typescript
import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import apiService from '@/api/restApi';
import type { Video } from '@/types';

export default function TrendingVideos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTrending();
    }, []);

    const loadTrending = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.videos.getTrending(1, 10);
            setVideos(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load videos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <FlatList
            data={videos}
            renderItem={({ item }) => <VideoCard video={item} />}
            keyExtractor={(item) => item.id}
        />
    );
}
```

### Example 2: Video Upload

```typescript
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiService from '@/api/restApi';

export default function VideoUpload() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = async () => {
        // 1. Pick video
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });

        if (result.canceled) return;

        // 2. Prepare data
        const videoData = {
            title: 'My Video',
            description: 'Awesome content',
            videoFile: {
                uri: result.assets[0].uri,
                type: 'video/mp4',
                name: 'video.mp4',
            },
        };

        // 3. Upload
        try {
            setUploading(true);
            const video = await apiService.videos.upload(videoData);
            console.log('Upload success:', video);
            alert('Video uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View>
            <Button
                title={uploading ? 'Uploading...' : 'Upload Video'}
                onPress={handleUpload}
                disabled={uploading}
            />
            {uploading && <Text>Progress: {progress}%</Text>}
        </View>
    );
}
```

### Example 3: Follow/Unfollow với Optimistic Update

```typescript
import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import apiService from '@/api/restApi';

interface FollowButtonProps {
    userId: string;
    initialFollowing: boolean;
}

export default function FollowButton({ userId, initialFollowing }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [loading, setLoading] = useState(false);

    const handleToggleFollow = async () => {
        // Optimistic update
        const previousState = isFollowing;
        setIsFollowing(!isFollowing);
        setLoading(true);

        try {
            if (isFollowing) {
                await apiService.users.unfollow(userId);
            } else {
                await apiService.users.follow(userId);
            }
        } catch (error) {
            // Rollback on error
            setIsFollowing(previousState);
            console.error('Follow/unfollow failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            onPress={handleToggleFollow}
            disabled={loading}
            style={{
                backgroundColor: isFollowing ? '#f0f0f0' : '#FF3B5C',
                padding: 10,
                borderRadius: 8,
            }}
        >
            <Text style={{ color: isFollowing ? '#000' : '#fff' }}>
                {isFollowing ? 'Following' : 'Follow'}
            </Text>
        </TouchableOpacity>
    );
}
```

---

## 🔐 Token Management

API Service tự động quản lý authentication token:

```typescript
// Token được lưu tự động sau khi login
await apiService.auth.login({ email, password });

// Token được tự động thêm vào mọi request
await apiService.videos.getFeed(1, 20); // ← Token tự động include

// Token tự động refresh khi expired
// (xử lý trong response interceptor)

// Clear token khi logout
await apiService.auth.logout();
```

---

## ⚠️ Error Handling

API Service có built-in error handling:

```typescript
try {
  const videos = await apiService.videos.getFeed(1, 20);
} catch (error) {
  // Error đã được format sẵn
  console.error(error.message);

  // Có thể check error type
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.response?.status === 404) {
    // Not found
  } else if (error.code === "ECONNABORTED") {
    // Timeout
  }
}
```

### Custom Error Handler

```typescript
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 401:
        // Redirect to login
        router.push("/auth/login");
        break;
      case 403:
        alert("You don't have permission");
        break;
      case 404:
        alert("Resource not found");
        break;
      case 500:
        alert("Server error, please try again later");
        break;
      default:
        alert(error.message);
    }
  } else if (error.request) {
    // Request made but no response
    alert("No internet connection");
  } else {
    // Something else happened
    alert("An error occurred: " + error.message);
  }
};

// Usage:
try {
  await apiService.videos.upload(data);
} catch (error) {
  handleApiError(error);
}
```

---

## 📊 Response Types

All API methods return typed responses:

```typescript
// PaginatedResponse<T>
type VideoResponse = PaginatedResponse<Video>;
{
    data: Video[],
    page: number,
    limit: number,
    total: number,
    totalPages: number
}

// AuthResponse
{
    token: string,
    refreshToken: string,
    user: User
}

// Single entity
type VideoDetail = Video;
type UserProfile = User;
```

---

## 🔄 Mock Data vs Real API

### Hiện Tại: Mock Data

```typescript
// src/components/home/TrendingSection/index.tsx
import { trendingData } from "@/data/homeData"; // ← Mock data

export default function TrendingSection() {
    return (
        <FlatList data={trendingData} ... />
    );
}
```

### Chuyển Sang Real API

```typescript
import apiService from '@/api/restApi';

export default function TrendingSection() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await apiService.videos.getTrending(1, 10);
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator />;

    return (
        <FlatList data={data} ... />
    );
}
```

---

## 🧪 Testing API với Mock Server

### Option 1: JSON Server

```bash
# Install
npm install -g json-server

# Create db.json
# Run
json-server --watch db.json --port 3000
```

### Option 2: MSW (Mock Service Worker)

```bash
npm install msw --save-dev
```

```typescript
// src/mocks/handlers.ts
import { rest } from "msw";

export const handlers = [
  rest.get("/api/videos/feed", (req, res, ctx) => {
    return res(
      ctx.json({
        data: [...mockVideos],
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      })
    );
  }),
];
```

---

## 📝 Checklist Setup API

- [ ] Tạo file `.env` với `EXPO_PUBLIC_API_URL`
- [ ] Check API service imports correctly
- [ ] Test login/register flow
- [ ] Test video feed loading
- [ ] Test upload flow (if needed)
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test token refresh logic
- [ ] Handle offline scenarios

---

## 🚀 Next Steps

1. **Setup Backend Server** - Deploy API server với tất cả endpoints
2. **Update Environment Variables** - Point to production URL
3. **Replace Mock Data** - Update tất cả components để dùng API
4. **Add Caching** - Implement React Query hoặc Redux
5. **Add Offline Support** - AsyncStorage cho offline mode
6. **Optimize Performance** - Lazy loading, pagination
7. **Add Analytics** - Track API calls và errors

---

## 📚 Resources

- API Endpoints: `src/api/endpoints.ts`
- Type Definitions: `src/types/app.types.ts`
- API Service: `src/api/restApi.ts`
- Mock Data: `src/data/`
