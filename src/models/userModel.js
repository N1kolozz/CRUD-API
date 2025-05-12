import { v4 as uuidv4 } from 'uuid';

export function createUser({ username, age, hobbies }) {
  return {
    id: uuidv4(),
    username,
    age,
    hobbies,
  };
}
