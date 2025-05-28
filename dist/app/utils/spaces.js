"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToSpaces = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../config"));
// Initialize the S3 client for DigitalOcean Spaces
const s3Client = new client_s3_1.S3Client({
    endpoint: config_1.default.spaces.url, // Replace with your endpoint
    region: config_1.default.spaces.region, // Replace with your region if necessary
    credentials: {
        accessKeyId: config_1.default.spaces.accessKey, // Your access key
        secretAccessKey: config_1.default.spaces.secretKey, // Your secret key
    },
});
// Function to generate a unique file name using Date.now() and random string
const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const randomString = crypto_1.default.randomBytes(8).toString("hex");
    const extension = originalName.split(".").pop(); // Get file extension
    return `${timestamp}-${randomString}.${extension}`;
};
// Utility function to upload image to DigitalOcean Spaces
const uploadToSpaces = (file_1, ...args_1) => __awaiter(void 0, [file_1, ...args_1], void 0, function* (file, folder = "" // Default to empty string if no folder is provided
) {
    const uniqueFileName = generateUniqueFileName(file.originalname);
    // Construct the Key including the folder name if provided
    const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;
    const params = {
        Bucket: config_1.default.spaces.bucket,
        Key: key, // Use the constructed key
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: client_s3_1.ObjectCannedACL.public_read, // Set the ACL to public-read
    };
    try {
        // Upload the file to DigitalOcean Spaces
        yield s3Client.send(new client_s3_1.PutObjectCommand(params));
        // Return the URL of the uploaded file
        const url = `${config_1.default.spaces.image_url}/${key}`; // Use the constructed key for the URL
        console.log(url);
        return url;
    }
    catch (err) {
        console.error("Error uploading to DigitalOcean Spaces:", err);
        return null;
    }
});
exports.uploadToSpaces = uploadToSpaces;
