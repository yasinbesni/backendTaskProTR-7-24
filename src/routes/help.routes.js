import { Router } from 'express';
import { sendHelpRequest } from '../controllers/help.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { helpSchema } from '../schemas/help.schema.js';


const router = Router();


router.post('/', validate(helpSchema), sendHelpRequest);
export default router;