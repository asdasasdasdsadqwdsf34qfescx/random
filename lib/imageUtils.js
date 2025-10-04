import fs from "fs";
import path from "path";

/**
 * Fetches images from a specified directory in the public folder
 * @param {string} category - The category/directory name (e.g., 'asian', 'body', 'boobs')
 * @returns {Promise<Response>} - JSON response with images array or error
 */
export const getImagesFromCategory = async (category) => {
  try {
    const photosDir = path.join(process.cwd(), "public", category);
    
    // Check if directory exists; if not, return an empty list gracefully
    if (!fs.existsSync(photosDir)) {
      return new Response(
        JSON.stringify({ images: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const files = fs.readdirSync(photosDir);
    const images = files.filter((file) =>
      SUPPORTED_IMAGE_EXTENSIONS.includes(
        path.extname(file).toLowerCase()
      )
    );

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * Fetches videos from a specific model directory with optional filtering
 * @param {string} modelName - The model directory name
 * @param {string} filter - Optional filter string to match video names
 * @returns {Promise<Response>} - JSON response with videos array or error
 */
export const getVideosFromModel = async (modelName, filter = null) => {
  try {
    const videosDir = path.join(process.cwd(), "public", "videos", modelName);
    
    if (!fs.existsSync(videosDir)) {
      return new Response(JSON.stringify({ videos: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const files = fs.readdirSync(videosDir);
    let videos = files.filter((file) =>
      SUPPORTED_VIDEO_EXTENSIONS.includes(path.extname(file).toLowerCase())
    );

    if (filter) {
      videos = videos.filter((file) => 
        file.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return new Response(JSON.stringify({ videos }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * Fetches all videos from all model directories
 * @returns {Promise<Response>} - JSON response with allVideos array or error
 */
export const getAllVideos = async () => {
  try {
    const videosRoot = path.join(process.cwd(), "public", "videos");
    
    if (!fs.existsSync(videosRoot)) {
      return new Response(JSON.stringify({ allVideos: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const modelDirs = fs.readdirSync(videosRoot).filter((f) => 
      fs.statSync(path.join(videosRoot, f)).isDirectory()
    );
    
    let allVideos = [];
    
    for (const dir of modelDirs) {
      const dirPath = path.join(videosRoot, dir);
      const files = fs.readdirSync(dirPath).filter((file) =>
        SUPPORTED_VIDEO_EXTENSIONS.includes(path.extname(file).toLowerCase())
      );
      files.forEach((file) => allVideos.push({ model: dir, video: file }));
    }

    return new Response(JSON.stringify({ allVideos }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * Supported image extensions
 */
export const SUPPORTED_IMAGE_EXTENSIONS = [
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"
];

/**
 * Supported video extensions
 */
export const SUPPORTED_VIDEO_EXTENSIONS = [
  ".mp4", ".webm", ".mov", ".avi", ".mkv"
];
