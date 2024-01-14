import { Router } from 'express';
import { getItems, getItem, createItem, deleteItem, changeItem } from '../../controllers/admins/Items.js';
// import { getItems, getItem, createItem, deleteItem, getItemsSorted } from '../controllers/Items.js';


const router = new Router()

router.get('/', getItems)

router.get('/item/:id', getItem)

router.post('/item', createItem)

router.patch('/item/:id', changeItem)

router.delete('/item', deleteItem)


export default router