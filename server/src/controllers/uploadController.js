import cloudinary from "../config/cloudinary.js";

// Returns a signature the frontend uses to upload DIRECTLY to Cloudinary
// (video/image bytes never pass through our server). See client's api/upload.js.
export const getUploadSignature = (req, res) => {
  const { folder = "elearning" } = req.query;
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder
  });
};
