import express from 'express';
import {
  getAllUsers,
  getUserById,
  createNewUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', createNewUser);



export default router;
