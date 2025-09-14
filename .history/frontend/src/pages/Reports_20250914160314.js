import React, { useState, useEffect } from 'react';

// Interactive effects
const createInteractiveEffects = () => {
  const handleMouseMove = (e) => {
    // Dynamic background gradient following mouse (keeping this cool effect)
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', x + '%');
    document.documentElement.style.setProperty('--mouse-y', y + '%');
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  return () => document.removeEventListener('mousemove', handleMouseMove);
};

const Reports = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLeads: 0,
    totalRevenue: 0,
    leadsByStatus: {},
    customerGrowth: [],
    revenueByMonth: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportsData();
    
    // Initialize interactive effects
    const cleanupEffects = createInteractiveEffects();
    
    return cleanupEffects;
  }, []);

  const fetchReportsData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch customers
      const customersRes = await fetch('/api/customers?limit=1000', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const customersData = await customersRes.json();
      const customers = customersData.data || [];

      // Fetch all leads for all customers
      const leadsPromises = customers.map(customer =>
        fetch(`/api/customers/${customer._id}/leads`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).catch(() => [])
      );
      
      const allLeadsArrays = await Promise.all(leadsPromises);
      const allLeads = allLeadsArrays.flat();

      // Calculate statistics
      const leadsByStatus = {
        New: 0,
        Contacted: 0,
        Converted: 0,
        Lost: 0
      };

      let totalRevenue = 0;

      allLeads.forEach(lead => {
        leadsByStatus[lead.status] = (leadsByStatus[lead.status] || 0) + 1;
        if (lead.status === 'Converted' && lead.value) {
          totalRevenue += parseFloat(lead.value) || 0;
        }
      });

      // Customer growth by month (last 6 months)
      const now = new Date();
      const customerGrowth = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthNames[date.getMonth()];
        const count = customers.filter(customer => {
          const createdDate = new Date(customer.createdAt);
          return createdDate.getMonth() === date.getMonth() && 
                 createdDate.getFullYear() === date.getFullYear();
        }).length;
        
        customerGrowth.push({ month: monthName, count });
      }

      // Revenue by month (converted leads)
      const revenueByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthNames[date.getMonth()];
        const revenue = allLeads
          .filter(lead => {
            const createdDate = new Date(lead.createdAt);
            return lead.status === 'Converted' &&
                   createdDate.getMonth() === date.getMonth() && 
                   createdDate.getFullYear() === date.getFullYear();
          })
          .reduce((sum, lead) => sum + (parseFloat(lead.value) || 0), 0);
        
        revenueByMonth.push({ month: monthName, revenue });
      }

      setStats({
        totalCustomers: customers.length,
        totalLeads: allLeads.length,
        totalRevenue,
        leadsByStatus,
        customerGrowth,
        revenueByMonth
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Derived helpers for simple summaries (no charts)
  const leadStatusEntries = Object.entries(stats.leadsByStatus || {});
  const monthlyRows = stats.customerGrowth.map((item, index) => ({
    month: item.month,
    customers: item.count,
    revenue: stats.revenueByMonth[index]?.revenue || 0,
  }));

  if (loading) {
    return (
      <div className="reports">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            Loading reports...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports">
        <div className="container">
          <div className="alert alert-error">
            Failed to load reports: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Animated Background */}
      <div className="page-background">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="particles">
          {[...Array(25)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 25}s`,
                animationDuration: `${18 + Math.random() * 12}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="reports">
        <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Analytics & Reports</h1>
          <p className="text-muted">
            Insights into your customer relationships and business performance
          </p>
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
            <div className="stat-icon revenue">💰</div>
            <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card glass-interactive hover-lift">
            <div className="stat-icon customers">✅</div>
            <div className="stat-value">{stats.leadsByStatus.Converted || 0}</div>
            <div className="stat-label">Converted Leads</div>
          </div>
        </div>

        {/* Simple summaries instead of charts */}
        <div className="grid grid-cols-2 gap-xl">
          <div className="card glass-interactive hover-lift">
            <div className="card-header">
              <h3>Leads by Status</h3>
            </div>
            <div className="card-body">
              <ul className="list">
                {leadStatusEntries.map(([status, count]) => (
                  <li key={status} className="flex justify-between p-sm border-b">
                    <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
                    <span>{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card glass-interactive hover-lift">
            <div className="card-header">
              <h3>Highlights</h3>
            </div>
            <div className="card-body">
              <ul className="list">
                <li className="flex justify-between p-sm border-b">
                  <span>Best Month (Revenue)</span>
                  <span>
                    {monthlyRows.length
                      ? monthlyRows.reduce((a, b) => (a.revenue > b.revenue ? a : b)).month
                      : '-'}
                  </span>
                </li>
                <li className="flex justify-between p-sm border-b">
                  <span>Average Revenue</span>
                  <span>
                    ${monthlyRows.length
                      ? Math.round(
                          monthlyRows.reduce((s, r) => s + r.revenue, 0) / monthlyRows.length
                        ).toLocaleString()
                      : 0}
                  </span>
                </li>
                <li className="flex justify-between p-sm">
                  <span>Top Lead Status</span>
                  <span>
                    {leadStatusEntries.length
                      ? leadStatusEntries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                      : '-'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Summary Tables */}
        <div className="grid grid-cols-2 gap-xl">
          <div className="card">
            <div className="card-header">
              <h3>Lead Status Breakdown</h3>
            </div>
            <div className="card-body">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-sm border-b">Status</th>
                    <th className="text-right p-sm border-b">Count</th>
                    <th className="text-right p-sm border-b">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {leadStatusEntries.map(([status, count]) => (
                    <tr key={status}>
                      <td className="p-sm border-b">
                        <span className={`badge badge-${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                      <td className="text-right p-sm border-b">{count}</td>
                      <td className="text-right p-sm border-b">
                        {stats.totalLeads > 0 ? Math.round((count / stats.totalLeads) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Monthly Performance</h3>
            </div>
            <div className="card-body">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-sm border-b">Month</th>
                    <th className="text-right p-sm border-b">Customers</th>
                    <th className="text-right p-sm border-b">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyRows.map((row) => (
                    <tr key={row.month}>
                      <td className="p-sm border-b">{row.month}</td>
                      <td className="text-right p-sm border-b">{row.customers}</td>
                      <td className="text-right p-sm border-b">${row.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Reports;
