import { Router } from 'express';
import { Register, Login, GetMe, updateInfo } from '../controllers/User.js';


const router = new Router()

router.post('/user', Register)

router.get('/user/:id', GetMe)

router.post('/user/:email', Login)

router.patch('/user/:id', updateInfo)



export default router