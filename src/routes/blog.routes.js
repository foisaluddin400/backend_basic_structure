import express from "express";
import {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import protect, { adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET blogs - only for logged-in users (user or admin)
router.get("/",  getBlogs);
router.get("/:id", protect, getSingleBlog); 

// Admin-only routes
router.post("/", protect, adminOnly, createBlog);
router.put("/:id", protect, adminOnly, updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

export default router;
