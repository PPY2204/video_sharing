-- =============================================
-- SUPABASE DATABASE SETUP SCRIPT
-- Copy toàn bộ script này và paste vào Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Table: users
CREATE TABLE IF NOT EXISTS users (
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

-- Table: videos
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  duration INTEGER NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  hashtags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: follows
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Table: video_likes
CREATE TABLE IF NOT EXISTS video_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(video_id, user_id)
);

-- Table: comment_likes
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Table: audio_tracks
CREATE TABLE IF NOT EXISTS audio_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  creator TEXT NOT NULL,
  duration TEXT NOT NULL,
  url TEXT NOT NULL,
  cover TEXT,
  plays INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. CREATE INDEXES
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Videos indexes
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);
CREATE INDEX IF NOT EXISTS idx_videos_likes ON videos(likes DESC);
CREATE INDEX IF NOT EXISTS idx_videos_hashtags ON videos USING GIN(hashtags);
CREATE INDEX IF NOT EXISTS idx_videos_title_search ON videos USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_videos_description_search ON videos USING GIN(to_tsvector('english', description));

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Follows indexes
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- Video likes indexes
CREATE INDEX IF NOT EXISTS idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_user_id ON video_likes(user_id);

-- Comment likes indexes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- Audio tracks indexes
CREATE INDEX IF NOT EXISTS idx_audio_tracks_name ON audio_tracks(name);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_plays ON audio_tracks(plays DESC);

-- =============================================
-- 3. CREATE RPC FUNCTIONS
-- =============================================

