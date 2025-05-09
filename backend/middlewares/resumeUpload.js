import { v2 as cloudinary } from "cloudinary";

export const uploadResumeToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "resumes",
      resource_type: "auto", // required for PDFs or DOCX
      format: "pdf",
    });
    return result;
  } catch (error) {
    throw new Error("Cloudinary resume upload failed: " + error.message);
  }
};
