import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 7000,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
};