// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Temporary product data
const products = [
  { id: 1, name: "Summer Shirt", price: 1500, image: "https://via.placeholder.com/100" },
  { id: 2, name: "Kids Dress", price: 1200, image: "https://via.placeholder.com/100" },
  { id: 3, name: "Beach Hat", price: 800, image: "https://via.placeholder.com/100" },
  { id: 4, name: "Linen Shorts", price: 1300, image: "https://via.placeholder.com/100" },
  { id: 5, name: "Floral Maxi Dress", price: 2800, image: "https://via.placeholder.com/100" },
  { id: 6, name: "Casual Sandals", price: 1900, image: "https://via.placeholder.com/100" }
];

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Simulate purchase (POST)
app.post('/api/checkout', (req, res) => {
  const { name, address, phone, paymentMethod, items } = req.body;

  if (!name || !address || !phone || !paymentMethod || !items?.length) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  console.log("New Order Received:");
  console.log("Customer:", name);
  console.log("Items:", items);
  console.log("Payment Method:", paymentMethod);

  res.json({
    message: "Payment successful! Order confirmed.",
    orderId: Math.floor(Math.random() * 100000)
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
