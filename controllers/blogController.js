// controllers/blogController.js
const Blogs = require("../models/blogs");
const mongoose = require("mongoose");

exports.getBlogs = async (req, res) => {
    try {
        const data = await Blogs.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const data = await Blogs.findById(id);

        if (!data) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};

// routes/blogRoutes.js
exports.deleteBlogs = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blogs.findByIdAndDelete(id);
        if (!deletedBlog)
            return res.status(404).json({ message: "Blog not found" });
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error deleting blog",
            error: err.message,
        });
    }
};

exports.addBlog = async (req, res) => {
    try {
        const { title, category, description, imageUrl, status, createdAt } =
            req.body;

        // Validate required fields
        if (!title || !category || !description || !imageUrl || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Optional: Set createdAt if not provided
        const blog = new Blogs({
            title,
            category,
            description,
            imageUrl,
            status,
            createdAt: createdAt || new Date().toISOString(),
        });

        const savedBlog = await blog.save();
        res.status(201).json({
            message: "Blog added successfully",
            blog: savedBlog,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error adding blog",
            error: err.message,
        });
    }
};

// Edit a blog
exports.editBlogs = async (req, res) => {
    try {
        const { id, title, category, description, imageUrl, status } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Blog ID is required" });
        }

        // Validate required fields
        if (!title || !category || !description || !imageUrl || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find blog by ID and update
        const updatedBlog = await Blogs.findByIdAndUpdate(
            id,
            { title, category, description, imageUrl, status },
            { new: true, runValidators: true },
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error updating blog",
            error: err.message,
        });
    }
};
