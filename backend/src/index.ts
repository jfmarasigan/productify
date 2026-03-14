import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";

const app = express();

app.use(cors({
  origin: ENV.FRONTEND_URL
}));
app.use(clerkMiddleware()); // auth obj will be attached to req
app.use(express.json()); // parses JSON request body
app.use(express.urlencoded()); // parses form data (HTML forms)

app.get("/", (req, res) => {
  res.json({ 
    message: "welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    success : true 
  });
});

app.listen(ENV.PORT, () => {
  console.log(`Server is runing at port ${ENV.PORT}`);
});
