







import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { leadSchema } from "../validationSchemas.js";
import {
  createLeadForCustomer,
  getLeadsForCustomer,
  updateLead,
  deleteLead
} from "../controllers/leadController.js";

const router = express.Router();

// Add lead under customer
router.post("/:customerId", protect, validateRequest(leadSchema), createLeadForCustomer);

// Get leads for a customer
router.get("/:customerId", protect, getLeadsForCustomer);

// Update lead
router.put("/:id", protect, validateRequest(leadSchema), updateLead);

// Delete lead
router.delete("/:id", protect, deleteLead);

export default router;
