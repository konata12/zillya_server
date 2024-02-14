import { Router } from 'express';
import { VerificateEmail, Register, Login, GetSession, Logout } from '../controllers/Auth.js';


const router = new Router()

router.post('/', VerificateEmail)

router.get('/register/:id', Register)

router.post('/login', Login)

router.post('/logout', Logout)

router.get('/user', GetSession)

export default router