import { Router } from "express";
import multer from "multer";
import { randomUUID as uuid } from "crypto";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default Router().post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file provided" });
  // mock URL — later replace with S3 / Cloudinary
  const id = uuid();
  res.status(201).json({
    id,
    filename: req.file.originalname,
    size: req.file.size,
    url: `/static/uploads/${id}-${req.file.originalname}`,
  });
});
