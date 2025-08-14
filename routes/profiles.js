import express from "express";
import { body, query, param, validationResult } from "express-validator";
import Profile from "../models/Profile.js";
import { slugify } from "../utils/slugify.js";

const router = express.Router();

// GET /profiles/by-name?name=John%20Doe  (exact name or case-insensitive)
router.get("/by-name",
  query("name").isString().trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name } = req.query;
    const slug = slugify(name);
    const profile = await Profile.findOne({ slug });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  }
);

// GET /profiles/slug/:slug
router.get("/slug/:slug",
  param("slug").isString().trim().notEmpty(),
  async (req, res) => {
    const profile = await Profile.findOne({ slug: req.params.slug });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  }
);

// POST /profiles  (create or upsert by name)
router.post("/",
  body("name").isString().trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = req.body || {};
    const slug = slugify(payload.name);

    const doc = await Profile.findOneAndUpdate(
      { slug },
      { ...payload, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(doc);
  }
);

// PUT /profiles/:slug (update)
router.put("/:slug",
  param("slug").isString().trim().notEmpty(),
  async (req, res) => {
    const doc = await Profile.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: "Profile not found" });
    res.json(doc);
  }
);

export default router;
