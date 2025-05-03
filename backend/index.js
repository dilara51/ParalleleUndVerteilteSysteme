const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json()); 


let items = [];
let idCounter = 1;


app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const { name, quantity } = req.body;
  if (!name || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const existing = items.find(i => i.name === name);
  if (existing) {
    existing.quantity += quantity;
    return res.json(existing);
  }

  const newItem = { id: idCounter++, name, quantity };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Server starten
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express-Server läuft auf http://localhost:${PORT}`);
});
