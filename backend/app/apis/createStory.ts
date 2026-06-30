import { Request, Response } from "express";
import { supabase } from "../supabaseClient";

export async function createStory(req: Request, res: Response) {
  const input = (req as any).validated;

  const { data, error } = await supabase.from("cat_stories").insert([
    {
      name: input.name?.trim() || "Anonymous",
      cat_name: input.cat_name.trim(),
      how_met: input.how_met?.trim() || "",
      cat_description: input.cat_description?.trim() || "",
      memorable_story: input.memorable_story?.trim() || "",
      best_part: input.best_part?.trim() || "",
      photos: input.photos?.length > 0 ? JSON.stringify(input.photos) : null,
      status: "pending",
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}
