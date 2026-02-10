// This acts as a mock database client using browser's localStorage

export interface UserProgress {
  courseId: string;
  currentModuleIdx: number;
  currentLessonIdx: number;
  completedLessons: string[]; // lesson IDs
  lastAccessed: number;
}

export interface User {
  name: string;
  email: string;
  password: string; // In a real app, never store plain passwords!
  dni: string;
  role: 'admin' | 'student';
  enrolledCourses?: string[]; // IDs of courses purchased
  progress?: UserProgress[];
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string; // markdown text or url/base64
}

export interface Lesson {
  id: string;
  title: string;
  type: 'theory' | 'quiz';
  content: string; // Legacy support (backup)
  blocks?: ContentBlock[]; // New multi-content structure
  videoUrl?: string; // Optional url for video (Legacy)
  duration?: string; // e.g. "10 min"
  quizData?: {
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
  };
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  modules: Module[];
  published: boolean;
  price?: string;
  duration?: string;
  level?: string;
}

const DB_USERS_KEY = 'aerovision_users';
const DB_COURSES_KEY = 'aerovision_courses';
const DB_MESSAGES_KEY = 'aerovision_messages';

export interface Message {
  id: string;
  fromEmail: string;
  toEmail: string;
  text: string;
  timestamp: number;
  read: boolean;
}

// Helper for ID generation
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// --- REAL-TIME MOCK (Observer Pattern) ---
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(cb => cb());
};

// Listen for changes in other tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'aerovision_messages' || e.key === 'aerovision_users') {
    notifyListeners();
  }
});

// Initial Mock Data
const INITIAL_ADMIN: User = {
  name: 'Admin User',
  email: 'admin@aerovision.com',
  password: 'admin123',
  dni: 'ADMIN001',
  role: 'admin',
  enrolledCourses: [],
  progress: []
};

