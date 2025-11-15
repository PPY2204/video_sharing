# Hướng dẫn thiết lập Supabase Database

## 📋 Yêu cầu

- Tài khoản Supabase (https://supabase.com)
- Project đã được tạo
- URL và Anon Key đã được cấu hình trong `.env`

## 🗄️ Cấu trúc Database

### 1. Bảng `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_image TEXT,
  bio TEXT,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

### 2. Bảng `videos`

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  hashtags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_videos_views ON videos(views DESC);
CREATE INDEX idx_videos_likes ON videos(likes DESC);
CREATE INDEX idx_videos_hashtags ON videos USING GIN(hashtags);

-- Full text search
CREATE INDEX idx_videos_title_search ON videos USING GIN(to_tsvector('english', title));
CREATE INDEX idx_videos_description_search ON videos USING GIN(to_tsvector('english', description));
```

### 3. Bảng `comments`

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_video_id ON comments(video_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
```

### 4. Bảng `follows`

```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Indexes
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

### 5. Bảng `video_likes`

```sql
CREATE TABLE video_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(video_id, user_id)
);

-- Indexes
CREATE INDEX idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX idx_video_likes_user_id ON video_likes(user_id);
```

### 6. Bảng `comment_likes`

```sql
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Indexes
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);
```

### 7. Bảng `audio_tracks`

```sql
CREATE TABLE audio_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  creator TEXT NOT NULL,
  duration TEXT NOT NULL,
  url TEXT NOT NULL,
  cover TEXT,
  plays INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audio_tracks_name ON audio_tracks(name);
CREATE INDEX idx_audio_tracks_plays ON audio_tracks(plays DESC);
```

## 🔧 Database Functions (RPC)

### Increment video likes

```sql
CREATE OR REPLACE FUNCTION increment_video_likes(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET likes = likes + 1 WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;
```

### Decrement video likes

```sql
CREATE OR REPLACE FUNCTION decrement_video_likes(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET likes = GREATEST(likes - 1, 0) WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;
```

### Increment video views

```sql
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET views = views + 1 WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;
```

### Increment video comments

```sql
CREATE OR REPLACE FUNCTION increment_video_comments(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET comments = comments + 1 WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;
```

### Decrement video comments

```sql
CREATE OR REPLACE FUNCTION decrement_video_comments(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET comments = GREATEST(comments - 1, 0) WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;
```

## 🔐 Row Level Security (RLS)

### Enable RLS on all tables

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
```

### Policies (Example for videos)

```sql
-- Anyone can view videos
CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT
  USING (true);

-- Users can insert their own videos
CREATE POLICY "Users can insert their own videos"
  ON videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own videos
CREATE POLICY "Users can update their own videos"
  ON videos FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own videos
CREATE POLICY "Users can delete their own videos"
  ON videos FOR DELETE
  USING (auth.uid() = user_id);
```

## 📝 Dữ liệu mẫu

### Thêm user mẫu

```sql
INSERT INTO users (username, full_name, email, profile_image, bio, followers, following, likes, is_verified)
VALUES
  ('john_doe', 'John Doe', 'john@example.com', 'https://i.pravatar.cc/150?img=1', 'Content creator', 10000, 500, 50000, true),
  ('jane_smith', 'Jane Smith', 'jane@example.com', 'https://i.pravatar.cc/150?img=2', 'Travel vlogger', 25000, 800, 120000, true),
  ('mike_tech', 'Mike Tech', 'mike@example.com', 'https://i.pravatar.cc/150?img=3', 'Tech reviewer', 50000, 1200, 250000, true);
```

### Thêm video mẫu

```sql
INSERT INTO videos (user_id, title, description, video_url, thumbnail, duration, views, likes, comments, hashtags)
SELECT
  u.id,
  'Amazing Travel Vlog',
  'Check out this amazing place!',
  'https://example.com/video1.mp4',
  'https://picsum.photos/400/600',
  120,
  15000,
  1200,
  45,
  ARRAY['travel', 'adventure', 'vlog']
FROM users u
WHERE u.username = 'jane_smith';
```

## 🚀 Cách sử dụng trong App

### 1. Đảm bảo file `.env` đã được cấu hình

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
```

### 2. Import và sử dụng hooks

```typescript
import { useVideoFeed } from "@/hooks/useVideos";

function VideoFeed() {
  const { videos, isLoading, error, loadMore } = useVideoFeed();

  // Render videos...
}
```

### 3. Sử dụng trực tiếp service

```typescript
import { supabaseService } from "@/services/supabase.service";

// Fetch videos
const videos = await supabaseService.videos.getVideos(1, 10);

// Like a video
await supabaseService.videos.toggleLike(videoId, userId, false);

// Add comment
await supabaseService.comments.addComment(videoId, userId, "Great video!");
```

## 📊 Monitoring & Debugging

1. **Supabase Dashboard**: Xem logs và queries trong dashboard
2. **Table Editor**: Kiểm tra dữ liệu trực tiếp
3. **API Logs**: Theo dõi các request/response
4. **Performance**: Kiểm tra performance của queries

## 🔄 Realtime Subscriptions (Optional)

```typescript
// Subscribe to new videos
const subscription = supabase
  .channel("videos")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "videos" },
    (payload) => {
      console.log("New video:", payload.new);
    }
  )
  .subscribe();

// Unsubscribe when done
subscription.unsubscribe();
```

## ⚠️ Lưu ý

1. **Anon Key**: Chỉ dùng cho client-side, không expose Service Role Key
2. **RLS**: Luôn bật RLS để bảo mật dữ liệu
3. **Indexes**: Tạo indexes cho các queries thường xuyên
4. **Backup**: Tự động backup database định kỳ
5. **Limits**: Chú ý giới hạn free tier của Supabase

## 📚 Tài liệu tham khảo

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
