import { Request, Response, NextFunction } from "express";

const requestsByIp = new Map<string, number[]>();

const WINDOW_MS = 1 * 60 * 1000;
const MAX_REQUESTS = 60;

function getClientIp(req: Request): string {
  return (req.headers["cf-connecting-ip"] as string) || req.ip || "unknown";
}

export function shelterRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const ip = getClientIp(req);
  const now = Date.now();

  let timestamps = requestsByIp.get(ip) || [];
  timestamps = timestamps.filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    return res
      .status(429)
      .json({ error: "Too many requests, please try again later" });
  }

  timestamps.push(now);
  requestsByIp.set(ip, timestamps);

  next();
}
