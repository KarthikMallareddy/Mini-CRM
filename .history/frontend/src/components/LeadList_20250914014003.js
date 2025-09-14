import React, { useState, useEffect } from 'react';

const LeadList = ({ customerId }) => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({
    title: '',
    description: '',
    status: 'New',
    value: ''
  });

  useEffect(() => {
    if (customerId) {
      fetchLeads();
    }
  }, [customerId]);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === statusFilter));
    }
  }, [leads, statusFilter]);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const qs = statusFilter === 'All' ? '' : `?status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(`/api/customers/${customerId}/leads${qs}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    // refetch when filter changes
    if (customerId) fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/customers/${customerId}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newLead)
      });
      if (!res.ok) throw new Error('Failed to add lead');
      setNewLead({ title: '', description: '', status: 'New', value: '' });
      setShowAddForm(false);
      fetchLeads();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update lead');
      fetchLeads();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete lead');
      fetchLeads();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="lead-list">
      <div className="lead-list-header">
        <h2>Leads</h2>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Lead'}
        </button>
      </div>

      <div className="lead-filters">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddLead} className="add-lead-form">
          <input
            type="text"
            placeholder="Lead Title"
            value={newLead.title}
            onChange={(e) => setNewLead({...newLead, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={newLead.description}
            onChange={(e) => setNewLead({...newLead, description: e.target.value})}
          />
          <input
            type="number"
            placeholder="Value"
            value={newLead.value}
            onChange={(e) => setNewLead({...newLead, value: e.target.value})}
          />
          <select
            value={newLead.status}
            onChange={(e) => setNewLead({...newLead, status: e.target.value})}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
          <button type="submit">Add Lead</button>
        </form>
      )}

      <div className="leads-grid">
        {filteredLeads.map(lead => (
          <div key={lead._id} className="lead-card">
            <h3>{lead.title}</h3>
            <p>{lead.description}</p>
            <p>Value: ${lead.value}</p>
            <div className="lead-status">
              <select
                value={lead.status}
                onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div className="actions">
              <button onClick={() => deleteLead(lead._id)}>Delete</button>
            </div>
            <small>Created: {new Date(lead.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadList;
