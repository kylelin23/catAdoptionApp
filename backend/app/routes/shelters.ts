import { Router } from "express";
import { searchShelters } from "../apis/searchShelters";
import { shelterRateLimiter } from "../apis/rateLimiter";

export const sheltersRouter = Router();

sheltersRouter.get("/", shelterRateLimiter, searchShelters);
