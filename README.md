# Video Sharing App Mobile

> Ứng dụng chia sẻ video ngắn kết hợp tính năng thương mại (Shop) và mạng xã hội (Friends)

[![Expo SDK](https://img.shields.io/badge/Expo-51+-000020?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

## Tổng quan

Tài liệu này hướng dẫn chi tiết dành cho lập trình viên Frontend tham gia dự án Video Sharing App.

### Mục tiêu

- ✅ Đảm bảo tính thống nhất và chất lượng code cao
- ✅ Hiệu năng tối ưu cho ứng dụng mobile
- ✅ Trải nghiệm người dùng mượt mà
- ✅ Dễ dàng bảo trì và mở rộng

## Công nghệ chính

Dự án sử dụng stack React Native hiện đại, tích hợp chặt chẽ với hệ sinh thái Expo:

| Công nghệ                     | Mô tả                                               |
| ----------------------------- | --------------------------------------------------- |
| **Expo SDK 51+**              | Framework cho mobile app development                |
| **React Native + TypeScript** | Ngôn ngữ và UI framework chính                      |
| **Expo Router**               | Routing system dựa trên filesystem                  |
| **Zustand**                   | State management (lightweight alternative to Redux) |
| **Tanstack Query**            | Data fetching, caching, và sync với API             |
| **Axios**                     | HTTP client                                         |
| **Zod**                       | Schema validation                                   |
| **Reanimated 3 / Moti**       | Animation library                                   |
| **TailwindCSS (NativeWind)**  | Styling framework                                   |
| **React Hook Form**           | Form handling                                       |
| **npm**                       | Package manager chính thức                          |

## Kiến trúc hệ thống

### 1. Cấu trúc thư mục tổng thể

src/
├── app/ # Expo Router
│ ├── (tabs)/
│ │ ├── index.tsx # Home / For You
│ │ ├── trending.tsx # Trending Page
│ │ ├── search.tsx # Search Page
│ │ ├── friends.tsx # Social Page
│ │ └── profile.tsx # User Profile Page
│ ├── video/
│ │ └── [id].tsx # Video Detail Page
│ ├── upload/
│ │ ├── index.tsx # Upload Home
│ │ ├── camera.tsx # Camera Screen
│ │ └── audio-selection.tsx # Audio Library
│ └── shop/
│ └── [productId].tsx # Product Detail
├── components/
│ ├── video/
│ │ ├── VideoPlayer.tsx
│ │ ├── VideoCard.tsx
│ │ └── VideoControls.tsx
│ ├── comments/
│ │ ├── CommentSection.tsx
│ │ ├── CommentItem.tsx
│ │ └── CommentInput.tsx
│ ├── social/
│ │ ├── UserProfile.tsx
│ │ ├── FollowButton.tsx
│ │ └── UserSuggestions.tsx
│ ├── commerce/
│ │ ├── ProductCard.tsx
│ │ ├── ProductQ&A.tsx
│ │ └── BuyButton.tsx
│ ├── creation/
│ │ ├── UploadProgress.tsx
│ │ ├── MediaPicker.tsx
│ │ └── AudioPicker.tsx
├── hooks/
│ ├── useAuth.ts
│ ├── useUpload.ts
│ ├── usePlayback.ts
│ └── useDebounce.ts
├── store/
│ ├── authStore.ts
│ ├── videoStore.ts
│ ├── uiStore.ts
│ └── queryClient.ts
├── api/
│ ├── restApi.ts
│ ├── endpoints.ts
│ └── types.ts
├── utils/
│ ├── formatTime.ts
│ ├── toast.ts
│ └── constants.ts
└── assets/
├── icons/
├── fonts/
└── images/

### 2. Triết lý kiến trúc

**Feature-based + Route-based Hybrid**

- Mỗi route đại diện cho một feature chính (home, trending, search, etc.)
- Tách riêng components, hooks, store, và api theo nhóm chức năng
- Không tạo route-level logic riêng cho từng feature → logic nằm trong hooks và stores

## 🚀 Quy tắc lập trình

### 1. Nguyên tắc chung

- ✅ Tái sử dụng component tối đa
- ❌ Không dùng `any`
- ❌ Không viết inline styles (trừ animation tạm thời)
- ❌ Không gọi API trực tiếp trong component
- ❌ Không lưu video binary trong state
- ✅ Chỉ gọi API qua hooks hoặc services

### 2. API và Data Handling

#### Khai báo endpoint

Tất cả endpoints tập trung trong `src/api/endpoints.ts`:

```typescript
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  video: {
    list: "/videos",
    detail: (id: string) => `/videos/${id}`,
    upload: "/videos/upload",
  },
  user: {
    profile: (id: string) => `/users/${id}`,
    follow: (id: string) => `/users/${id}/follow`,
  },
};
```

#### API handler chuẩn

```typescript
// src/api/restApi.ts
import axios from "axios";

export const restApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});
```

#### Data fetching với React Query

```typescript
import { useQuery } from "@tanstack/react-query";
import { restApi } from "@/api/restApi";

export const useVideoList = () =>
  useQuery({
    queryKey: ["videos"],
    queryFn: async () => (await restApi.get("/videos")).data,
  });
```

### 3. State Management

Sử dụng **Zustand** cho global UI state, **React Query** cho data sync.

```typescript
import { create } from "zustand";

export const useVideoStore = create((set) => ({
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
```

### 4. Form & Validation

**React Hook Form** + **Zod** cho mọi form (login, comment, upload).

Validation đặt trong `src/utils/schemas.ts`:

```typescript
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
```

### 5. Error Handling & Toast

#### Quy tắc xử lý lỗi API

| Status | Hành động      | Thông báo                        |
| ------ | -------------- | -------------------------------- |
| 401    | Redirect login | "Phiên đăng nhập đã hết hạn"     |
| 403    | Toast warning  | "Bạn không có quyền truy cập"    |
| 404    | Toast error    | "Không tìm thấy nội dung"        |
| 500    | Toast error    | "Lỗi hệ thống, vui lòng thử lại" |

Sử dụng Toast từ `react-native-toast-message`.

## ⚡ Performance Guidelines

### 1. Lazy loading

- Tất cả screens trong `app/` tự động lazy load qua Expo Router
- Với components lớn (`VideoPlayer`, `CommentSection`), sử dụng `React.lazy`

```typescript
const VideoPlayer = React.lazy(() => import("@/components/video/VideoPlayer"));
```

### 2. Debounce cho search

- Dùng custom hook `useDebounce` (delay 300ms)
- Hủy request cũ nếu user nhập mới

```typescript
const debouncedQuery = useDebounce(searchQuery, 300);
```

### 3. Memory cleanup

- Sử dụng `AbortController` cho API requests
- Cleanup listener, timers trong `useEffect`

```typescript
useEffect(() => {
  const controller = new AbortController();

  fetchData(controller.signal);

  return () => controller.abort();
}, []);
```

### 4. React Native Optimizations

- ✅ Dùng `React.memo` cho component video cards
- ✅ Dùng `useCallback` cho event handler truyền xuống con
- ✅ Dùng `FlatList` thay vì `.map()` để render danh sách

```typescript
const VideoCard = React.memo(({ video }) => {
  const handlePress = useCallback(() => {
    navigation.navigate('video', { id: video.id });
  }, [video.id]);

  return <Pressable onPress={handlePress}>...</Pressable>;
});
```

## 🧩 Quy trình xây dựng Feature

### Bước 1: Tạo route

Expo Router tự động map file → route

**Ví dụ**: `src/app/video/[id].tsx`

```typescript
// app/video/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  return <VideoPlayer videoId={id} />;
}
```

### Bước 2: Tạo component chính

**Ví dụ**: `src/components/video/VideoPlayer.tsx`

```typescript
// components/video/VideoPlayer.tsx
import { Video } from 'expo-av';
import React from 'react';

export const VideoPlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  const { data: video } = useVideoDetail(videoId);

  return (
    <Video
      source={{ uri: video.url }}
      useNativeControls
      resizeMode="contain"
    />
  );
};
```

### Bước 3: Kết nối API

- Khai báo trong `/api/endpoints.ts`
- Tạo hook trong `/hooks/useVideo.ts`

```typescript
// hooks/useVideo.ts
import { useQuery } from "@tanstack/react-query";
import { restApi } from "@/api/restApi";
import { endpoints } from "@/api/endpoints";

export const useVideoDetail = (id: string) => {
  return useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const { data } = await restApi.get(endpoints.video.detail(id));
      return data;
    },
  });
};
```

### Bước 4: State + UI integration

- Quản lý local state bằng **Zustand**
- Quản lý data state bằng **React Query**

```typescript
// store/videoStore.ts
import { create } from "zustand";

export const useVideoStore = create((set) => ({
  currentVideoId: null,
  setCurrentVideo: (id: string) => set({ currentVideoId: id }),
}));
```

## 💅 Quy tắc UI/UX

- ✅ Tuân thủ design từ Figma
- ❌ Không đổi màu, padding, spacing tự ý
- ✅ Dùng Tailwind NativeWind cho styling
- ✅ Component responsive theo device dimensions

```typescript
// Responsive styling example
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 32) / 2; // 2 columns with 16px padding
```

## 🧠 Git & Commit Convention

### Commit Message Format

```
<type>(<scope>): <subject>
```

**Ví dụ**:

```bash
feat(video): add fullscreen playback
fix(auth): resolve login crash on iOS
refactor(upload): optimize thumbnail preview
```

### Commit Types

| Type       | Ý nghĩa               |
| ---------- | --------------------- |
| `feat`     | Tính năng mới         |
| `fix`      | Sửa lỗi               |
| `refactor` | Cải tiến code         |
| `style`    | Sửa UI / layout       |
| `chore`    | Config / dependencies |
| `docs`     | Cập nhật tài liệu     |

### Branch Convention

```
<type>/<feature-name>
```

**Ví dụ**:

- `feature/video-upload`
- `fix/comment-scroll-bug`
- `refactor/ui-theme`

### Git Workflow

```bash
# Tạo branch
git checkout -b feature/video-upload

# Cài dependencies
npm install

# Chạy dev server
npx expo start

# Build app
npx expo prebuild

# Commit
git add .
git commit -m "feat(video): implement upload flow"
git push origin feature/video-upload
```

## ✅ Checklist cho Developer

### Trước khi bắt đầu

- [ ] Hiểu rõ feature và API liên quan
- [ ] Tạo branch với đúng convention
- [ ] Setup `.env` với API URL

### Trong quá trình làm

- [ ] Không commit `console.log`
- [ ] Kiểm tra TypeScript warnings
- [ ] Test trên iOS + Android
- [ ] Cleanup `useEffect`
- [ ] Validate form với Zod

### Trước khi tạo PR

- [ ] Chạy `npm run build` không lỗi
- [ ] Self-review toàn bộ code
- [ ] Gửi screenshot hoặc video demo
- [ ] Mô tả rõ trong PR description

## 🔚 Kết luận

Tài liệu này là **chuẩn bắt buộc** cho toàn bộ dev team.

**Tuân thủ nghiêm túc giúp đảm bảo**:

- ✅ Codebase sạch và dễ bảo trì
- ✅ Ứng dụng mượt mà, trải nghiệm người dùng tốt
- ✅ Quy trình CI/CD nhất quán

---

## 📦 Quick Commands

```bash
# Setup project
npm install

# Dev mode
npx expo start

# Prebuild native code
npx expo prebuild

# Build release
npx expo build:android
npx expo build:ios

# Test
npm test
```

---

**Last updated**: November 10, 2025
