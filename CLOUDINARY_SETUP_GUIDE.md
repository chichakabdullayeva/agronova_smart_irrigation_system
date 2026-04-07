# Cloudinary Image Upload Setup Guide

## Overview
Your application now uses Cloudinary for image and video uploads instead of trying to save files locally on the server. This works perfectly in serverless environments like Vercel.

## Setup Steps

### 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

### 2. Get Your Cloudinary Credentials
1. Log into your Cloudinary dashboard
2. Go to your Dashboard → Account Details
3. Note down these values:
   - **Cloud Name**: Found in the "Account Details" section
   - **API Key**: Found in the "Account Details" section
   - **API Secret**: Found in the "Account Details" section

### 3. Configure Environment Variables

#### For Vercel (Production):
1. Go to your Vercel dashboard
2. Select your project: `agronova-smart-irrigation-system`
3. Go to Settings → Environment Variables
4. Add these variables:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   CLOUDINARY_API_KEY=your-api-key-here
   CLOUDINARY_API_SECRET=your-api-secret-here
   ```

#### For Local Development:
1. Create a `.env` file in your project root:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   CLOUDINARY_API_KEY=your-api-key-here
   CLOUDINARY_API_SECRET=your-api-secret-here
   REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   ```

### 4. Redeploy Your Application
After adding the environment variables, redeploy:
```bash
vercel --prod
```

## How It Works

### Frontend Flow:
1. User selects images/videos in the Create Post modal
2. Frontend uploads each file to `/api/upload` endpoint
3. API uploads to Cloudinary and returns the secure URL
4. Frontend collects all URLs and submits them with the post

### Backend Flow:
1. `/api/upload` endpoint receives files via FormData
2. Uses Cloudinary SDK to upload to cloud storage
3. Returns the secure URL for frontend to use
4. `/api/posts` stores the URLs as arrays in the post data

### Security Features:
- Files are uploaded via your secure API endpoint
- No direct frontend-to-Cloudinary uploads (more secure)
- All uploads go through your serverless functions
- Files are stored in a dedicated folder: `agronova-posts`

## Testing

1. Go to your live app: https://agronova-smart-irrigation-system.vercel.app
2. Navigate to Community → Create Post
3. Try uploading images and/or videos
4. Submit the post
5. Verify images display correctly in the post feed

## File Limits (Cloudinary Free Tier)
- **Images**: Up to 10,000 monthly uploads
- **Videos**: Up to 1GB storage, 1GB monthly viewing bandwidth
- **File Size**: Images up to 10MB, Videos up to 100MB

## Troubleshooting

### Upload Fails:
1. Check your environment variables are set correctly in Vercel
2. Verify your Cloudinary credentials are valid
3. Check browser console for error messages

### Images Don't Display:
1. Check that the Cloudinary URLs are being stored correctly
2. Verify the PostCard component is using the correct image URLs
3. Check browser network tab for failed image requests

### Environment Variables Not Working:
1. Make sure you redeploy after adding environment variables
2. Check Vercel dashboard to confirm variables are set
3. For local development, restart your dev server after adding .env

## Cost Optimization

### Free Tier Limits:
- 25GB storage
- 25GB monthly bandwidth
- 25,000 monthly image transformations

### Tips to Stay Within Limits:
1. Use appropriate image formats (JPEG for photos, PNG for graphics)
2. Resize images on upload if needed
3. Consider using Cloudinary's auto-format feature
4. Monitor your usage in the Cloudinary dashboard

## Advanced Configuration

You can customize the upload behavior by modifying `api/_utils/cloudinary.js`:

```javascript
// Example: Add image optimization
const result = await uploadToCloudinary(buffer, {
  resource_type: type === 'video' ? 'video' : 'image',
  format: 'auto', // Auto-optimize format
  quality: 'auto', // Auto-optimize quality
  width: 1200, // Resize to max width
  height: 1200, // Resize to max height
  crop: 'limit' // Maintain aspect ratio
});
```

## Support

If you encounter issues:
1. Check the Vercel function logs in your dashboard
2. Verify Cloudinary credentials
3. Test with the debug HTML file if needed
4. Check browser developer tools for network errors

Your image upload system is now production-ready! 🎉