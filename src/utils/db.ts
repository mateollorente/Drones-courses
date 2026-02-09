
// This acts as a mock database client using browser's localStorage
export interface User {
  name: string;
  email: string;
  password: string; // In a real app, never store plain passwords!
  dni: string;
}

const DB_KEY = 'aerovision_users';

export const db = {
  getUsers: (): User[] => {
    const usersStr = localStorage.getItem(DB_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  },

  register: (user: User): { success: boolean; message?: string } => {
    const users = db.getUsers();
    
    if (users.some(u => u.email === user.email)) {
      return { success: false, message: 'email_exists' };
    }
    
    if (users.some(u => u.dni === user.dni)) {
        return { success: false, message: 'dni_exists' };
    }

    users.push(user);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    return { success: true };
  },

  login: (email: string, password: string): { success: boolean; user?: User } => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      return { success: true, user };
    }
    return { success: false };
  }
};
