import { hardcodedUsers } from './credentials';

export const authenticateUser = (username: string, password: string): boolean => {
  const user = hardcodedUsers.find(
    (u) => u.username === username && u.password === password
  );
  return !!user; // Returns true if user exists, false otherwise
};
