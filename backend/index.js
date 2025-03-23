import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from './utils/database.js';
import { connectDB } from './utils/database.js';
import './models/UserTable.js';
import './models/NotificationTable.js';
import './models/BookingTable.js';
import './models/EquipmentTable.js';
import { Router } from 'express';




const app = express()

//sync tables using sequelize 
connectDB();
sequelize.sync({force: true}).then( () => {
    console.log('Database and tables synced');
})

//middleware
app.use(express.json());
app.use(cors());

//routes
// app.post('/api', regRoute);
import router from './routes/authRoutes.js';
app.use('/api/auth', router);

// app.post('/api', loginRoute);
import routerUser from './routes/userRoutes.js';
app.use('/api/module',routerUser);

import eqRouter from './routes/eqRoutes.js';
app.use('/api/manage', eqRouter);

import adminRouter from './routes/adminRoutes.js';
app.use('/api/admin',adminRouter);

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`server running on ${PORT} lol`);
})

