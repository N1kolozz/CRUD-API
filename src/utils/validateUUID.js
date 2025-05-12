import { validate as isUuid } from 'uuid';

export function validateUUID(id) {
  return isUuid(id);
}
