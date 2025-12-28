import { Router } from 'express';
import { isAuthenticated, hasRole } from '../middleware/auth.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.get('/', isAuthenticated, hasRole('admin'), getAllUsers);
router.get('/:id', isAuthenticated, getUserById); // Can be self or admin
router.put('/:id', isAuthenticated, updateUser); // Can be self or admin
router.delete('/:id', isAuthenticated, hasRole('admin'), deleteUser);

export default router;
