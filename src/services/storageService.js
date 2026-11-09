import { INITIAL_IDEAS } from '../data/initialIdeas';

const STORAGE_KEYS = {
  IDEAS: 'ideavault_ideas_v1',
  AUTH: 'ideavault_current_user_v1',
  USERS: 'ideavault_registered_users_v1',
  COMMITMENTS: 'ideavault_commitments_v1',
  NOTIFICATIONS: 'ideavault_notifications_v1',
  BOOKMARKS: 'ideavault_bookmarks_v1',
  LIKES: 'ideavault_likes_v1',
};

// Seed initial ideas if storage empty
export function getStoredIdeas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(INITIAL_IDEAS));
      return INITIAL_IDEAS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored ideas', e);
    return INITIAL_IDEAS;
  }
}

export function saveStoredIdeas(ideas) {
  try {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
  } catch (e) {
    console.error('Failed to save ideas to storage', e);
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  } catch (e) {
    console.error('Failed to save user', e);
  }
}

export function getStoredCommitments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMITMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredCommitments(commitments) {
  try {
    localStorage.setItem(STORAGE_KEYS.COMMITMENTS, JSON.stringify(commitments));
  } catch (e) {
    console.error('Failed to save commitments', e);
  }
}

export function getStoredNotifications(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all = raw ? JSON.parse(raw) : [];
    if (!userId) return all;
    return all.filter(n => n.userId === userId || n.recipientId === userId);
  } catch (e) {
    return [];
  }
}

export function saveStoredNotification(notification) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(notification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error('Failed to save notification', e);
    return [];
  }
}

export function markStoredNotificationsAsRead(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let list = raw ? JSON.parse(raw) : [];
    list = list.map(n => {
      if (!userId || n.userId === userId || n.recipientId === userId) {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    return list;
  } catch (e) {
    return [];
  }
}

