import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Corrected typo
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageonCloudinary = async (localfilepath) => {
  try {
    // Check if localfilepath is provided
    if (!localfilepath) {
      console.log("No file path provided.");
      return null;
    }

    // Upload the file to Cloudinary
    const res = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto", // Corrected typo
    });
    // Log the successful upload
    // console.log("File uploaded successfully:", res.secure_url);

    // Delete the local file after successful upload
    fs.unlinkSync(localfilepath);

    return res;
  } catch (error) {
    // Delete the local file if the upload fails
    if (fs.existsSync(localfilepath)) {
      fs.unlinkSync(localfilepath);
    }

    console.log("Error uploading file to Cloudinary:", error.message);
    return null;
  }
};

export { uploadImageonCloudinary };
