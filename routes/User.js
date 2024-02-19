import { Router } from 'express';
import { UpdateInfo, addItemToBasket } from '../controllers/User.js';


const router = new Router()

router.patch('/user/edit', UpdateInfo)

router.patch('/basket/add', addItemToBasket)

export default router