import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import config from "../config";

// Initialize the S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
  endpoint: config.spaces.url, // Replace with your endpoint
  region: config.spaces.region, // Replace with your region if necessary
  credentials: {
    accessKeyId: config.spaces.accessKey as string, // Your access key
    secretAccessKey: config.spaces.secretKey as string, // Your secret key
  },
});

// Function to generate a unique file name using Date.now() and random string
const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  const extension = originalName.split(".").pop(); // Get file extension
  return `${timestamp}-${randomString}.${extension}`;
};

// Utility function to upload image to DigitalOcean Spaces
export const uploadToSpaces = async (
  file: Express.Multer.File,
  folder?: string
): Promise<string | null> => {
  const uniqueFileName = `${generateUniqueFileName(file.originalname)}`;
  const params = {
    Bucket: config.spaces.bucket, // Replace with your Space name
    Key: uniqueFileName, // The full path in the bucket (folder + unique file name)
    Body: file.buffer, // The file's buffer content
    ContentType: file.mimetype, // Optional: Set the content type
  };

  try {
    // Upload the file to DigitalOcean Spaces
    await s3Client.send(new PutObjectCommand(params));

    // Return the URL of the uploaded file
    const url = `${config.spaces.image_url}/${uniqueFileName}`;
    console.log(url);
    return url;
  } catch (err) {
    console.error("Error uploading to DigitalOcean Spaces:", err);
    return null;
  }
};
