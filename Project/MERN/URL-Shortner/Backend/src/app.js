import express from "express";
import cors from "cors";
import urlRoutes from "./router/urlShorten.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", urlRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to URL Shortener API");
});

export default app;