import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'
import cookieParser from "cookie-parser";

//routes import
import authRoute from './routes/Auth.js';
import usersRoute from './routes/User.js';
import faqsRoute from './routes/Faqs.js';
import itemsRoute from './routes/Items.js';

//admin routes
import AdminUsersRoute from "./routes/admins/Users.js";
import AdminItemsRoute from "./routes/admins/Items.js";

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

//middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

//routes 
app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/faqs', faqsRoute)
app.use('/api/items', itemsRoute)

//admins route 
app.use('/api/admin/users', AdminUsersRoute)
app.use('/api/admin/items', AdminItemsRoute)


//start func
async function start() {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@test.dkgdzdg.mongodb.net/?retryWrites=true&w=majority`)
        app.listen(PORT, () => console.log(`server started on port: ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start()