
// Tüm route dosyalarını burada topluyoruz.

import { Router } from 'express';
import helpRouter from './help.routes.js'; 

// import other routers here if you have them, e.g. authRouter, boardRouter

const router = Router();

router.use('api/help', helpRouter);

// başka route'ları da buraya ekle:
// router.use('/auth', authRouter);
// router.use('/boards', boardRouter);

export default router;
