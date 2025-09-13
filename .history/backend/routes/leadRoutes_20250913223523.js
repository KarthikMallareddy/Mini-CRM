import express from "express";
import Lead from "../models/Lead.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add lead under customer
router.post("/:customerId", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, value } = req.body;
    const lead = await Lead.create({ customerId: req.params.customerId, title, description, status, value });
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leads for a customer
router.get("/:customerId", authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find({ customerId: req.params.customerId });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lead
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
