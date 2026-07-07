import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { z } from "zod";
import { createStory } from "../apis/createStory";
import { getApprovedStories } from "../apis/getApprovedStories";
import { uploadPhoto } from "../apis/uploadPhoto";
import { notifyModerator } from "../apis/notifyModerator";

export const storiesRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 },
});

const CreateStorySchema = z.object({
  name: z.string().max(100).optional(),
  cat_name: z.string().min(1).max(100),
  how_met: z.string().max(2000).optional(),
  cat_description: z.string().max(2000).optional(),
  memorable_story: z.string().max(2000).optional(),
  best_part: z.string().max(2000).optional(),
  photos: z.array(z.string().url()).max(10).optional(),
});

function validateCreateStory(req: Request, res: Response, next: NextFunction) {
  const result = CreateStorySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }
  (req as any).validated = result.data;
  next();
}

function handleUploadErrors(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Photo must be 5MB or smaller" });
  }
  if (err)
    return res.status(400).json({ error: err.message || "Upload failed" });
  next();
}

storiesRouter.get("/", getApprovedStories);
storiesRouter.post("/", validateCreateStory, createStory);
storiesRouter.post(
  "/photos",
  upload.single("file"),
  handleUploadErrors,
  uploadPhoto,
);
storiesRouter.post("/notify", notifyModerator);
