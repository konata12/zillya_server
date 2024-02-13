import { Router } from 'express';
import { VerificateEmail, Register, Login, GetSession, updateInfo, Logout } from '../controllers/User.js';
import { checkAuth } from '../utils/checkAuth.js';


const router = new Router()

router.post('/', VerificateEmail)

router.get('/register/:id', Register)

router.post('/login', Login)

router.post('/logout', Logout)

router.get('/user', GetSession)

router.patch('/user/edit', updateInfo)

export default router