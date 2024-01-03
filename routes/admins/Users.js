import { Router } from 'express';
import { GetUsers } from '../../controllers/admins/Users.js';
// import { checkAuth } from '../utils/checkAuth.js';


const router = new Router()

// router.post('/', Register)

// router.post('/:email', Login)

router.get('/', GetUsers)

// router.patch('/:id', checkAuth, updateInfo)

export default router