-- Increment video likes
CREATE OR REPLACE FUNCTION increment_video_likes(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET likes = likes + 1 WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Decrement video likes
CREATE OR REPLACE FUNCTION decrement_video_likes(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET likes = GREATEST(likes - 1, 0) WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Increment video views
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET views = views + 1 WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Increment video comments
CREATE OR REPLACE FUNCTION increment_video_comments(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET comments = comments + 1 WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Decrement video comments
CREATE OR REPLACE FUNCTION decrement_video_comments(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos SET comments = GREATEST(comments - 1, 0) WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. CREATE RLS POLICIES
-- =============================================

-- Users policies
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Videos policies
CREATE POLICY "Videos are viewable by everyone" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own videos" ON videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" ON videos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" ON videos
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" ON follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Video likes policies
CREATE POLICY "Video likes are viewable by everyone" ON video_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like videos" ON video_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike videos" ON video_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Comment likes are viewable by everyone" ON comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like comments" ON comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments" ON comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Audio tracks policies
CREATE POLICY "Audio tracks are viewable by everyone" ON audio_tracks
  FOR SELECT USING (true);

-- =============================================
-- 6. INSERT SAMPLE DATA
-- =============================================

-- Insert sample users
INSERT INTO users (username, full_name, email, profile_image, bio, followers, following, likes, is_verified)
VALUES 
  ('john_doe', 'John Doe', 'john@example.com', 'https://i.pravatar.cc/150?img=1', 'Content creator 🎬', 10000, 500, 50000, true),
  ('jane_smith', 'Jane Smith', 'jane@example.com', 'https://i.pravatar.cc/150?img=2', 'Travel vlogger ✈️', 25000, 800, 120000, true),
  ('mike_tech', 'Mike Tech', 'mike@example.com', 'https://i.pravatar.cc/150?img=3', 'Tech reviewer 💻', 50000, 1200, 250000, true),
  ('sarah_fitness', 'Sarah Fitness', 'sarah@example.com', 'https://i.pravatar.cc/150?img=5', 'Fitness coach 💪', 35000, 600, 180000, true),
  ('alex_cook', 'Alex Cook', 'alex@example.com', 'https://i.pravatar.cc/150?img=7', 'Food lover 🍳', 15000, 400, 75000, false)
ON CONFLICT (email) DO NOTHING;

-- Insert sample videos
INSERT INTO videos (user_id, title, description, video_url, thumbnail, duration, views, likes, comments, hashtags)
SELECT 
  u.id,
  'Amazing Travel Destinations',
  'Exploring the most beautiful places on Earth! #travel #adventure',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://picsum.photos/seed/1/400/600',
  180,
  125000,
  12500,
  450,
  ARRAY['travel', 'adventure', 'vlog']
FROM users u WHERE u.username = 'jane_smith'
ON CONFLICT DO NOTHING;

INSERT INTO videos (user_id, title, description, video_url, thumbnail, duration, views, likes, comments, hashtags)
SELECT 
  u.id,
  'Latest Tech Review',
  'Unboxing and reviewing the newest gadgets! #tech #review',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://picsum.photos/seed/2/400/600',
  240,
  250000,
  25000,
  890,
  ARRAY['tech', 'review', 'gadgets']
FROM users u WHERE u.username = 'mike_tech'
ON CONFLICT DO NOTHING;

INSERT INTO videos (user_id, title, description, video_url, thumbnail, duration, views, likes, comments, hashtags)
SELECT 
  u.id,
  '15 Min Full Body Workout',
  'Quick and effective workout routine! #fitness #workout',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://picsum.photos/seed/3/400/600',
  900,
  180000,
  18000,
  670,
  ARRAY['fitness', 'workout', 'health']
FROM users u WHERE u.username = 'sarah_fitness'
ON CONFLICT DO NOTHING;

INSERT INTO videos (user_id, title, description, video_url, thumbnail, duration, views, likes, comments, hashtags)
SELECT 
  u.id,
  'Easy Pasta Recipe',
  'Making delicious pasta in 20 minutes! #cooking #food',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://picsum.photos/seed/4/400/600',
  1200,
  95000,
  9500,
  320,
  ARRAY['cooking', 'food', 'recipe']
FROM users u WHERE u.username = 'alex_cook'
ON CONFLICT DO NOTHING;

INSERT INTO videos (user_id, title, description, video_url, thumbnail, duration, views, likes, comments, hashtags)
SELECT 
  u.id,
  'Daily Vlog',
  'A day in my life! #vlog #daily',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://picsum.photos/seed/5/400/600',
  450,
  80000,
  8000,
  290,
  ARRAY['vlog', 'daily', 'life']
FROM users u WHERE u.username = 'john_doe'
ON CONFLICT DO NOTHING;

-- Insert sample audio tracks
INSERT INTO audio_tracks (name, creator, duration, url, cover, plays)
VALUES
  ('Summer Vibes', 'DJ Cool', '3:45', 'https://example.com/audio/summer-vibes.mp3', 'https://picsum.photos/seed/audio1/200/200', 125000),
  ('Epic Adventure', 'Sound Master', '4:20', 'https://example.com/audio/epic-adventure.mp3', 'https://picsum.photos/seed/audio2/200/200', 250000),
  ('Chill Beats', 'Lofi King', '2:30', 'https://example.com/audio/chill-beats.mp3', 'https://picsum.photos/seed/audio3/200/200', 180000),
  ('Workout Mix', 'Fitness DJ', '5:00', 'https://example.com/audio/workout-mix.mp3', 'https://picsum.photos/seed/audio4/200/200', 95000),
  ('Cooking Tunes', 'Kitchen Beats', '3:15', 'https://example.com/audio/cooking-tunes.mp3', 'https://picsum.photos/seed/audio5/200/200', 60000)
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comments (video_id, user_id, text, likes)
SELECT 
  v.id,
  u.id,
  'This is amazing! 🔥',
  150
FROM videos v
CROSS JOIN users u
WHERE v.title = 'Amazing Travel Destinations' AND u.username = 'mike_tech'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO comments (video_id, user_id, text, likes)
SELECT 
  v.id,
  u.id,
  'Great content! Keep it up! 👍',
  200
FROM videos v
CROSS JOIN users u
WHERE v.title = 'Latest Tech Review' AND u.username = 'jane_smith'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO comments (video_id, user_id, text, likes)
SELECT 
  v.id,
  u.id,
  'Very helpful! Thanks for sharing! 💪',
  180
FROM videos v
CROSS JOIN users u
WHERE v.title = '15 Min Full Body Workout' AND u.username = 'john_doe'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample follows
INSERT INTO follows (follower_id, following_id)
SELECT u1.id, u2.id
FROM users u1
CROSS JOIN users u2
WHERE u1.username = 'john_doe' AND u2.username IN ('jane_smith', 'mike_tech')
ON CONFLICT DO NOTHING;

INSERT INTO follows (follower_id, following_id)
SELECT u1.id, u2.id
FROM users u1
CROSS JOIN users u2
WHERE u1.username = 'jane_smith' AND u2.username IN ('mike_tech', 'sarah_fitness')
ON CONFLICT DO NOTHING;

-- =============================================
-- 7. VERIFICATION QUERIES
-- =============================================

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'videos', COUNT(*) FROM videos
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'follows', COUNT(*) FROM follows
UNION ALL
SELECT 'audio_tracks', COUNT(*) FROM audio_tracks;

-- Show sample data
SELECT 
  v.title,
  u.username as creator,
  v.views,
  v.likes,
  v.comments as comment_count
FROM videos v
JOIN users u ON v.user_id = u.id
ORDER BY v.views DESC;

-- =============================================
-- SETUP COMPLETE! 🎉
-- =============================================
