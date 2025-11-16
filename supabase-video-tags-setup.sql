-- Video Tags Table
-- Stores user tags in videos (e.g., "Tag someone")

CREATE TABLE IF NOT EXISTS video_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

-- Prevent duplicate tags
UNIQUE(video_id, user_id) );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_tags_video_id ON video_tags (video_id);

CREATE INDEX IF NOT EXISTS idx_video_tags_user_id ON video_tags (user_id);

CREATE INDEX IF NOT EXISTS idx_video_tags_created_at ON video_tags (created_at DESC);

-- RLS Policies
ALTER TABLE video_tags ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read tags
CREATE POLICY "Allow public read access to video tags" ON video_tags FOR
SELECT USING (true);

-- Allow authenticated users to create tags
CREATE POLICY "Allow authenticated users to create tags" ON video_tags FOR INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
    );

-- Allow users to delete their own tags or video owners to delete tags on their videos
CREATE POLICY "Allow users to delete their tags or video owners to delete tags" ON video_tags FOR DELETE USING (
    user_id = auth.uid ()
    OR video_id IN (
        SELECT id
        FROM videos
        WHERE
            user_id = auth.uid ()
    )
);

-- Add visibility column to videos table if not exists
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (
    visibility IN (
        'public',
        'friends',
        'private'
    )
);

-- Index for visibility
CREATE INDEX IF NOT EXISTS idx_videos_visibility ON videos (visibility);

COMMENT ON TABLE video_tags IS 'Stores user tags in videos';

COMMENT ON COLUMN video_tags.video_id IS 'The video being tagged in';

COMMENT ON COLUMN video_tags.user_id IS 'The user being tagged';

COMMENT ON COLUMN videos.visibility IS 'Who can watch: public, friends, or private';