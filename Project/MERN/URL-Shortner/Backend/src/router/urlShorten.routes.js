import { Router } from "express";
import { createShortUrl, getShortUrl, redirectController } from "../controller/urlShortner.controller.js";

const urlRoutes = Router();

urlRoutes.post("/short", createShortUrl)
urlRoutes.get("/shorten", getShortUrl)
urlRoutes.get("/:id", redirectController);

export default urlRoutes;