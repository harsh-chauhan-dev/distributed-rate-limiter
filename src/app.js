import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Distributed Rate Limiter API"
  });
});

export default app;