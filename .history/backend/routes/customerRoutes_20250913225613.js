








import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from "../controllers/customerController.js";

const router = express.Router();

// Add new customer
router.post("/", protect, createCustomer);

// Get customers (with search & pagination)
router.get("/", protect, getCustomers);

// Get customer by id (with leads)
router.get("/:id", protect, getCustomerById);

// Update customer
router.put("/:id", protect, updateCustomer);

// Delete customer
router.delete("/:id", protect, deleteCustomer);

export default router;
