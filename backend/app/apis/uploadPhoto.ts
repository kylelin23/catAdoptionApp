import { Request, Response } from "express";
import { supabase } from "../supabaseClient";

export async function uploadPhoto(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ error: "No file provided" });

  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

  const { error } = await supabase.storage
    .from("cat-photos")
    .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

  if (error) return res.status(500).json({ error: error.message });

  const { data } = supabase.storage.from("cat-photos").getPublicUrl(fileName);
  res.status(201).json({ url: data.publicUrl });
}
