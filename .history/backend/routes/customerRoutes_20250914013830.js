









import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { customerSchema, customerUpdateSchema } from "../validationSchemas.js";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from "../controllers/customerController.js";

const router = express.Router();

// Add new customer
router.post("/", protect, validateRequest(customerSchema), createCustomer);

// Get customers (with search & pagination)
router.get("/", protect, getCustomers);

// Get customer by id (with leads)
router.get("/:id", protect, getCustomerById);

// Update customer
router.put("/:id", protect, validateRequest(customerUpdateSchema), updateCustomer);

// Delete customer
router.delete("/:id", protect, deleteCustomer);

export default router;
