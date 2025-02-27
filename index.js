import express from "express";
import { run } from "./openAI.js";
import connectToMongo from "./db.js";
import userRouter from "./routes/userRoute.js";
import journalRouter from "./routes/journalRoute.js";
import weekJournalRouter from "./routes/weekJournalRoute.js";
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://mood-tracker-journal-frontend.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.options(
  "*",
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const port = 9000;
connectToMongo();
app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/journals", journalRouter);
app.use("/weekJournals", weekJournalRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
