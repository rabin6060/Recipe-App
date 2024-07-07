import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 7000,
  cors: process.env.CORS,
  mongoDbConnectionUrl: process.env.MONGO_URL,
  accessKeySecret: process.env.ACCESS_KEY || 'access',
  refreshKeySecret: process.env.REFRESH_KEY || 'refresh',
  email_host: process.env.EMAIL_HOST,
  email_port:process.env.EMAIL_PORT || 25,
  email_username:process.env.EMAIL_USER,
  email_password:process.env.EMAIL_PASSWORD,
  cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET
};
