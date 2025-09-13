 // controllers/docController.js
import Document from "../models/Document.js";
 // Create document
export const createDoc = async (req, res) => {
 try {
    const { title, content, tags } = req.body;
    const doc = await Document.create({
    title,
    content,
    tags: tags || [],
    summary: "",
    createdBy: req.user._id,
    });
    res.status(201).json(doc);
} catch (error) {
    console.error("CreateDoc Error:", error);
    res.status(500).json({ message: error.message });
}
};
  
 // \u2728 NEW: Everyone (auth) can see **all** docs (view-only enforced on 

export const getAllDocs = async (req, res) => {
    try {
    const docs = await Document.find().populate("createdBy", "name email role");
    res.json(docs);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    };
 // Get docs for current user (My Docs)
export const getDocs = async (req, res) => {
    try {
    const docs = await Document.find({ createdBy: req.user._id }).populate(
    "createdBy",
    "name email role"
    );
    res.json(docs);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    };
 // Get single doc
export const getDocById = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id).populate(
        "createdBy",
        "name email");
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
    } catch (error) {
    res.status(500).json({ message: error.message });
 }
 };
 // Update doc (owner or admin)
export const updateDoc = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    if (
    doc.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin") {
    return res
    .status(403)
    .json({ message: "Not authorized to update this document" });
    }
 // Save old version before updating
    doc.versions.push({
 
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
        summary: doc.summary,
        editedAt: new Date(),
        });
        doc.title = req.body.title ?? doc.title;
        doc.content = req.body.content ?? doc.content;
        doc.tags = req.body.tags ?? doc.tags;
        doc.summary = req.body.summary ?? doc.summary;
        const updatedDoc = await doc.save();
        res.json(updatedDoc);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    };
 // Delete doc (owner or admin)
 export const deleteDoc = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: "Document not found" });
        if (
        doc.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin") {
        return res
        .status(403)
        .json({ message: "Not authorized to delete this document" });
    }
     await doc.deleteOne();
     res.json({ message: "Document deleted successfully" });
     } catch (error) {
     res.status(500).json({ message: error.message });
 }
 };
 // Last 5 edits (Activity Feed)
 export const getActivityFeed = async (req, res) => {
 try {
    const docs = await Document.find()
    .sort({ updatedAt:-1 })
    .limit(5)
    .populate("createdBy", "name email");
    res.json(docs);
    } catch (error) {
 
    res.status(500).json({ message: error.message });
 }
 };
 // Global text search (title/content) over ALL docs
 export const searchDocs = async (req, res) => {
    try {
        const query = req.query.q || "";
        const docs = await Document.find({
        $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        ],
        }).populate("createdBy", "name email");
        res.json(docs);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    };
