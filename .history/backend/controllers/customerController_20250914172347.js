// controllers/customerController.js
import Customer from "../models/Customer.js";
import Lead from "../models/Lead.js";

// Create customer
export const createCustomer = async (req, res) => {
  try {
    console.log("Creating customer with data:", req.body);
    console.log("User:", req.user);
    
    const { name, email, phone, company } = req.body;
    if (!name) return res.status(400).json({ message: "Customer name is required." });

    const customerData = {
      name,
      email: email || "", // Default to empty string if email not provided
      phone: phone || "",
      company: company || "",
      ownerId: req.user.id,
    };

    console.log("Customer data to create:", customerData);
    
    const customer = await Customer.create(customerData);
    console.log("Customer created successfully:", customer);

    res.status(201).json({
      success: true,
      data: customer,
      message: "Customer created successfully"
    });
  } catch (err) {
    console.error("createCustomer error:", err);
    console.error("Error details:", err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        details: err.message 
      });
    }
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// List customers with pagination + search
export const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNum = Math.max(parseInt(page, 10), 1);
    const lim = Math.max(parseInt(limit, 10), 1);

    // build search query
    const searchRegex = { $regex: search, $options: "i" };
    const q = {
      $or: [{ name: searchRegex }, { email: searchRegex }, { company: searchRegex }]
    };

    // If non-admin, restrict to own customers
    if (req.user.role !== "Admin") q.ownerId = req.user.id;

    const total = await Customer.countDocuments(q);
    const customers = await Customer.find(q)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .lean();

    res.json({
      data: customers,
      page: pageNum,
      limit: lim,
      total,
      totalPages: Math.ceil(total / lim),
    });
  } catch (err) {
    console.error("getCustomers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single customer (with leads)
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id).lean();
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Access control: only owner or admin
    if (req.user.role !== "Admin" && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const leads = await Lead.find({ customerId: id }).sort({ createdAt: -1 }).lean();
    res.json({ ...customer, leads });
  } catch (err) {
    console.error("getCustomerById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // only owner or admin
    if (req.user.role !== "Admin" && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = (({ name, email, phone, company }) => ({ name, email, phone, company }))(req.body);
    Object.keys(updates).forEach(k => { if (updates[k] !== undefined) customer[k] = updates[k]; });

    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error("updateCustomer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete customer + cascade delete leads
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (req.user.role !== "Admin" && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Lead.deleteMany({ customerId: id });
    await Customer.findByIdAndDelete(id);

    res.json({ message: "Customer and related leads deleted" });
  } catch (err) {
    console.error("deleteCustomer:", err);
    res.status(500).json({ message: "Server error" });
  }
};
