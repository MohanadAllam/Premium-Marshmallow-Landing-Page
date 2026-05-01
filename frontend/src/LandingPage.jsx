import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Send, MapPin, Mail, Phone, User, Package, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from './Logo.jpeg';

function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    unit: 'kg',
    amount: '',
    email: '',
    address: ''
  });

  const [availableAmount, setAvailableAmount] = useState('Loading...');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => setAvailableAmount(data.availableAmount))
      .catch(err => setAvailableAmount('Unknown'));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Your order has been placed successfully. We will contact you soon.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#000'
        });
        setFormData({ name: '', phone: '', unit: 'kg', amount: '', email: '', address: '' });
      } else {
        Swal.fire({
          title: 'Error',
          text: data.error || 'An unexpected error occurred',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#000'
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        title: 'Connection Error',
        text: 'Unable to connect to the server. Make sure the backend is running.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#000'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} alt="Logo" className="header-logo" />
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Luxury Mushrooms
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            An unforgettable experience of rich taste and perfect texture. Crafted with meticulous care for connoisseurs of excellence.
          </motion.p>
          <motion.div
             style={{ marginTop: '1rem', padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', display: 'inline-block' }}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.8 }}
          >
            <strong>Available Stock:</strong> {availableAmount} Kg
          </motion.div>
        </motion.div>
      </section>

      {/* Product Showcase */}
      <section className="product-showcase">
        <div className="product-grid">
          <motion.div
            className="product-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <motion.img
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src="https://th.bing.com/th/id/R.5d7a4321a23723e1ce579057d4b58a23?rik=O5bvED5ZAfoQkg&riu=http%3a%2f%2fposterjackcanada.files.wordpress.com%2f2012%2f09%2ftoadstool-mushroom-fall-leaves.jpg&ehk=rkGc9DFf9W%2fnEi8g8U4Q6Ew1EttMayTXfCMdUdhjO3Q%3d&risl=1&pid=ImgRaw&r=0"
              alt="Premium White Marshmallows"
              className="product-img"
            />
          </motion.div>

          <motion.div
            className="product-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={{ delay: 0.2 }}
          >
            <motion.img
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              src="https://wallpapers.com/images/hd/mushroom-types-pictures-d6edg1uadeerhe40.jpg"
              alt="Toasted Gourmet Marshmallow"
              className="product-img"
            />
          </motion.div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="booking-section">
        <motion.div
          className="form-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="form-title">Place your order now</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><User size={18} style={{ display: 'inline', marginRight: '8px' }} />Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Place Hold Your Name"
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Phone size={18} style={{ display: 'inline', marginRight: '8px' }} /> WhatsApp Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Place Hold Your Phone Number"
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Package size={18} style={{ display: 'inline', marginRight: '8px' }} /> Unit Of Measurement</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="unit"
                    value="kg"
                    checked={formData.unit === 'kg'}
                    onChange={handleChange}
                    required
                  />
                  Kilogram
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="unit"
                    value="g"
                    checked={formData.unit === 'g'}
                    onChange={handleChange}
                    required
                  />
                  Gram
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">The Amount You Want ({formData.unit === 'kg' ? 'Kg' : 'Gram'})</label>
              <input
                type="number"
                name="amount"
                className="form-input"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1"
                placeholder="Ex : 5"
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Mail size={18} style={{ display: 'inline', marginRight: '8px' }} /> Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label"><MapPin size={18} style={{ display: 'inline', marginRight: '8px' }} /> Delivery Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Place Hold Your Address"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : (
                <>
                  <Send size={18} style={{ display: 'inline', marginLeft: '8px' }} />
                  Confirm Booking
                </>
              )}
            </button>
          </form>
        </motion.div>
      </section>
      
      {/* Footer Link to Admin Dashboard */}
      <footer style={{ textAlign: 'center', padding: '2rem' }}>
        <Link to="/admin" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} /> Admin Login
        </Link>
      </footer>
    </div>
  );
}

export default LandingPage;
