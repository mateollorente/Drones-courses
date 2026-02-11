import { supabase } from './supabase';

/* ======================================================
   TYPES (los dejamos iguales para no romper tu front)
====================================================== */
// Mantener helper para frontend (IDs temporales / locales)
export const generateId = (): string =>
  crypto.randomUUID();

export interface UserProgress {
  courseId: string;
  currentModuleIdx: number;
  currentLessonIdx: number;
  completedLessons: string[];
  lastAccessed: number;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  dni: string;
  role: 'admin' | 'student';
  enrolledCourses?: string[];
  progress?: UserProgress[];
}

export interface Message {
  id: string;
  fromEmail: string;
  toEmail: string;
  text: string;
  timestamp: number;
  read: boolean;
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

/* ======================================================
   HELPERS
====================================================== */

const mapMessage = (m: any): Message => ({
  id: m.id,
  fromEmail: m.from_email,
  toEmail: m.to_email,
  text: m.text,
  timestamp: new Date(m.created_at).getTime(),
  read: m.read
});

/* ======================================================
   DB IMPLEMENTATION (Supabase)
====================================================== */

export const db = {
  /* ===============================
     AUTH / USERS
  =============================== */

  getUsers: async (): Promise<User[]> => {
    const { data } = await supabase.from('users').select('*');

    if (!data) return [];

    return data.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      dni: u.dni,
      role: u.role
    }));
  },

  register: async (
    user: Omit<User, 'role'> & { role?: 'admin' | 'student' }
  ): Promise<{ success: boolean; message?: string }> => {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password!
    });

    if (error || !data.user) return { success: false, message: error?.message };

    await supabase.from('users').insert({
      id: data.user.id,
      email: user.email,
      name: user.name,
      dni: user.dni,
      role: user.role || 'student'
    });

    return { success: true };
  },

  registerAdmin: async (): Promise<{ success: boolean; message?: string }> => {
    console.log("Attempting to register admin...");
    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@aerovision.com',
      password: 'adminpassword123',
    });

    if (error) {
      console.error("Auth Error:", error);
      // If user already exists, we might need to just insert the public record if it's missing
      if (error.message.includes("User already registered") || error.message.includes("already registered")) {
        // Try to sign in to get the ID
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'admin@aerovision.com',
          password: 'adminpassword123'
        });

        if (loginError || !loginData.user) {
          return { success: false, message: "User exists but cannot login to fix profile: " + loginError?.message };
        }

        // User exists and logged in, check if profile exists
        const { data: profile } = await supabase.from('users').select('*').eq('id', loginData.user.id).single();

        if (!profile) {
          // Profile missing, insert it
          const { error: dbError } = await supabase.from('users').insert({
            id: loginData.user.id,
            email: 'admin@aerovision.com',
            name: 'Instructor Admin',
            dni: 'ADMIN001',
            role: 'admin'
          });
          if (dbError) return { success: false, message: "Auth ok, but DB insert failed: " + dbError.message };
          return { success: true, message: "Admin profile restored." };
        } else {
          // Profile exists, ensure it is admin
          if (profile.role !== 'admin') {
            await supabase.from('users').update({ role: 'admin' }).eq('id', profile.id);
            return { success: true, message: "User existed, role updated to admin." };
          }
          return { success: true, message: "Admin already exists and is valid." };
        }
      }
      return { success: false, message: error.message };
    }

    if (!data.user) return { success: false, message: 'No returned user data' };

    // 2. Insert into public users table with verified admin role
    const { error: dbError } = await supabase.from('users').insert({
      id: data.user.id,
      email: 'admin@aerovision.com',
      name: 'Instructor Admin',
      dni: 'ADMIN001',
      role: 'admin'
    });

    if (dbError) return { success: false, message: dbError.message };

    return { success: true };
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) return { success: false };

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        dni: profile.dni,
        role: profile.role
      }
    };
  },

  updateUser: async (email: string, updates: Partial<User>): Promise<boolean> => {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('email', email);

    return !error;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  /* ===============================
     COURSES
  =============================== */

  getCourses: async () => {
    const { data } = await supabase
      .from('courses')
      .select('*');

    return data ?? [];
  },

  getCourseById: async (id: string) => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    return data ?? undefined;
  },

  saveCourse: async (course: any): Promise<boolean> => {
    const { error } = await supabase
      .from('courses')
      .upsert(course);

    return !error;
  },

  deleteCourse: async (id: string) => {
    await supabase
      .from('courses')
      .delete()
      .eq('id', id);
  },

  /* ===============================
     ENROLLMENT
  =============================== */

  enrollUser: async (email: string, courseId: string) => {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) return false;

    await supabase.from('enrollments').insert({
      user_id: user.id,
      course_id: courseId
    });

    return true;
  },

  isEnrolled: async (email: string, courseId: string) => {
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', email)
      .single();

    if (!user) return false;

    if (user.role === 'admin') return true;

    const { data } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    return !!data?.length;
  },

  /* ===============================
     PROGRESS
  =============================== */

  saveProgress: async (email: string, progress: UserProgress) => {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) return;

    await supabase.from('progress').upsert({
      user_id: user.id,
      course_id: progress.courseId,
      current_module: progress.currentModuleIdx,
      current_lesson: progress.currentLessonIdx,
      completed_lessons: progress.completedLessons,
      last_accessed: new Date(progress.lastAccessed)
    });
  },

  getProgress: async (
    email: string,
    courseId: string
  ): Promise<UserProgress | undefined> => {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) return;

    const { data } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (!data) return;

    return {
      courseId: data.course_id,
      currentModuleIdx: data.current_module,
      currentLessonIdx: data.current_lesson,
      completedLessons: data.completed_lessons,
      lastAccessed: new Date(data.last_accessed).getTime()
    };
  },

  /* ===============================
     MESSAGES (CHAT)
  =============================== */

  getMessages: async (
    userEmail: string,
    otherEmail: string
  ): Promise<Message[]> => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(from_email.eq.${userEmail},to_email.eq.${otherEmail}),and(from_email.eq.${otherEmail},to_email.eq.${userEmail})`
      )
      .order('created_at');

    return (data ?? []).map(mapMessage);
  },

  sendMessage: async (
    from: string,
    to: string,
    text: string
  ): Promise<Message> => {
    const { data } = await supabase
      .from('messages')
      .insert({
        from_email: from,
        to_email: to,
        text,
        read: false
      })
      .select()
      .single();

    return mapMessage(data);
  },

  markMessagesAsRead: async (userEmail: string, otherEmail: string): Promise<void> => {
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('from_email', userEmail)
      .eq('to_email', otherEmail)
      .eq('read', false);
  },

  getAllConversations: async (): Promise<{ userEmail: string; lastMessage: Message | null; unreadCount: number }[]> => {
    const adminEmail = 'admin@aerovision.com';

    const { data: users } = await supabase.from('users').select('*').eq('role', 'student');
    if (!users) return [];

    const conversations = [];

    for (const user of users) {
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('*')
        .or(`and(from_email.eq.${user.email},to_email.eq.${adminEmail}),and(from_email.eq.${adminEmail},to_email.eq.${user.email})`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('from_email', user.email)
        .eq('to_email', adminEmail)
        .eq('read', false);

      if (lastMsg || (count && count > 0)) {
        conversations.push({
          userEmail: user.email,
          lastMessage: lastMsg ? mapMessage(lastMsg) : null,
          unreadCount: count || 0
        });
      }
    }

    return conversations.sort((a, b) => {
      const dateA = a.lastMessage?.timestamp || 0;
      const dateB = b.lastMessage?.timestamp || 0;
      return dateB - dateA;
    });
  },

  /* ===============================
     REALTIME
  =============================== */

  subscribe: (callback: () => void) => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
