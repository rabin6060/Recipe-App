import mongoose from 'mongoose';
import logger from './logger';
import env from './env';

export const connectToDB = async () => {
  const connectionURL = env.mongoDbConnectionUrl;

  if (connectionURL) {
    try {
      await mongoose.connect(connectionURL);
      console.log('Connected to database successfully');
    } catch (error) {
      logger.error(error);
      logger.error('Connection To MongoDB Failed');
    }
  } else logger.error('Please provide MongoDB Connection URL');
};
