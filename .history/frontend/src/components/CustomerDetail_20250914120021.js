import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeadList from './LeadList';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/customers/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch customer');
        const data = await res.json();
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!customer) return <div>Not found</div>;

  return (
    <div className="customer-detail">
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{customer.name}</h2>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Company:</strong> {customer.company}</p>
      <p><strong>Phone:</strong> {customer.phone}</p>
      <hr />
      <LeadList customerId={customer._id || id} />
    </div>
  );
};

export default CustomerDetail;
