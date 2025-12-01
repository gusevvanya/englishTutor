import express from "express";
import 'dotenv/config';
import { getPrompt } from "./services/AI.ts";

const app = express();
const port = 3000;

import './telegramBot/index.ts';
app.use(express.json());
app.get("/", async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await getPrompt();

    res.send(doc);
  } catch (error) {
    res.status(500).send({ error: "Failed to read document" });
  }
});

app.post("/results", async (req, res) => {
  console.log(req.body);
    try {
    const doc = await getPrompt();

    res.send(doc);
  } catch (error) {
    res.status(500).send({ error: "Failed to read document" });
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
