import React, { useEffect, useState } from 'react';

type Item = {
  id: number;
  name: string;
  quantity: number;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then(res => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  const addItem = async () => {
    const res = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity }),
    });

    if (res.ok) {
      const item = await res.json();
      setItems((prev) =>
        prev.find((i) => i.name === item.name)
          ? prev.map((i) => (i.name === item.name ? item : i))
          : [...prev, item]
      );
      setName('');
      setQuantity(1);
    } else {
      console.error('Fehler beim Hinzufügen');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>🛒 Shopping-List</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} (x{item.quantity})
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={addItem}>Hinzufügen</button>
      </div>
    </div>
  );
}

export default App;
