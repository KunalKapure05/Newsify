import {Router} from 'express'
import {register,login,logout} from '../controllers/AuthController'
import{getUser, updateUserProfile} from '../controllers/ProfileController'
import jwtAuthMiddleware from '../middlewares/jwtAuth';

const router = Router();

router.post('/auth/register',register);
router.post('/auth/login',login);
router.get('/auth/logout',jwtAuthMiddleware,logout);


router.get('/profile',jwtAuthMiddleware,getUser)
router.put('/profile/:id',updateUserProfile)

export default router