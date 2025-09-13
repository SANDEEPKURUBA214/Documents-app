import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {createDoc,getDocs,getDocById,updateDoc,deleteDoc,searchDocs,getActivityFeed,getAllDocs, // newsearchMyDocs, // new
 } from "../controllers/docController.js";

const router = express.Router();

router.route("/")
.post(protect, createDoc)
.get(protect, getDocs); 

router.get("/all", protect, getAllDocs);

router.get("/search", protect, searchDocs); // global search
router.get("/activity", protect, getActivityFeed);
router.route("/:id")
.get(protect, getDocById)
.put(protect, updateDoc)
.delete(protect, deleteDoc);
export default router;