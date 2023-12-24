import { Router } from 'express';
import { getItems, getItem, createItem, deleteItem, getItemsSorted } from '../controllers/Items.js';


const router = new Router()

router.get('/', getItems)

router.get('/sort/:sort/sortOpton/:sortOption/category/:category', getItemsSorted)

// /sortOpton/:sortOption/sort/:sort/category/:category
// sortOpton - (по якій позиції сортувати)
// sort - (1 або -1 в залежності в якому порядку треба відсортувати)
// category (категорія товару)
// приклад (/sortOpton/titleFstPart/sort/-1/category/none)

router.get('/item/:id', getItem)

router.post('/item', createItem)

router.delete('/item', deleteItem)


export default router