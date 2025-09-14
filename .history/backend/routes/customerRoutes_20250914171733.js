









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
import {
  createLeadForCustomer,
  getLeadsForCustomer,
  updateLead,
  deleteLead
} from "../controllers/leadController.js";
import { leadSchema, leadUpdateSchema } from "../validationSchemas.js";

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

// Nested lead routes under customers
// Get leads for a customer
router.get("/:customerId/leads", protect, getLeadsForCustomer);

// Add lead under customer
router.post("/:customerId/leads", protect, validateRequest(leadSchema), createLeadForCustomer);

// Update lead
router.put("/:customerId/leads/:leadId", protect, validateRequest(leadUpdateSchema), updateLead);

// Delete lead
router.delete("/:customerId/leads/:leadId", protect, deleteLead);

export default router;
