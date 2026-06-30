import urlModel from "../models/dbModel.js";
import { nanoid } from "nanoid";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    if (originalUrl.length > 2048) {
      return res.status(400).json({
        message: "URL is too long",
      });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(originalUrl);
    } catch {
      return res.status(400).json({
        message: "Invalid URL format",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        message: "Only HTTP/HTTPS URLs are allowed",
      });
    }

    const existingUrl = await urlModel.findOne({ originalUrl });

    if (existingUrl) {
      return res.status(200).json({
        message: "URL already shortened",
        shortenUrl: existingUrl.shortId,
      });
    }

    const id = nanoid(8);

    const newUrl = await urlModel.create({
      originalUrl,
      shortId: id,
    });

    return res.status(201).json({
      message: "URL shortened successfully",
      shortenUrl: newUrl.shortId,
    });
  } catch (err) {
    console.log("ERROR 👉", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getShortUrl = async (req, res) => {
  try {
    const urls = await urlModel.find();

    if (urls.length === 0) {
      return res.status(404).json({
        message: "No URLs found",
      });
    }

    return res.status(200).json({
      message: "Fetched successfully",
      data: urls,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const redirectController = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await urlModel.findOne({ shortId: id });

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    return res.redirect(url.originalUrl);
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
