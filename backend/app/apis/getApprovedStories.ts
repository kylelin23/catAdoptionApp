import { Request, Response } from "express";
import { supabase } from "../supabaseClient";

export async function getApprovedStories(req: Request, res: Response) {
  const { data, error } = await supabase
    .from("cat_stories")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}
