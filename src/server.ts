import cors from 'cors';
import express, { Express } from 'express';
import { connectDatabase } from './configs/database';
import { env } from './configs/env';
import routes from './routes';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(env.apiPrefix, routes);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
      console.log(`📝 Environment: ${env.nodeEnv}`);
      console.log(`🔗 API: http://localhost:${env.port}${env.apiPrefix}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
