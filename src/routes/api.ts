import {Router} from 'express'
import {register,login,logout} from '../controllers/AuthController'
import{getUser} from '../controllers/ProfileController'
import jwtAuthMiddleware from '../middlewares/jwtAuth';

const router = Router();

router.post('/auth/register',register);
router.post('/auth/login',login);
router.get('/auth/logout',jwtAuthMiddleware,logout);


router.get('/profile',jwtAuthMiddleware,getUser)

export default router