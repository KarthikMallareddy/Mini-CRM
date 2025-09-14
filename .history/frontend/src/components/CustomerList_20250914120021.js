import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CustomerList = ({ customers, onSelectCustomer, onCustomersChange, searchTerm, onSearchChange }) => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const [editDraft, setEditDraft] = useState({ name: '', email: '', phone: '', company: '' });

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCustomer)
      });
      if (!res.ok) throw new Error('Failed to add customer');
      setNewCustomer({ name: '', email: '', phone: '', company: '' });
      setShowAddForm(false);
      onCustomersChange();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="customer-list">
      <div className="customer-list-header">
        <h2>Customers</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search customers..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : '+ Add Customer'}
        </button>
      </div>      {showAddForm && (
        <form onSubmit={handleAddCustomer} className="add-customer-form">
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
          />
          <input
            type="text"
            placeholder="Company"
            value={newCustomer.company}
            onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
          />
          <button type="submit">Add Customer</button>
        </form>
      )}

      <div className="customers-grid">
        {customers.map(customer => (
          <div 
            key={customer._id}
            className="customer-card"
            onClick={() => onSelectCustomer ? onSelectCustomer(customer) : navigate(`/customers/${customer._id}`)}
          >
            {editingId === customer._id ? (
              <div className="customer-edit-form" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder="Name"
                  value={editDraft.name}
                  onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editDraft.email}
                  onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={editDraft.phone}
                  onChange={(e) => setEditDraft({ ...editDraft, phone: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={editDraft.company}
                  onChange={(e) => setEditDraft({ ...editDraft, company: e.target.value })}
                />
                <div className="actions">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token');
                        const res = await fetch(`/api/customers/${customer._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify(editDraft)
                        });
                        if (!res.ok) throw new Error('Failed to update customer');
                        setEditingId(null);
                        onCustomersChange();
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
                <h3>{customer.name}</h3>
                <p>{customer.email}</p>
                <p>{customer.company}</p>
                <p>{customer.phone}</p>
                <div className="actions" onClick={(e) => e.stopPropagation()}>
                  <Link to={`/customers/${customer._id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => { setEditingId(customer._id); setEditDraft({ name: customer.name || '', email: customer.email || '', phone: customer.phone || '', company: customer.company || '' }); }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
                      if (!window.confirm('Delete this customer? This also removes related leads.')) return;
                      try {
                        const token = localStorage.getItem('token');
                        const res = await fetch(`/api/customers/${customer._id}`, {
                          method: 'DELETE',
                          headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (!res.ok) throw new Error('Failed to delete customer');
                        onCustomersChange();
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
