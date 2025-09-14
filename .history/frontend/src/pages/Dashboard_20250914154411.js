import React, { useState, useEffect } from 'react';
import { CustomerList, LeadList } from '../components';

// Interactive effects
const createInteractiveEffects = () => {
  const handleMouseMove = (e) => {
    // Cursor trail
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX - 10 + 'px';
    trail.style.top = e.clientY - 10 + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => {
      trail.remove();
    }, 1000);
    
    // Dynamic background gradient following mouse
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', x + '%');
    document.documentElement.style.setProperty('--mouse-y', y + '%');
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  return () => document.removeEventListener('mousemove', handleMouseMove);
};

const Dashboard = () => {
  const [customers, setCustomers] = useState([]); 
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLeads: 0,
    activeLeads: 0,
    convertedLeads: 0
  });

  useEffect(() => {
    fetchCustomers();
    fetchStats();
    
    // Initialize interactive effects
    const cleanupEffects = createInteractiveEffects();
    
    return cleanupEffects;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (searchTerm) params.set('search', searchTerm);
      const res = await fetch(`/api/customers?${params.toString()}`, {
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

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get total customers count
      const customersRes = await fetch('/api/customers?limit=1000', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const customersData = await customersRes.json();
      const allCustomers = customersData.data || [];

      // Get leads for all customers
      const leadsPromises = allCustomers.slice(0, 50).map(customer =>
        fetch(`/api/customers/${customer._id}/leads`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).catch(() => [])
      );
      
      const allLeadsArrays = await Promise.all(leadsPromises);
      const allLeads = allLeadsArrays.flat();

      setStats({
        totalCustomers: customersData.total || allCustomers.length,
        totalLeads: allLeads.length,
        activeLeads: allLeads.filter(lead => lead.status === 'New' || lead.status === 'Contacted').length,
        convertedLeads: allLeads.filter(lead => lead.status === 'Converted').length
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      {/* Animated Background */}
      <div className="page-background">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="dashboard">
        <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">CRM Dashboard</h1>
          <p className="text-muted">Manage your customers and leads efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid stagger-children">
          <div className="stat-card glass-interactive hover-lift">
            <div className="stat-icon customers">👥</div>
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-label">Total Customers</div>
          </div>
          <div className="stat-card glass-interactive hover-lift">
            <div className="stat-icon leads">📊</div>
            <div className="stat-value">{stats.totalLeads}</div>
            <div className="stat-label">Total Leads</div>
          </div>
          <div className="stat-card glass-interactive hover-lift">
            <div className="stat-icon leads">🔥</div>
            <div className="stat-value">{stats.activeLeads}</div>
            <div className="stat-label">Active Leads</div>
          </div>
          <div className="stat-card glass-interactive hover-lift">
            <div className="stat-icon revenue">✅</div>
            <div className="stat-value">{stats.convertedLeads}</div>
            <div className="stat-label">Converted</div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="customers-section">
            <CustomerList 
              customers={customers} 
              onSelectCustomer={setSelectedCustomer}
              onCustomersChange={fetchCustomers}
              searchTerm={searchTerm}
              onSearchChange={(v) => { setPage(1); setSearchTerm(v); }}
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
    </div>
    </>
  );
};

export default Dashboard;
