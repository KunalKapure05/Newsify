import { Router } from 'express';
import { register, login, logout } from '../controllers/AuthController';
import { getUser, updateUserProfile } from '../controllers/ProfileController';
import jwtAuthMiddleware from '../middlewares/jwtAuth';
import { createNews, deleteNews, getAllNews, showNews, updateNews} from '../controllers/NewsController';
import redisCache from '../DB/redis';

const router = Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/logout', jwtAuthMiddleware, logout);

// Profile routes
router.get('/profile', jwtAuthMiddleware, getUser);
router.put('/profile/:id', jwtAuthMiddleware, updateUserProfile);

// News routes
router.post('/news', jwtAuthMiddleware, createNews);
router.get('/news',redisCache.route(), getAllNews);
router.get('/news/:id', showNews);  
router.put('/news/:id', jwtAuthMiddleware, updateNews);
router.delete('/news/:id', jwtAuthMiddleware,deleteNews);

export default router;
