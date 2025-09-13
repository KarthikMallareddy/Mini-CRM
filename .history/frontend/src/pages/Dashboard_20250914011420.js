import React, { useState, useEffect } from 'react';
import { CustomerList, LeadList } from '../components';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>CRM Dashboard</h1>
      <div className="dashboard-content">
        <div className="customers-section">
          <CustomerList 
            customers={customers} 
            onSelectCustomer={setSelectedCustomer}
            onCustomersChange={fetchCustomers}
          />
        </div>
        {selectedCustomer && (
          <div className="leads-section">
            <LeadList customerId={selectedCustomer.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
