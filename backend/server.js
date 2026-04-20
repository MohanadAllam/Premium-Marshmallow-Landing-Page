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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Please create a .env file and add EMAIL_USER and EMAIL_PASS if you want email notifications.`);
});
