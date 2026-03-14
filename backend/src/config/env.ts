import dotenv from "dotenv";

// dotenv.config({ quiet : true }); // supress log messages except errors
dotenv.config();

export const ENV = {
  PORT : process.env.PORT,
  DB_URL : process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL
};