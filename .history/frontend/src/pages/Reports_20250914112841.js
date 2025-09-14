import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

  const pieChartData = {
    labels: Object.keys(stats.leadsByStatus),
    datasets: [
      {
        label: 'Leads by Status',
        data: Object.values(stats.leadsByStatus),
        backgroundColor: [
          '#3b82f6', // New - Blue
          '#f59e0b', // Contacted - Orange
          '#10b981', // Converted - Green
          '#ef4444', // Lost - Red
        ],
        borderColor: [
          '#2563eb',
          '#d97706',
          '#059669',
          '#dc2626',
        ],
        borderWidth: 2,
      },
    ],
  };

  const customerGrowthData = {
    labels: stats.customerGrowth.map(item => item.month),
    datasets: [
      {
        label: 'New Customers',
        data: stats.customerGrowth.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const revenueData = {
    labels: stats.revenueByMonth.map(item => item.month),
    datasets: [
      {
        label: 'Revenue ($)',
        data: stats.revenueByMonth.map(item => item.revenue),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

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
    <div className="reports">
      <div className="container">
        <div className="reports-header">
          <h1>Analytics & Reports</h1>
          <p className="text-muted">
            Insights into your customer relationships and business performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon customers">👥</div>
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-label">Total Customers</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon leads">📊</div>
            <div className="stat-value">{stats.totalLeads}</div>
            <div className="stat-label">Total Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon customers">✅</div>
            <div className="stat-value">{stats.leadsByStatus.Converted || 0}</div>
            <div className="stat-label">Converted Leads</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Leads by Status</h3>
            <Pie data={pieChartData} options={pieOptions} />
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Customer Growth (Last 6 Months)</h3>
            <Bar data={customerGrowthData} options={chartOptions} />
          </div>

          <div className="chart-card" style={{ gridColumn: 'span 2' }}>
            <h3 className="chart-title">Revenue Trend (Last 6 Months)</h3>
            <Bar data={revenueData} options={chartOptions} />
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
                  {Object.entries(stats.leadsByStatus).map(([status, count]) => (
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
                  {stats.customerGrowth.map((item, index) => (
                    <tr key={item.month}>
                      <td className="p-sm border-b">{item.month}</td>
                      <td className="text-right p-sm border-b">{item.count}</td>
                      <td className="text-right p-sm border-b">
                        ${stats.revenueByMonth[index]?.revenue.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
