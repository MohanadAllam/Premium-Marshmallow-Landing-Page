import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Send, MapPin, Mail, Phone, User, Package } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    unit: 'kg',
    amount: '',
    email: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real environment, replace 'http://localhost:5000' with your actual API url if deployed
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

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="app-container">
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
            Luxury Marshmallows
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            An unforgettable experience of rich taste and perfect texture. Crafted with meticulous care for connoisseurs of excellence.
          </motion.p>
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
              src="https://www.cairo24.com/Upload/libfiles/137/9/636.jpg"
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
              src="https://tse4.mm.bing.net/th/id/OIP.Gu9zHWilDIXF11OzRQwXJQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"
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
    </div>
  );
}

export default App;
