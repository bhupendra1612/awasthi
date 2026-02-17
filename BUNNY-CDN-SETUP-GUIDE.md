# Bunny CDN & Stream Setup Guide

## Current Status ✅

Your project is already configured with Bunny CDN! Here's what you have:

### Configured Components:

- ✅ Bunny Stream for video hosting
- ✅ Bunny CDN for content delivery
- ✅ Video upload functionality (TUS protocol)
- ✅ Video player with HLS streaming
- ✅ Multiple quality options (240p, 360p, 480p, 720p)

## Environment Variables

Make sure your `.env.local` has these values:

```env
# Bunny Stream Configuration
BUNNY_LIBRARY_ID=your_library_id
BUNNY_API_KEY=your_api_key
NEXT_PUBLIC_BUNNY_CDN_HOSTNAME=your-cdn-hostname.b-cdn.net
NEXT_PUBLIC_BUNNY_LIBRARY_ID=your_library_id
```

## Getting Your Bunny Credentials

### Step 1: Create Bunny Account

1. Go to [bunny.net](https://bunny.net)
2. Sign up for an account (free trial available)
3. Verify your email

### Step 2: Create a Stream Library

1. Go to **Stream** in the dashboard
2. Click **Add Stream Library**
3. Choose regions closest to your users:
   - ✅ **Europe** (for UK)
   - ✅ **Asia** (for Singapore, Dubai)
4. Note your **Library ID** (e.g., 574761)

### Step 3: Get API Key

1. In your Stream Library settings
2. Go to **API** tab
3. Copy your **API Key**
4. Keep this secure - never commit to git!

### Step 4: Get CDN Hostname

1. In Stream Library settings
2. Find **Video CDN Hostname**
3. Format: `vz-xxxxxxxx-xxx.b-cdn.net`

## Pricing Breakdown (2026)

### Bunny Stream

- **Storage**: $0.005/GB/month (~$5 for 1TB)
- **Encoding**: $0.01/minute (one-time per video)
- **Streaming**: $0.01/GB bandwidth

### Example Costs for Coaching Institution:

- 100 hours of video content: ~$60/year storage
- 1000 students watching 10 hours each: ~$100/month bandwidth
- **Total**: ~$150-200/month for heavy usage

Compare to:

- Cloudflare Stream: $500+/month
- Vimeo Pro: $240-900/year (limited bandwidth)

## Features You're Using

### 1. Video Upload (`VideoUploader.tsx`)

- TUS resumable uploads (handles network interruptions)
- Progress tracking
- Automatic encoding to multiple qualities

### 2. Video Playback

- HLS streaming (adaptive bitrate)
- Fallback to direct MP4 links
- Thumbnail generation

### 3. Video Download (Mobile App)

- Multiple quality options
- Offline viewing support

## Optimization Tips

### 1. Enable Video Optimization

In Bunny Dashboard → Stream Library → Settings:

- ✅ Enable **MP4 Fallback** (for downloads)
- ✅ Enable **Thumbnail Generation**
- ✅ Set **Allowed Referrers** (your domain only)
- ✅ Enable **Token Authentication** (for premium content)

### 2. Configure Regions

For Dubai, UK, Singapore:

- Primary: **Europe** (covers UK, Middle East)
- Secondary: **Asia** (covers Singapore, India)

### 3. Security Settings

```typescript
// Add to your video API routes
const allowedDomains = [
  "yourdomain.com",
  "localhost:3000", // for development
];
```

### 4. Caching Strategy

Already configured in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.b-cdn.net",
    },
  ],
}
```

## API Routes You Have

### `/api/videos/create`

Creates new video entry in Bunny Stream

### Usage in Admin Panel:

```typescript
// Upload video
const { guid } = await createVideo(title);
// guid is your video ID for playback
```

## Video Playback URLs

Your `lib/bunny.ts` provides:

1. **HLS Streaming** (best quality, adaptive):

   ```
   https://your-cdn.b-cdn.net/{videoId}/playlist.m3u8
   ```

2. **Direct MP4** (for downloads):

   ```
   https://your-cdn.b-cdn.net/{videoId}/play_720p.mp4
   ```

3. **Embed Player**:
   ```
   https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}
   ```

## Testing Your Setup

### 1. Test Video Upload

```bash
# In admin panel, try uploading a small test video
# Check Bunny dashboard to see it appear
```

### 2. Test Playback

```typescript
// Use any video GUID from your Bunny library
const testVideoId = "your-video-guid";
// Should play in your VideoPlayer component
```

### 3. Check Bandwidth Usage

- Bunny Dashboard → Stream → Analytics
- Monitor bandwidth by region
- Set up billing alerts

## Troubleshooting

### Upload Fails

- Check API key is correct
- Verify library ID matches
- Check file size (max 500MB configured)

### Video Won't Play

- Verify CDN hostname is correct
- Check video encoding is complete (takes 1-5 min)
- Test with direct MP4 URL first

### Slow Loading in Dubai/Singapore

- Add Asia region to your Stream Library
- Enable CDN caching (automatic)
- Check Bunny's network status page

## Advanced Features

### 1. Token Authentication (Recommended)

Protect premium course videos:

```typescript
// Generate signed URL
const token = generateBunnyToken(videoId, expiresIn);
const secureUrl = `${videoUrl}?token=${token}`;
```

### 2. Analytics Integration

Track video views:

- Bunny provides view counts
- Integration with your course analytics
- Student progress tracking

### 3. Webhook Integration

Get notified when encoding completes:

```typescript
// POST /api/webhooks/bunny
// Bunny sends encoding status updates
```

## Migration from Other Services

If moving from YouTube/Vimeo:

1. Download existing videos
2. Upload to Bunny via admin panel
3. Update video IDs in database
4. Test playback

## Support Resources

- [Bunny Stream Docs](https://docs.bunny.net/docs/stream)
- [API Reference](https://docs.bunny.net/reference/api-overview)
- [Community Forum](https://support.bunny.net)
- Support: support@bunny.net

## Next Steps

1. ✅ Verify environment variables are set
2. ✅ Test video upload in admin panel
3. ✅ Configure security settings in Bunny dashboard
4. ✅ Set up billing alerts
5. ✅ Add token authentication for premium content

---

**Cost Estimate for Your Use Case:**

- 50 courses × 10 videos × 30 min = 250 hours content
- Storage: ~$30/year
- 500 students × 100 hours watched = 50,000 hours
- Bandwidth: ~$50-100/month
- **Total: ~$80-130/month** (vs $500+ with Cloudflare)

You're saving 60-70% with Bunny! 🎉
