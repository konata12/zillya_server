import express  from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

//routes import
import usersRoute from './routes/User.js';
import faqsRoute from './routes/Faqs.js';
import itemsRoute from './routes/Items.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
// const PORT = 5000

//middlewares
app.use(express.json());


//routes 
app.use('/api/users', usersRoute)
app.use('/api/faqs', faqsRoute)
app.use('/api/items', itemsRoute)

//start func
async function start() {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@test.dkgdzdg.mongodb.net/?retryWrites=true&w=majority`)
        app.listen(PORT , () => console.log(`server started on port: ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start()