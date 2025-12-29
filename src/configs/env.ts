import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3333,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/order-management',
  jwtSecret: (process.env.JWT_SECRET || 'dev-secret-key') as string,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  apiPrefix: process.env.API_PREFIX || '/api',
};