const INITIAL_STUDENT: User = {
  name: 'Joako',
  email: 'joako@gmail.com',
  password: 'user123',
  dni: '12345678A',
  role: 'student',
  enrolledCourses: ['course-001'],
  progress: [
    {
      courseId: 'course-001',
      currentModuleIdx: 0,
      currentLessonIdx: 1,
      completedLessons: ['1'],
      lastAccessed: Date.now()
    }
  ]
};

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'Fundamentos de Operaciones de Vuelo',
    description: 'Curso introductorio para obtener la certificación básica de piloto de drones.',
    thumbnail: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
    published: true,
    price: '299€',
    duration: '6 Semanas',
    level: 'Principiante',
    modules: [
      {
        id: 'mod-001',
        title: "Módulo 1: Seguridad y Normativa",
        lessons: [
          {
            id: '1',
            title: "Introducción a la Seguridad Aérea",
            type: "theory",
            content: "...",
            blocks: [
              { id: 'b1', type: 'text', content: "# Introducción a la Seguridad Aérea\\n\\nLa seguridad es el pilar fundamental de toda operación aérea. En este curso aprenderás los conceptos básicos para operar de forma segura y legal." },
              { id: 'b2', type: 'image', content: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800" },
              { id: 'b3', type: 'text', content: "Recuerda siempre revisar el entorno antes de cada vuelo." }
            ]
          },
          { id: '2', title: "Check-list Pre-vuelo", type: "quiz", content: "...", quizData: { question: 'Antes de encender los motores...', options: [{ id: 'a', text: 'a', isCorrect: false }] } },
          {
            id: '3',
            title: "Zonas de Restricción (CTR)",
            type: "theory",
            content: "# Zonas CTR\\n\\nLas zonas de control (CTR) son espacios aéreos controlados...",
            blocks: [
              { id: 'b4', type: 'text', content: "# Zonas CTR\\n\\nLas zonas de control (CTR) son espacios aéreos controlados que protegen el tráfico de los aeropuertos." },
              { id: 'b5', type: 'video', content: "https://www.youtube.com/embed/dQw4w9WgXcQ" } // Example placeholder video
            ]
          }
        ]
      },
      {
        id: 'mod-002',
        title: "Módulo 2: Meteorología Básica",
        lessons: [
          {
            id: '4',
            title: "Lectura de METAR",
            type: "theory",
            content: "# METAR\\n\\nAprende a leer los informes meteorológicos aeronáuticos...",
            blocks: [
              { id: 'b6', type: 'text', content: "# METAR\\n\\nAprende a leer los informes meteorológicos aeronáuticos. Un METAR es un informe de rutina..." }
            ]
          },
          {
            id: '5',
            title: "Viento y Turbulencia",
            type: "theory",
            content: "# Viento\\n\\nEl enemigo número uno de los drones ligeros...",
            blocks: [
              { id: 'b7', type: 'text', content: "# Viento\\n\\nEl enemigo número uno de los drones ligeros es el viento racheado." }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-002',
    title: 'Fotogrametría Aérea Avanzada',
    description: 'Domina el arte de crear mapas y modelos 3D precisos utilizando drones.',
    thumbnail: 'https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=800',
    published: true,
    price: '450€',
    duration: '8 Semanas',
    level: 'Avanzado',
    modules: [
      {
        id: 'mod-photo-1',
        title: 'Conceptos de Fotogrametría',
        lessons: [
          {
            id: 'l-ph-1',
            title: 'Solape y Recubrimiento',
            type: 'theory',
            content: 'Frontlap y Sidelap son cruciales...',
            blocks: [
              { id: 'b8', type: 'text', content: "Frontlap y Sidelap son cruciales para obtener un buen modelo 3D..." }
            ]
          }
        ]
      }
    ]
  }
];

export const db = {
  // --- USER METHODS ---
  getUsers: (): User[] => {
    const usersStr = localStorage.getItem(DB_USERS_KEY);
    let users: User[] = usersStr ? JSON.parse(usersStr) : [];

    // CLEANUP FIRST: Remove old/wrong mock users
    const oldMocks = ['joako@example.com', 'juan@example.com'];
    users = users.filter(u => !oldMocks.includes(u.email));

    // Ensure admin exists
    const adminIndex = users.findIndex(u => u.email === INITIAL_ADMIN.email);
    if (adminIndex >= 0) {
      if (users[adminIndex].role !== 'admin') {
        users[adminIndex] = INITIAL_ADMIN;
      }
    } else {
      users.push(INITIAL_ADMIN);
    }

    // Ensure Joako exists and has correct data
    const joakoIndex = users.findIndex(u => u.email === INITIAL_STUDENT.email);
    if (joakoIndex === -1) {
      // Joako doesn't exist at all, add him
      users.push(INITIAL_STUDENT);
    } else {
      // Joako exists (registered manually) - ensure he has enrolled courses
      const joako = users[joakoIndex];
      if (!joako.enrolledCourses || joako.enrolledCourses.length === 0) {
        joako.enrolledCourses = INITIAL_STUDENT.enrolledCourses;
      }
      if (!joako.progress || joako.progress.length === 0) {
        joako.progress = INITIAL_STUDENT.progress;
      }
      // Force role to student just in case
      if (joako.role !== 'student') {
        joako.role = 'student';
      }
    }

    // ALWAYS clean old mock messages (only truly old ones)
    const allMessagesStr = localStorage.getItem(DB_MESSAGES_KEY);
    let allMessages: Message[] = allMessagesStr ? JSON.parse(allMessagesStr) : [];

    // Only remove messages from deprecated mock users
    const initialCount = allMessages.length;
    allMessages = allMessages.filter(m =>
      !oldMocks.includes(m.fromEmail) && !oldMocks.includes(m.toEmail)
    );

    if (allMessages.length !== initialCount) {
      localStorage.setItem(DB_MESSAGES_KEY, JSON.stringify(allMessages));
    }

    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
    return users;
  },

  register: (user: Omit<User, 'role'>): { success: boolean; message?: string } => {
    const users = db.getUsers();

    if (users.some(u => u.email === user.email)) {
      return { success: false, message: 'email_exists' };
    }

    if (users.some(u => u.dni === user.dni)) {
      return { success: false, message: 'dni_exists' };
    }

    const newUser: User = { ...user, role: 'student' }; // Default role is student
    users.push(newUser);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
    return { success: true };
  },

  login: (email: string, password: string): { success: boolean; user?: User } => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      return { success: true, user };
    }
    return { success: false };
  },

  // --- COURSE METHODS ---
  getCourses: (): Course[] => {
    const coursesStr = localStorage.getItem(DB_COURSES_KEY);
    if (!coursesStr) {
      // Initialize with mock data if empty
      localStorage.setItem(DB_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    return JSON.parse(coursesStr);
  },

  getCourseById: (id: string): Course | undefined => {
    const courses = db.getCourses();
    return courses.find(c => c.id === id);
  },

  saveCourse: (course: Course): boolean => {
    try {
      const courses = db.getCourses();
      const index = courses.findIndex(c => c.id === course.id);

      if (index >= 0) {
        courses[index] = course;
      } else {
        courses.push(course);
      }
      localStorage.setItem(DB_COURSES_KEY, JSON.stringify(courses));
      return true;
    } catch (error) {
      console.error("Error saving course:", error);
      return false;
    }
  },

  deleteCourse: (id: string): void => {
    let courses = db.getCourses();
    courses = courses.filter(c => c.id !== id);
    localStorage.setItem(DB_COURSES_KEY, JSON.stringify(courses));
  },

  // --- PROGRESS METHODS ---
  saveProgress: (email: string, progress: UserProgress): void => {
    const users = db.getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex >= 0) {
      const user = users[userIndex];
      if (!user.progress) user.progress = [];

      const existingProgIndex = user.progress.findIndex(p => p.courseId === progress.courseId);
      if (existingProgIndex >= 0) {
        user.progress[existingProgIndex] = progress;
      } else {
        user.progress.push(progress);
      }

      localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
      // If this is the current session user, update session too
      const session = localStorage.getItem('aerovision_user_session');
      if (session) {
        const sessionUser = JSON.parse(session);
        if (sessionUser.email === email) {
          localStorage.setItem('aerovision_user_session', JSON.stringify(user));
        }
      }
    }
  },

  getProgress: (email: string, courseId: string): UserProgress | undefined => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    return user?.progress?.find(p => p.courseId === courseId);
  },

  // --- ENROLLMENT METHODS ---
  enrollUser: (email: string, courseId: string): boolean => {
    const users = db.getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex >= 0) {
      const user = users[userIndex];
      if (!user.enrolledCourses) user.enrolledCourses = [];

      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));

        // Update session
        const session = localStorage.getItem('aerovision_user_session');
        if (session) {
          const sessionUser = JSON.parse(session);
          if (sessionUser.email === email) {
            sessionUser.enrolledCourses = user.enrolledCourses;
            localStorage.setItem('aerovision_user_session', JSON.stringify(sessionUser));
          }
        }
        return true;
      }
    }
    return false;
  },

  isEnrolled: (email: string, courseId: string): boolean => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    // Admin has access to everything
    if (user?.role === 'admin') return true;
    return user?.enrolledCourses?.includes(courseId) || false;
  },

  // --- MESSAGING METHODS ---
  getMessages: (userEmail: string, otherEmail: string): Message[] => {
    const allMessagesStr = localStorage.getItem(DB_MESSAGES_KEY);
    const allMessages: Message[] = allMessagesStr ? JSON.parse(allMessagesStr) : [];

    return allMessages.filter(m =>
      (m.fromEmail === userEmail && m.toEmail === otherEmail) ||
      (m.fromEmail === otherEmail && m.toEmail === userEmail)
    ).sort((a, b) => a.timestamp - b.timestamp);
  },

  getAllConversations: (): { userEmail: string; lastMessage: Message | null; unreadCount: number }[] => {
    const allMessagesStr = localStorage.getItem(DB_MESSAGES_KEY);
    const allMessages: Message[] = allMessagesStr ? JSON.parse(allMessagesStr) : [];
    const adminEmail = INITIAL_ADMIN.email;

    // Get all students
    const users = db.getUsers();
    const students = users.filter(u => u.role === 'student');

    // Group messages by student email
    const conversations = new Map<string, Message[]>();

    allMessages.forEach(msg => {
      const otherParty = msg.fromEmail === adminEmail ? msg.toEmail : msg.fromEmail;
      if (otherParty === adminEmail) return;

      const existing = conversations.get(otherParty) || [];
      existing.push(msg);
      conversations.set(otherParty, existing);
    });

    // Create result list for ALL students
    return students.map(student => {
      const msgs = conversations.get(student.email) || [];
      msgs.sort((a, b) => a.timestamp - b.timestamp);

      const last = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const unread = msgs.filter(m => m.toEmail === adminEmail && !m.read).length;

      return { userEmail: student.email, lastMessage: last, unreadCount: unread };
    }).sort((a, b) => {
      // Sort by: Unread first, then recent timestamp, then name
      if (a.unreadCount !== b.unreadCount) return b.unreadCount - a.unreadCount;
      const timeA = a.lastMessage?.timestamp || 0;
      const timeB = b.lastMessage?.timestamp || 0;
      if (timeA !== timeB) return timeB - timeA;
      return a.userEmail.localeCompare(b.userEmail);
    });
  },

  sendMessage: (from: string, to: string, text: string): Message => {
    const allMessagesStr = localStorage.getItem(DB_MESSAGES_KEY);
    const allMessages: Message[] = allMessagesStr ? JSON.parse(allMessagesStr) : [];

    const newMessage: Message = {
      id: generateId(),
      fromEmail: from,
      toEmail: to,
      text,
      timestamp: Date.now(),
      read: false
    };

    allMessages.push(newMessage);
    localStorage.setItem(DB_MESSAGES_KEY, JSON.stringify(allMessages));
    notifyListeners();
    return newMessage;
  },

  markMessagesAsRead: (fromEmail: string, toEmail: string): void => {
    const allMessagesStr = localStorage.getItem(DB_MESSAGES_KEY);
    if (!allMessagesStr) return;

    let allMessages: Message[] = JSON.parse(allMessagesStr);
    let changed = false;

    allMessages = allMessages.map(msg => {
      if (msg.fromEmail === fromEmail && msg.toEmail === toEmail && !msg.read) {
        changed = true;
        return { ...msg, read: true };
      }
      return msg;
    });

    if (changed) {
      localStorage.setItem(DB_MESSAGES_KEY, JSON.stringify(allMessages));
      notifyListeners();
    }
  },

  // --- REAL-TIME MOCK (Observer Pattern) ---
  subscribe: (callback: () => void): (() => void) => {
    listeners.add(callback);
    return () => { listeners.delete(callback); }; // explicit return block for clarity
  }
};

