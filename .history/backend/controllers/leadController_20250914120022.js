// controllers/leadController.js
import Lead from "../models/Lead.js";
import Customer from "../models/Customer.js";

// Create lead for a customer
export const createLeadForCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { title, description, status = "New", value = 0 } = req.body;
    if (!title) return res.status(400).json({ message: "Lead title is required." });

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // only owner or admin can create lead for the customer
    if (req.user.role !== "Admin" && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const lead = await Lead.create({ customerId, title, description, status, value });
    res.status(201).json(lead);
  } catch (err) {
    console.error("createLeadForCustomer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get leads for a customer
export const getLeadsForCustomer = async (req, res) => {
  try {
  const { customerId } = req.params;
  const { status } = req.query;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (req.user.role !== "Admin" && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const q = { customerId };
    if (status && ["New", "Contacted", "Converted", "Lost"].includes(status)) {
      q.status = status;
    }
    const leads = await Lead.find(q).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error("getLeadsForCustomer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update lead (by lead id)
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const customer = await Customer.findById(lead.customerId);
    if (!customer) return res.status(404).json({ message: "Parent customer not found" });

    if (req.user.role !== "Admin" && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = (({ title, description, status, value }) => ({ title, description, status, value }))(req.body);
    Object.keys(updates).forEach(k => { if (updates[k] !== undefined) lead[k] = updates[k]; });

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error("updateLead:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const customer = await Customer.findById(lead.customerId);
    if (!customer) return res.status(404).json({ message: "Parent customer not found" });

    if (req.user.role !== "Admin" && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Lead.findByIdAndDelete(id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    console.error("deleteLead:", err);
    res.status(500).json({ message: "Server error" });
  }
};
