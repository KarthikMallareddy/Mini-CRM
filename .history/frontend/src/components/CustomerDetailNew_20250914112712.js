import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LeadList } from './index';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/customers/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          setError('Customer not found');
        } else {
          throw new Error('Failed to fetch customer');
        }
        return;
      }
      
      const data = await res.json();
      setCustomer(data);
      setEditForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      
      if (!res.ok) throw new Error('Failed to update customer');
      
      const updatedCustomer = await res.json();
      setCustomer({ ...updatedCustomer, leads: customer.leads });
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this customer and all associated leads?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to delete customer');
      
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="customer-detail">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            Loading customer details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-detail">
        <div className="container">
          <div className="alert alert-error">
            {error}
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="customer-detail">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-message">Customer not found</div>
            <div className="empty-state-description">
              The customer you're looking for doesn't exist or has been removed.
            </div>
            <Link to="/dashboard" className="btn btn-primary">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-detail">
      <div className="container">
        <div className="customer-detail-header">
          <div className="flex justify-between items-center">
            <div>
              <nav className="text-sm text-muted mb-sm">
                <Link to="/dashboard" className="text-primary">Dashboard</Link> / Customer Details
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">
                {customer.name}
              </h1>
              <p className="text-muted">
                Customer since {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-sm">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="customer-detail-content">
          <div className="card">
            <div className="card-header">
              <h2>Customer Information</h2>
            </div>
            <div className="card-body">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-lg">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-sm" style={{ gridColumn: 'span 2' }}>
                    <button type="submit" className="btn btn-success">
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-lg">
                  <div>
                    <h4>Contact Information</h4>
                    <p><strong>Email:</strong> {customer.email}</p>
                    <p><strong>Phone:</strong> {customer.phone || 'Not provided'}</p>
                    <p><strong>Company:</strong> {customer.company || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4>Statistics</h4>
                    <p><strong>Total Leads:</strong> {customer.leads?.length || 0}</p>
                    <p><strong>Active Leads:</strong> {customer.leads?.filter(l => l.status !== 'Lost' && l.status !== 'Converted').length || 0}</p>
                    <p><strong>Converted Leads:</strong> {customer.leads?.filter(l => l.status === 'Converted').length || 0}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Associated Leads</h2>
            </div>
            <div className="card-body p-0">
              <LeadList 
                customerId={customer._id} 
                onLeadsChange={fetchCustomer}
                hideHeader={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
