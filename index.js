const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Main route
app.get('/', (req, res) => {
  res.send('Hello, Cloud Student! CI/CD is working.');
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

// Start server only if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
