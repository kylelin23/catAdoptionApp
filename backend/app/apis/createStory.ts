import { Request, Response } from "express";
import { supabase } from "../supabaseClient";

const MAX_PENDING_STORIES = 3;

export async function createStory(req: Request, res: Response) {
  const input = (req as any).validated;

  const { count, error: countError } = await supabase
    .from("cat_stories")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (countError) return res.status(500).json({ error: countError.message });

  if (count !== null && count >= MAX_PENDING_STORIES) {
    return res
      .status(429)
      .json({ error: "Story limit reached, try again later" });
  }

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
