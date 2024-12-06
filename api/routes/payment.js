import { Router } from 'express';
import express from 'express'
const router = Router();
import { createOrder, reciveWebhook } from '../controllers/payment.controller.js';

router.post('/create-order', express.json(), createOrder);

router.get('/success', (req, res) => {
    res.redirect('/'); 
  });
  
  router.get('/failure', (req, res) => {
    res.redirect('/'); 
  });
  
  router.get('/pending', (req, res) => {
    res.redirect('/');
  });

router.post('/webhook', reciveWebhook);

export default router;