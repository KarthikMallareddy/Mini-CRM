import express from "express";
import Customer from "../models/Customer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add new customer
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    const customer = await Customer.create({ name, email, phone, company, ownerId: req.user.id });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customers (with search & pagination)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {
      $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
    };
    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
