import React, { useState, useEffect } from 'react';
import { CustomerList, LeadList } from '../components';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/customers?page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch customers');
      const data = await res.json();
      // backend returns { data, page, limit, total, totalPages }
      setCustomers(data.data || []);
      setTotalPages(data.totalPages || 1);
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
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
        {selectedCustomer && (
          <div className="leads-section">
            <LeadList customerId={selectedCustomer._id || selectedCustomer.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
