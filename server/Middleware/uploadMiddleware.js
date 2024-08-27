import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname issue in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the directories for CVs and photos
const cvDirectory = path.join(__dirname, "../uploads/cvs");
const photoDirectory = path.join(__dirname, "../uploads/photos");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cvFile") {
      cb(null, cvDirectory);
    } else if (file.fieldname === "photoFile") {
      cb(null, photoDirectory);
    } else {
      cb(new Error("Invalid file field name"), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "cvFile") {
    // Accept PDF and DOC/DOCX files
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid CV file type"), false);
    }
  } else if (file.fieldname === "photoFile") {
    // Accept image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid photo file type"), false);
    }
  } else {
    cb(new Error("Unknown file field"), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Export middleware for use in routes
export const uploadMiddleware = upload.fields([
  { name: "cvFile", maxCount: 1 },
  { name: "photoFile", maxCount: 1 },
]);

export default uploadMiddleware;
