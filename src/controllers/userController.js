import { users } from '../db/memoryDB.js';
import { createUser } from '../models/userModel.js';
import { validateUUID } from '../utils/validateUUID.js';

export const getAllUsers = (req, res) => {
  res.status(200).json(users);
};

export const getUserById = (req, res) => {
  const { userId } = req.params;

  if (!validateUUID(userId)) return res.status(400).json({ message: 'Invalid UUID' });

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json(user);
};

export const createNewUser = (req, res) => {
  const { username, age, hobbies } = req.body;

  if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
    return res.status(400).json({ message: 'Invalid user data' });
  }

  const newUser = createUser({ username, age, hobbies });
  users.push(newUser);

  res.status(201).json(newUser);
};
