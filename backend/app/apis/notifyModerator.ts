import { Request, Response } from "express";

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY!;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY!;

export async function notifyModerator(req: Request, res: Response) {
  const { cat_name, name } = req.body;

  try {
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          accessToken: EMAILJS_PRIVATE_KEY,
          template_params: {
            name: name || "Anonymous",
            message: `A new cat story was submitted for "${cat_name}". Open the moderation panel to review it.`,
            email: "catwise78@gmail.com",
          },
        }),
      },
    );

    if (!response.ok) {
      console.log("EmailJS failed:", response.status, await response.text());
      return res.status(500).json({ error: "Email failed" });
    }

    res.json({ ok: true });
  } catch (e) {
    console.log("notifyModerator error:", e);
    res.status(500).json({ error: "Email failed" });
  }
}
