import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// ------ My own cloudinary configuration ------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFilesonCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(`File uploaded on cloudinary. File src: ${response.url}`);
    // ------ Once file is uploaded, we would like to delete from our own server ------
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Error on cloudinary", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from cloudinary, Public Id: ", publicId);
  } catch (error) {
    console.log("Error deleting from cloudinary", error);
    return null;
  }
};

export { deleteFromCloudinary, uploadFilesonCloudinary };
