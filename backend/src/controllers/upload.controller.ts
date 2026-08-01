import { Request, Response } from "express";

// ==========================
// Upload File Controller
// ==========================
export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("========== UPLOAD DEBUG ==========");
    console.log("Headers:", req.headers);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("==================================");

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: `/uploads/${req.file.filename}`,
      },
    });
  } catch (error: any) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
};