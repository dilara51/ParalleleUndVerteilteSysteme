const Fastify = require('fastify');
const cors = require('@fastify/cors');
const swagger = require('@fastify/swagger');
const swaggerUi = require('@fastify/swagger-ui');

const app = Fastify({ logger: true });

// CORS erlauben (für alle Domains – nur für Dev)
app.register(cors, { origin: true });

// Swagger Setup
app.register(swagger, {
  swagger: {
    info: {
      title: 'Shopping API',
      description: 'API for shopping list',
      version: '1.1.0'
    },
    host: 'localhost',
    schemes: ['http']
  }
});
app.register(swaggerUi);

// Dummy-Datenbank im Speicher
let items = [];
let idCounter = 1;

// GET /items
app.get('/items', async () => {
  return items;
});

// POST /items
app.post('/items', async (req, res) => {
  const { name, quantity } = req.body;
  if (!name || typeof quantity !== 'number') {
    res.code(400).send({ error: 'Invalid input' });
    return;
  }

  const existing = items.find(i => i.name === name);
  if (existing) {
    existing.quantity += quantity;
    return existing;
  }

  const newItem = { id: idCounter++, name, quantity };
  items.push(newItem);
  res.code(201);
  return newItem;
});

// GET /items/:id
app.get('/items/:id', async (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    res.code(404).send({ error: 'Item not found' });
    return;
  }
  return item;
});

// PUT /items/:id
app.put('/items/:id', async (req, res) => {
  const { name, quantity } = req.body;
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    res.code(404).send({ error: 'Item not found' });
    return;
  }
  item.name = name;
  item.quantity = quantity;
  return item;
});

// DELETE /items/:id
app.delete('/items/:id', async (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    res.code(404).send({ error: 'Item not found' });
    return;
  }
  items.splice(index, 1);
  res.code(204).send();
});

// Start
const start = async () => {
  try {
    await app.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
