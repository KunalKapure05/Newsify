import {Router} from 'express'
import {register,login,logout} from '../controllers/AuthController'
import{getUser, updateUserProfile} from '../controllers/ProfileController'
import jwtAuthMiddleware from '../middlewares/jwtAuth';
import { createNews, getAllNews, showNews } from '../controllers/NewsController';

const router = Router();

router.post('/auth/register',register);
router.post('/auth/login',login);
router.get('/auth/logout',jwtAuthMiddleware,logout);


router.get('/profile',jwtAuthMiddleware,getUser)
router.put('/profile/:id',updateUserProfile)


router.post('/news/',jwtAuthMiddleware,createNews);
router.get('/news/',getAllNews)
router.get('/news/:id',showNews)

export default router