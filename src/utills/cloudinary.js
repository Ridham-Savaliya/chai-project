import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAM,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadImageonCloudinary = async (localfilepath) => {
  try {
    if (localfilepath) return null;
    // upload the file on the cloudinary

    const res = await cloudinary.uploader.upload(localfilepath, {
      resource_type: auto,
    });

    console.log("File uploaded successfully", res.url);
    return res;
  } catch (error) {
    fs.unlinkSync(localfilepath);
    console.log("Error uploading file", error);
    return null;
  }
};


export { uploadImageonCloudinary };



