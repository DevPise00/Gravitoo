const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- DEMO DATA (We will replace this with a database later) ---
const rentalListings = [
  { id: 1, name: 'Mahindra 575 DI', rate: '850', rateType: 'hour', type: 'Machine', status: 'Active', bookings: 3, earned: 7200 },
  { id: 2, name: 'John Deere W540', rate: '4500', rateType: 'day', type: 'Machine', status: 'Active', bookings: 2, earned: 5200 },
  { id: 3, name: 'Field Labour (2 workers)', rate: '600', rateType: 'day each', type: 'Labour', status: 'Paused', bookings: 3, earned: 0 },
];

// === ROUTES ===
app.get('/api', (req, res) => {
  res.json({ message: '👋 Welcome to the Gravitoo Backend API!' });
});

// API endpoint to get rental listings
app.get('/api/rentals', (req, res) => {
  // In the future, this will fetch data from your database
  res.json(rentalListings);
});

app.listen(PORT, () => {
  console.log(`Gravitoo backend server is running on http://localhost:${PORT}`);
});