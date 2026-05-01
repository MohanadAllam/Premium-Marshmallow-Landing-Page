import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS  // Your Gmail App Password
  }
});

// Orders file path
const ordersPath = path.join(__dirname, 'orders.json');

// Ensure orders file exists
if (!fs.existsSync(ordersPath)) {
  fs.writeFileSync(ordersPath, JSON.stringify([]));
}

const adminPath = path.join(__dirname, 'admin.json');
if (!fs.existsSync(adminPath)) {
  fs.writeFileSync(adminPath, JSON.stringify({ admins: [] }, null, 2));
}

const settingsPath = path.join(__dirname, 'settings.json');
if (!fs.existsSync(settingsPath)) {
  const defaultSettings = { availableAmount: '100', nextHarvestDate: '' };
  fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
}

// Routes
app.post('/api/book', async (req, res) => {
  try {
    const { name, phone, unit, amount, email, address } = req.body;

    // Validate inputs
    if (!name || !phone || !unit || !amount || !email || !address) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    // Prepare order object
    const newOrder = {
      id: Date.now(),
      name,
      phone,
      unit,
      amount,
      email,
      address,
      date: new Date().toISOString()
    };

    // Save to orders.json
    const ordersData = fs.readFileSync(ordersPath, 'utf-8');
    const orders = JSON.parse(ordersData);
    orders.push(newOrder);
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

    // Send email notification (only if email is configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Sending to yourself
        subject: `New Marshmallow Order from: ${name}`,
        text: `
          New order received!
          
          Name: ${name}
          WhatsApp Number: ${phone}
          Amount: ${amount} ${unit === 'kg' ? 'Kilogram' : 'Gram'}
          Customer Email: ${email}
          Address: ${address}
        `
      };

      await transporter.sendMail(mailOptions);
    } else {
        console.warn("Email credentials not set in .env, skipping email sending.");
    }

    res.status(201).json({ message: 'Order submitted successfully', order: newOrder });

  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Sorry, an error occurred while processing the order' });
  }
});

// Admin & Orders Routes
app.get('/api/orders', (req, res) => {
  try {
    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
    res.json(ordersData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

app.delete('/api/orders', (req, res) => {
  try {
    fs.writeFileSync(ordersPath, JSON.stringify([]));
    res.json({ message: 'Orders cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear orders' });
  }
});

app.post('/api/admin/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf-8'));
  
  if (adminData.admins.find(a => a.username === username)) {
    return res.status(400).json({ error: 'Admin already exists' });
  }

  adminData.admins.push({ username, password });
  fs.writeFileSync(adminPath, JSON.stringify(adminData, null, 2));
  res.json({ message: 'Admin created successfully' });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf-8'));
  
  const admin = adminData.admins.find(a => a.username === username && a.password === password);
  if (admin) {
    res.json({ message: 'Login successful', token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Settings Routes
app.get('/api/settings', (req, res) => {
  const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  res.json(settingsData);
});

app.post('/api/settings', (req, res) => {
  const { availableAmount, nextHarvestDate } = req.body;
  const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  
  if (availableAmount !== undefined) settingsData.availableAmount = availableAmount;
  if (nextHarvestDate !== undefined) settingsData.nextHarvestDate = nextHarvestDate;

  fs.writeFileSync(settingsPath, JSON.stringify(settingsData, null, 2));
  res.json({ message: 'Settings updated successfully', settings: settingsData });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Please create a .env file and add EMAIL_USER and EMAIL_PASS if you want email notifications.`);
});
