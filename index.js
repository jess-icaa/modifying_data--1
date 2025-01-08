const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(bodyParser.json());

mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then (() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

const MenuItem = mongoose.model(
  'MenuItem',
  new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
  })
);

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }
    const newMenuItem = new MenuItem({ name, description, price });
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json({ message: 'Menu item created successfully.', menuItem: savedMenuItem });
  } catch (err) {
    res.status(500).json({ message: 'Error creating menu item.', error: err.message });
  }
});

app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu items.', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
