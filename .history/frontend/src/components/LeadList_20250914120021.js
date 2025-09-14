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
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: '', description: '', status: 'New', value: '' });

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
        <button 
          className={`btn ${showAddForm ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Lead'}
        </button>
      </div>

      <div className="lead-filters">
        <select 
          className="form-select"
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
        <div className="card">
          <form onSubmit={handleAddLead} className="add-lead-form form-grid">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Lead Title"
                value={newLead.title}
                onChange={(e) => setNewLead({...newLead, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-textarea"
                placeholder="Description"
                value={newLead.description}
                onChange={(e) => setNewLead({...newLead, description: e.target.value})}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                className="form-input"
                placeholder="Value"
                value={newLead.value}
                onChange={(e) => setNewLead({...newLead, value: e.target.value})}
              />
            </div>
            <div className="form-group">
              <select
                className="form-select"
                value={newLead.status}
                onChange={(e) => setNewLead({...newLead, status: e.target.value})}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Lead</button>
          </form>
        </div>
      )}

      <div className="leads-grid">
        {filteredLeads.map(lead => (
          <div key={lead._id} className="lead-card">
            {editingId === lead._id ? (
              <div className="lead-edit-form">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Lead Title"
                    value={editDraft.title}
                    onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className="form-textarea"
                    placeholder="Description"
                    value={editDraft.description}
                    onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Value"
                    value={editDraft.value}
                    onChange={(e) => setEditDraft({ ...editDraft, value: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <select
                    className="form-select"
                    value={editDraft.status}
                    onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value })}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div className="actions">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token');
                        const res = await fetch(`/api/leads/${lead._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify(editDraft)
                        });
                        if (!res.ok) throw new Error('Failed to update lead');
                        setEditingId(null);
                        fetchLeads();
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>{lead.title}</h3>
                <p>{lead.description}</p>
                <p>Value: ${lead.value}</p>
                <div className="lead-status">
                  <select
                    className="form-select status-select"
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
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => { setEditingId(lead._id); setEditDraft({ title: lead.title || '', description: lead.description || '', status: lead.status || 'New', value: lead.value || '' }); }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteLead(lead._id)}
                  >
                    Delete
                  </button>
                </div>
                <small>Created: {new Date(lead.createdAt).toLocaleDateString()}</small>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadList;
