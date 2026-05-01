import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { LogIn, UserPlus, Settings, Save, Home, ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from './Logo.jpeg';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [settings, setSettings] = useState({ availableAmount: '', nextHarvestDate: '' });
  const [orders, setOrders] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('http://localhost:5000/api/settings')
        .then(res => res.json())
        .then(data => setSettings(data))
        .catch(err => console.error(err));

      fetch('http://localhost:5000/api/orders')
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const endpoint = authMode === 'login' ? '/api/admin/login' : '/api/admin/signup';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authForm),
      });

      const data = await response.json();

      if (response.ok) {
        if (authMode === 'login') {
          setIsAuthenticated(true);
        } else {
          Swal.fire('Success', 'Admin created successfully. Please log in.', 'success');
          setAuthMode('login');
          setAuthForm({ username: '', password: '' });
        }
      } else {
        Swal.fire('Error', data.error || 'Authentication failed', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Connection error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        Swal.fire('Success', 'Settings updated successfully', 'success');
      } else {
        Swal.fire('Error', 'Failed to update settings', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Connection error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDaysRemaining = () => {
    if (!settings.nextHarvestDate) return null;
    const today = new Date();
    today.setHours(0,0,0,0);
    const harvestDate = new Date(settings.nextHarvestDate);
    const timeDiff = harvestDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'Harvest date has passed.';
    if (daysDiff === 0) return 'Harvest is today!';
    return `Next harvest is in ${daysDiff} days.`;
  };

  const handleClearOrders = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to recover these orders!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bd4a3c',
      cancelButtonColor: '#4a4036',
      confirmButtonText: 'Yes, clear them!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'DELETE'
        });

        if (response.ok) {
          setOrders([]);
          Swal.fire('Cleared!', 'All orders have been deleted.', 'success');
        } else {
          Swal.fire('Error', 'Failed to clear orders', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Connection error', 'error');
      }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="app-container">
      <header className="app-header" style={{ padding: '2rem 0' }}>
        <img src={logo} alt="Logo" className="header-logo" />
        <Link to="/" style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> Back to Site
        </Link>
      </header>

      <section className="booking-section" style={{ minHeight: '60vh' }}>
        <motion.div
          className="form-container"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {!isAuthenticated ? (
            <>
              <h2 className="form-title">{authMode === 'login' ? 'Admin Login' : 'Admin Signup'}</h2>
              <form onSubmit={handleAuthSubmit}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-input"
                    value={authForm.username}
                    onChange={handleAuthChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    value={authForm.password}
                    onChange={handleAuthChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : (authMode === 'login' ? (
                    <><LogIn size={18} style={{ display: 'inline', marginRight: '8px' }} /> Login</>
                  ) : (
                    <><UserPlus size={18} style={{ display: 'inline', marginRight: '8px' }} /> Signup</>
                  ))}
                </button>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {authMode === 'login' ? 'Create new admin account' : 'Already have an account? Login'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="form-title"><Settings size={28} style={{ display: 'inline', marginRight: '10px' }} /> Dashboard Settings</h2>
              
              {settings.nextHarvestDate && (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                  {calculateDaysRemaining()}
                </div>
              )}

              <form onSubmit={handleSettingsSubmit}>
                <div className="form-group">
                  <label className="form-label">Available Mushroom Amount (Kg)</label>
                  <input
                    type="text"
                    name="availableAmount"
                    className="form-input"
                    value={settings.availableAmount}
                    onChange={handleSettingsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Next Harvest Date</label>
                  <input
                    type="date"
                    name="nextHarvestDate"
                    className="form-input"
                    value={settings.nextHarvestDate}
                    onChange={handleSettingsChange}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (
                    <><Save size={18} style={{ display: 'inline', marginRight: '8px' }} /> Save Settings</>
                  )}
                </button>
              </form>
              
              <hr style={{ margin: '3rem 0 2rem 0', borderColor: 'rgba(189, 74, 60, 0.2)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="form-title" style={{ fontSize: '2rem', marginBottom: 0 }}>Recent Orders</h2>
                {orders.length > 0 && (
                  <button 
                    onClick={handleClearOrders}
                    style={{ background: '#bd4a3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                  >
                    <Trash2 size={16} /> Clear All
                  </button>
                )}
              </div>
              
              {orders.length === 0 ? (
                <p style={{ textAlign: 'center', opacity: 0.8 }}>No orders have been placed yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(189, 74, 60, 0.2)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{order.name}</strong>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{order.amount} {order.unit}</span>
                      </div>
                      <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--primary)' }}>
                        <div><strong>Phone:</strong> {order.phone}</div>
                        <div><strong>Email:</strong> {order.email}</div>
                        <div><strong>Address:</strong> {order.address}</div>
                        <div style={{ opacity: 0.7, fontSize: '0.85rem', marginTop: '0.5rem' }}>
                          Date: {new Date(order.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
            </>
          )}
        </motion.div>
      </section>
    </div>
  );
}

export default AdminDashboard;
