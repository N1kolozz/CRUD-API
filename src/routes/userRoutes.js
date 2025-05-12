import express from 'express';
import {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', createNewUser);
router.put('/:userId', updateUser);    
router.delete('/:userId', deleteUser);  

export default router;
