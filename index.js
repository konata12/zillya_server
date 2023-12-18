import express  from "express"

//routes import
import faqsRoute from './routes/Faqs.js'



const app = express();
const PORT = 5000

app.use('/api/faqs', faqsRoute)
//start func
async function start() {
    try {
        app.listen(PORT , () => console.log(`server started on port: ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start()