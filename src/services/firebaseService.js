import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import {
  getStoredIdeas,
  saveStoredIdeas,
  getStoredUser,
  saveStoredUser,
  getStoredCommitments,
  saveStoredCommitments,
  saveStoredNotification,
  getStoredNotifications,
  markStoredNotificationsAsRead
} from './storageService';

// Demo users available for fast evaluation
export const DEMO_USERS = [
  {
    uid: 'user-demo-1',
    email: 'zainab.founder@ideavault.pk',
    displayName: 'Zainab Qazi',
    role: 'Tech Founder & Karachi Builder',
    location: 'Karachi, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Passionate about Pakistani early-stage startups, SaaS for local SMEs, and youth enablement.',
    skills: ['Product Design', 'React.js', 'Market Research', 'Fundraising']
  },
  {
    uid: 'user-demo-2',
    email: 'fahad.investor@ideavault.pk',
    displayName: 'Fahad Mehmood',
    role: 'Angel Investor & Mentor',
    location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Looking to invest PKR 500k - 2.5M in high-margin micro businesses and tech ventures.',
    skills: ['Capital Allocation', 'Supply Chain', 'Financial Modeling']
  },
  {
    uid: 'user-demo-3',
    email: 'saad.growth@ideavault.pk',
    displayName: 'Saad Alvi',
    role: 'Growth Marketer & Creator',
    location: 'Islamabad, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Helping Pakistani D2C brands and cloud kitchens scale using TikTok and Meta ads.',
    skills: ['Paid Ads', 'TikTok Marketing', 'Funnel Optimization']
  }
];

