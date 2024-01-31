import { Router } from 'express';
import { VerificateEmail, Register, Login, GetMe, updateInfo } from '../controllers/User.js';
import { checkAuth } from '../utils/checkAuth.js';


const router = new Router()

router.post('/', VerificateEmail)

router.get('/register/:id', Register)

router.post('/login', Login)

router.get('/user', GetMe)

router.patch('/:id', checkAuth, updateInfo)

export default router