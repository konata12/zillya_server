import { Router } from 'express';
import { Register, Login, GetMe, updateInfo } from '../controllers/User.js';
import { checkAuth } from '../utils/checkAuth.js';


const router = new Router()

router.post('/user', Register)

router.post('/user/:email', Login)

router.get('/user', checkAuth, GetMe)

router.patch('/user/:id', checkAuth, updateInfo)



export default router