export const firebaseService = {
  // Authentication methods
  async registerUser({ email, password, displayName, location = 'Karachi', role = 'Entrepreneur' }) {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await fbUpdateProfile(cred.user, { displayName });
      const userDoc = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: displayName || email.split('@')[0],
        role,
        location,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || email)}`,
        bio: 'New IdeaVault explorer ready to create and collaborate.',
        skills: ['Entrepreneurship'],
        createdAt: Date.now()
      };
      if (db) {
        await setDoc(doc(db, 'users', cred.user.uid), userDoc);
      }
      saveStoredUser(userDoc);
      return userDoc;
    } else {
      // Local persistent registration
      const uid = 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      const user = {
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        role,
        location,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || email)}`,
        bio: 'New IdeaVault explorer ready to create and collaborate.',
        skills: ['Entrepreneurship'],
        createdAt: Date.now()
      };
      saveStoredUser(user);
      return user;
    }
  },

  async loginUser({ email, password }) {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      let userData = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || email.split('@')[0],
        avatar: cred.user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cred.user.displayName || email)}`,
        role: 'Member',
        location: 'Pakistan',
      };
      if (db) {
        const uSnap = await getDoc(doc(db, 'users', cred.user.uid));
        if (uSnap.exists()) {
          userData = { ...userData, ...uSnap.data() };
        }
      }
      saveStoredUser(userData);
      return userData;
    } else {
      // Offline/Local check: if email matches any demo user or default
      const foundDemo = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundDemo) {
        saveStoredUser(foundDemo);
        return foundDemo;
      }
      // Create user session from email
      const user = {
        uid: 'user-' + btoa(email).replace(/=/g, '').substring(0, 10),
        email,
        displayName: email.split('@')[0].replace('.', ' '),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        role: 'Entrepreneur',
        location: 'Karachi, Pakistan',
        bio: 'IdeaVault explorer.',
        skills: ['Ideation', 'Strategy'],
        createdAt: Date.now()
      };
      saveStoredUser(user);
      return user;
    }
  },

  async loginWithDemo(demoUserIndex = 0) {
    const user = DEMO_USERS[demoUserIndex] || DEMO_USERS[0];
    saveStoredUser(user);
    return user;
  },

  async logoutUser() {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    saveStoredUser(null);
    return true;
  },

  getCurrentUser() {
    return getStoredUser();
  },

  // Ideas CRUD
  async fetchIdeas() {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          saveStoredIdeas(list);
          return list;
        }
      } catch (err) {
        console.warn('Firestore fetch failed, using stored cache:', err);
      }
    }
    return getStoredIdeas();
  },

  async createIdea(ideaData, currentUser) {
    const newIdea = {
      ...ideaData,
      id: 'idea-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      creatorId: currentUser?.uid || 'user-anonymous',
      creatorName: currentUser?.displayName || 'Anonymous Member',
      creatorAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=Anon`,
      creatorRole: currentUser?.role || 'Entrepreneur',
      createdAt: Date.now(),
      likesCount: 0,
      likedBy: [],
      viewsCount: 1,
      commitmentsCount: 0,
      bookmarksCount: 0,
      commentsCount: 0,
      comments: [],
      commitments: []
    };

    if (isFirebaseConfigured && db) {
      try {
        const ref = await addDoc(collection(db, 'ideas'), newIdea);
        newIdea.id = ref.id;
      } catch (err) {
        console.warn('Failed to save idea to Firestore, fallback to local:', err);
      }
    }

    const currentIdeas = getStoredIdeas();
    const updated = [newIdea, ...currentIdeas];
    saveStoredIdeas(updated);
    return newIdea;
  },

  async updateIdea(ideaId, updatedFields) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'ideas', ideaId);
        await updateDoc(docRef, updatedFields);
      } catch (err) {
        console.warn('Firestore update error:', err);
      }
    }

    const currentIdeas = getStoredIdeas();
    const updated = currentIdeas.map(item => {
      if (item.id === ideaId) {
        return { ...item, ...updatedFields, updatedAt: Date.now() };
      }
      return item;
    });
    saveStoredIdeas(updated);
    return updated.find(i => i.id === ideaId);
  },

  async deleteIdea(ideaId) {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'ideas', ideaId));
      } catch (err) {
        console.warn('Firestore delete error:', err);
      }
    }

    const currentIdeas = getStoredIdeas();
    const updated = currentIdeas.filter(i => i.id !== ideaId);
    saveStoredIdeas(updated);
    return true;
  },

  // Interactions
  async toggleLike(ideaId, userId) {
    const currentIdeas = getStoredIdeas();
    let target = currentIdeas.find(i => i.id === ideaId);
    if (!target) return null;

    const likedBy = Array.isArray(target.likedBy) ? [...target.likedBy] : [];
    const isLiked = likedBy.includes(userId);
    let newLikesCount = target.likesCount || 0;

    let updatedLikedBy;
    if (isLiked) {
      updatedLikedBy = likedBy.filter(id => id !== userId);
      newLikesCount = Math.max(0, newLikesCount - 1);
    } else {
      updatedLikedBy = [...likedBy, userId];
      newLikesCount += 1;

      // Notify idea creator if someone else liked it
      if (target.creatorId && target.creatorId !== userId) {
        saveStoredNotification({
          id: 'notif-' + Date.now(),
          recipientId: target.creatorId,
          type: 'like',
          title: 'New Like on your Idea',
          message: `Someone liked your idea "${target.title}"`,
          ideaId: target.id,
          createdAt: Date.now(),
          read: false
        });
      }
    }

    const updatedIdea = {
      ...target,
      likesCount: newLikesCount,
      likedBy: updatedLikedBy
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'ideas', ideaId);
        await updateDoc(docRef, {
          likesCount: newLikesCount,
          likedBy: updatedLikedBy
        });
      } catch (err) {
        console.warn('Firestore like sync warning:', err);
      }
    }

    const allUpdated = currentIdeas.map(i => i.id === ideaId ? updatedIdea : i);
    saveStoredIdeas(allUpdated);
    return updatedIdea;
  },

  async incrementViews(ideaId) {
    const currentIdeas = getStoredIdeas();
    const updated = currentIdeas.map(item => {
      if (item.id === ideaId) {
        const newViews = (item.viewsCount || 0) + 1;
        if (isFirebaseConfigured && db) {
          updateDoc(doc(db, 'ideas', ideaId), { viewsCount: newViews }).catch(() => {});
        }
        return { ...item, viewsCount: newViews };
      }
      return item;
    });
    saveStoredIdeas(updated);
  },

  async addComment(ideaId, { text, user }) {
    const currentIdeas = getStoredIdeas();
    const target = currentIdeas.find(i => i.id === ideaId);
    if (!target) return null;

    const newComment = {
      id: 'comm-' + Date.now(),
      userId: user.uid,
      userName: user.displayName || 'IdeaVault User',
      userAvatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`,
      content: text,
      createdAt: Date.now()
    };

    const existingComments = Array.isArray(target.comments) ? target.comments : [];
    const updatedComments = [newComment, ...existingComments];
    const updatedCount = updatedComments.length;

    const updatedIdea = {
      ...target,
      comments: updatedComments,
      commentsCount: updatedCount
    };

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'ideas', ideaId), {
          comments: updatedComments,
          commentsCount: updatedCount
        });
      } catch (e) {
        console.warn('Firebase comment error:', e);
      }
    }

    // Notify creator if not commenter
    if (target.creatorId && target.creatorId !== user.uid) {
      saveStoredNotification({
        id: 'notif-' + Date.now(),
        recipientId: target.creatorId,
        type: 'comment',
        title: 'New Comment on Idea',
        message: `${user.displayName} commented on "${target.title}"`,
        ideaId: target.id,
        createdAt: Date.now(),
        read: false
      });
    }

    const allUpdated = currentIdeas.map(i => i.id === ideaId ? updatedIdea : i);
    saveStoredIdeas(allUpdated);
    return updatedIdea;
  },

  async addCommitment(ideaId, { role, roleLabel, message, user }) {
    const currentIdeas = getStoredIdeas();
    const target = currentIdeas.find(i => i.id === ideaId);
    if (!target) return null;

    const commitment = {
      id: 'cmt-' + Date.now(),
      ideaId,
      ideaTitle: target.title,
      ideaCategory: target.categoryLabel || target.category,
      ideaBudget: target.budget,
      ideaLocation: target.location,
      userId: user.uid,
      userName: user.displayName || 'Member',
      userAvatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`,
      userEmail: user.email,
      role,
      roleLabel,
      message,
      createdAt: Date.now(),
      status: 'Pending'
    };

    const existingCommitments = Array.isArray(target.commitments) ? target.commitments : [];
    const updatedCommitments = [commitment, ...existingCommitments];

    const updatedIdea = {
      ...target,
      commitments: updatedCommitments,
      commitmentsCount: updatedCommitments.length
    };

    // Save global commitment record
    const allStoredCommitments = getStoredCommitments();
    saveStoredCommitments([commitment, ...allStoredCommitments]);

    // Save idea update
    const allUpdated = currentIdeas.map(i => i.id === ideaId ? updatedIdea : i);
    saveStoredIdeas(allUpdated);

    // Notify creator
    if (target.creatorId) {
      saveStoredNotification({
        id: 'notif-' + Date.now(),
        recipientId: target.creatorId,
        type: 'commitment',
        title: 'New Collaboration Request!',
        message: `${user.displayName} expressed interest as "${roleLabel}" for "${target.title}"`,
        ideaId: target.id,
        createdAt: Date.now(),
        read: false
      });
    }

    return commitment;
  }
};

