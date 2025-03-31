import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from './utils/database.js';
import { connectDB } from './utils/database.js';
import db from './models/index.js';


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Function to start the server properly
const startServer = async () => {
    try {
        connectDB();
        // Start the server after everything is ready
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error starting the server:', error);
        process.exit(1); // Exit the process if there's a failure
    }
};

// Call the function to start everything
startServer();

// Routes
import router from './routes/authRoutes.js';
app.use('/api/auth', router);

import routerUser from './routes/userRoutes.js';
app.use('/api/module', routerUser);

import eqRouter from './routes/eqRoutes.js';
app.use('/api/manage', eqRouter);


