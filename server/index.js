import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 5000;

app.use(express.json({limit: "10mb"}));

app.use(express.urlencoded({limit: '10mb', extended: true}));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});