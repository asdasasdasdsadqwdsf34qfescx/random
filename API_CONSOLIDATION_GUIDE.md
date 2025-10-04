# API Consolidation Guide

## New Consolidated Structure

Instead of having separate folders for each category, you now have 3 consolidated endpoints:

### 1. Dynamic Image Route
**Endpoint:** `/api/images/[category]`

**Usage Examples:**
- `/api/images/asian` - Get all images from asian category
- `/api/images/body` - Get all images from body category  
- `/api/images/boobs` - Get all images from boobs category
- `/api/images/close` - Get all images from close category

### 2. Dynamic Video Route
**Endpoint:** `/api/videos/[model]`

**Usage Examples:**
- `/api/videos/model1` - Get all videos from model1
- `/api/videos/model2?filter=dance` - Get filtered videos from model2

### 3. Universal Categories Route
**Endpoint:** `/api/categories`

**Parameters:**
- `category` (required) - The category name
- `type` (optional) - "images", "videos", or "allvideos" (default: "images")
- `filter` (optional) - Filter string for videos

**Usage Examples:**
```
/api/categories?category=asian&type=images
/api/categories?category=model1&type=videos
/api/categories?category=model1&type=videos&filter=dance
/api/categories?type=allvideos
```

## Migration Path

### Old URLs → New URLs

| Old Endpoint | New Endpoint |
|--------------|--------------|
| `/api/asian/` | `/api/images/asian` or `/api/categories?category=asian` |
| `/api/body/` | `/api/images/body` or `/api/categories?category=body` |
| `/api/boobs/` | `/api/images/boobs` or `/api/categories?category=boobs` |
| `/api/videos/?name=model1` | `/api/videos/model1` or `/api/categories?category=model1&type=videos` |
| `/api/allvideos/` | `/api/categories?type=allvideos` |

## Benefits of New Structure

✅ **Single File Management** - All logic in 3 files instead of 15+ folders
✅ **Dynamic Categories** - Add new categories without creating new files
✅ **Consistent API** - Uniform parameter structure
✅ **Easier Maintenance** - Less files to manage
✅ **Better Organization** - Logical grouping of functionality

## Implementation Details

The new routes use the same `imageUtils.js` functions:
- `getImagesFromCategory(category)`
- `getVideosFromModel(model, filter)`
- `getAllVideos()`

## Next Steps

1. Update your frontend to use the new endpoints
2. Test the new routes
3. Remove old folder-based routes once confirmed working
4. Update any documentation or API references
