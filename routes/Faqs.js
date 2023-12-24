import { Router } from 'express';
import { createFaq, deleteFaq, getFaqs } from '../controllers/Faqs.js';


const router = new Router()

router.get('/', getFaqs)

router.post('/faq', createFaq)

router.delete('/faq', deleteFaq)

export default router