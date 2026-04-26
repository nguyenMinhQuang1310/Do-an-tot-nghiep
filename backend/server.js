require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { seedData } = require('./src/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const autoSeedEnabled = process.env.AUTO_SEED_ON_EMPTY !== 'false';
  if (autoSeedEnabled) {
    await seedData({
      connect: false,
      close: false,
      reset: false,
      skipIfHasData: true,
      exitOnFinish: false,
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();
