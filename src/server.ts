import express from "express";
import { Engine } from "./engine.js";

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/battle", (req, res) => {
  const battle = Engine.createBattle();
  res.json(battle);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
