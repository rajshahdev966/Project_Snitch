import dotenv from "dotenv";
dotenv.config();

const config = {
  MONGO_URI: process.env.MONGO_URI,
  ACCESS_SECRET_TOKEN: process.env.ACCESS_SECRET_TOKEN,
  REFRESH_SECRET_TOKEN: process.env.REFRESH_SECRET_TOKEN,
  PORT: process.env.PORT,
};

export default config;
