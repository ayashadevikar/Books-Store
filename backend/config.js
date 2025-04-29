import dotenv from 'dotenv';
dotenv.config();


  export const mongoDBURL = process.env.MONGODB_URL;
  export const JWT_SECRET = process.env.JWT_SECRET;
  export const PORT = process.env.PORT || 5000;
