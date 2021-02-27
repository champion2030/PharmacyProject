import dotenv from 'dotenv';

dotenv.config();

export default {
  secret: process.env.SECRET,
  port: process.env.PORT || 5000,
  environment: process.env.NODE_ENV,

}
