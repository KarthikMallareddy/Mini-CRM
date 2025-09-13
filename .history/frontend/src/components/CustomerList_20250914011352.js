import React, { useState } from 'react';

const CustomerList = ({ customers, onSelectCustomer, onCustomersChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAddForm && (
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
        {filteredCustomers.map(customer => (
          <div 
            key={customer._id} 
            className="customer-card"
            onClick={() => onSelectCustomer(customer)}
          >
            <h3>{customer.name}</h3>
            <p>{customer.email}</p>
            <p>{customer.company}</p>
            <p>{customer.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
