import "dotenv/config";
import express from "express";
import cors from "cors";
import { storiesRouter } from "./routes/stories";

// Listens for requests from frontend
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/stories", storiesRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
