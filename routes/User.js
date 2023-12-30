import { Router } from 'express';
import { Register, Login, GetMe, updateInfo } from '../controllers/User.js';
import { checkAuth } from '../utils/checkAuth.js';


const router = new Router()

router.post('/register', Register)

router.post('/login', Login)

router.get('/me', checkAuth, GetMe)

router.patch('/:id', checkAuth, updateInfo)



export default router