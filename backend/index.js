import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import booksRoute from './routes/booksRoute.js';
import usersRoute from './routes/usersRoute.js';
import cors from 'cors';

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());  // Allow all origins

// Default route
app.get('/', (request, response) => {
    return response.status(234).send('Welcome To Mern Stack Tutorial');
});

// Routes
app.use('/books', booksRoute);
app.use('/api/auth', usersRoute);  // Authentication routes under /api/auth

// MongoDB connection and server start
mongoose
   .connect(mongoDBURL)
   .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
   })
   .catch((error) => {
        console.log(error);
   });
