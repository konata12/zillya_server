import { Router } from 'express';
import { createFaq } from '../controllers/Faqs.js';


const router = new Router()

router.post('/', createFaq)

// router.get('/:id', GetMe)

// router.get('/lecture/:id', GetLecture)

// router.post('/lecture', CreateLecture)

export default router