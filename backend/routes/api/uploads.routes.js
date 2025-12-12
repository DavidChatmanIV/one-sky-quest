import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage: save files inside /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ensure folder exists
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

// POST /api/uploads/image
router.post("/image", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Public URL for Render or local dev
  const base = process.env.BASE_URL || "http://localhost:3000";
  const fileUrl = `${base}/uploads/${req.file.filename}`;

  res.json({ url: fileUrl });
});

export default router;
