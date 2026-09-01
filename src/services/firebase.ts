import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import {
  ChatMessage,
  ChatSession,
  Order,
  CustomerInquiry,
  ProductReview,
  UserAccount,
  Product,
  Category,
  BannerSlide,
  StoreSettings,
} from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyCmxV-o7PWM60tkxloLITzVUzs-UvjG_1k",
  authDomain: "e-commerce-dde67.firebaseapp.com",
  projectId: "e-commerce-dde67",
  storageBucket: "e-commerce-dde67.firebasestorage.app",
  messagingSenderId: "103950881288",
  appId: "1:103950881288:web:2285a7368f78f24411f7bd",
  measurementId: "G-43LNWTFDBK",
};

// Initialize Firebase safely
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const firestoreDb = getFirestore(firebaseApp);

// ==========================================
// 1. LIVE CHAT & CONCIERGE (FIRESTORE)
// ==========================================

export async function createOrGetChatSession(
  sessionData: {
    chatId?: string;
    userId?: string;
    userName: string;
    userPhone?: string;
    userEmail?: string;
  }
): Promise<string> {
  const chatId = sessionData.chatId || `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const chatRef = doc(firestoreDb, 'chats', chatId);

  const existing = await getDoc(chatRef);
  if (!existing.exists()) {
    await setDoc(chatRef, {
      id: chatId,
      userId: sessionData.userId || 'guest',
      userName: sessionData.userName || 'Guest Shopper',
      userPhone: sessionData.userPhone || '',
      userEmail: sessionData.userEmail || '',
      lastMessage: 'Chat session started',
      lastSender: 'user',
      updatedAt: new Date().toISOString(),
      status: 'active',
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    });

    // Send initial greeting message into subcollection
    const msgRef = doc(collection(firestoreDb, 'chats', chatId, 'messages'));
    await setDoc(msgRef, {
      id: msgRef.id,
      chatId,
      sender: 'assistant',
      senderName: 'VELORA Concierge AI',
      text: `Assalamu Alaikum, ${sessionData.userName || 'valued guest'}! Welcome to VELORA Luxury Boutique. How may we assist your bespoke styling, sizing, or order inquiries today?`,
      timestamp: new Date().toISOString(),
      read: true,
    });
  }

  return chatId;
}

export async function sendChatMessage(
  chatId: string,
  message: {
    sender: 'user' | 'assistant' | 'admin';
    senderName: string;
    text: string;
  }
): Promise<ChatMessage> {
  const messagesCol = collection(firestoreDb, 'chats', chatId, 'messages');
  const msgDoc = doc(messagesCol);
  
  const newMsg: ChatMessage = {
    id: msgDoc.id,
    chatId,
    sender: message.sender,
    senderName: message.senderName,
    text: message.text,
    timestamp: new Date().toISOString(),
    read: message.sender === 'user' ? false : true,
  };

  await setDoc(msgDoc, newMsg);

  // Update session document
  const chatDocRef = doc(firestoreDb, 'chats', chatId);
  await updateDoc(chatDocRef, {
    lastMessage: message.text,
    lastSender: message.sender,
    updatedAt: new Date().toISOString(),
  }).catch(async () => {
    // In case doc didn't exist
    await setDoc(chatDocRef, {
      id: chatId,
      lastMessage: message.text,
      lastSender: message.sender,
      updatedAt: new Date().toISOString(),
      status: 'active',
    }, { merge: true });
  });

  return newMsg;
}

export function subscribeToChatMessages(
  chatId: string,
  onUpdate: (messages: ChatMessage[]) => void
): Unsubscribe {
  const messagesCol = collection(firestoreDb, 'chats', chatId, 'messages');
  const q = query(messagesCol, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((docSnap) => {
      messages.push(docSnap.data() as ChatMessage);
    });
    onUpdate(messages);
  }, (err) => {
    console.warn('Firestore chat subscribe warning:', err);
  });
}

export function subscribeToAllChatSessions(
  onUpdate: (sessions: ChatSession[]) => void
): Unsubscribe {
  const chatsCol = collection(firestoreDb, 'chats');
  const q = query(chatsCol, orderBy('updatedAt', 'desc'), limit(50));

  return onSnapshot(q, (snapshot) => {
    const sessions: ChatSession[] = [];
    snapshot.forEach((docSnap) => {
      sessions.push(docSnap.data() as ChatSession);
    });
    onUpdate(sessions);
  }, (err) => {
    console.warn('Firestore sessions subscribe warning:', err);
  });
}

// ==========================================
// 2. ORDERS PERSISTENCE (FIRESTORE)
// ==========================================

export async function saveOrderToFirestore(order: Order): Promise<void> {
  const orderRef = doc(firestoreDb, 'orders', order.id);
  await setDoc(orderRef, {
    ...order,
    firestoreUpdatedAt: new Date().toISOString(),
  });
}

export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void
): Unsubscribe {
  const ordersCol = collection(firestoreDb, 'orders');
  const q = query(ordersCol, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as Order);
    });
    onUpdate(orders);
  }, (err) => {
    console.warn('Firestore orders subscribe warning:', err);
  });
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: Order['status'],
  trackingNumber?: string
): Promise<void> {
  const orderRef = doc(firestoreDb, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    ...(trackingNumber ? { trackingNumber } : {}),
    updatedAt: new Date().toISOString(),
  });
}

// ==========================================
// 3. CONTACT INQUIRIES (FIRESTORE)
// ==========================================

export async function saveInquiryToFirestore(
  inquiry: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>
): Promise<CustomerInquiry> {
  const inqCol = collection(firestoreDb, 'inquiries');
  const inqDoc = doc(inqCol);
  const newInq: CustomerInquiry = {
    id: inqDoc.id,
    name: inquiry.name,
    phone: inquiry.phone,
    subject: inquiry.subject,
    message: inquiry.message,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  await setDoc(inqDoc, newInq);
  return newInq;
}

export function subscribeToInquiries(
  onUpdate: (inquiries: CustomerInquiry[]) => void
): Unsubscribe {
  const inqCol = collection(firestoreDb, 'inquiries');
  const q = query(inqCol, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(q, (snapshot) => {
    const list: CustomerInquiry[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as CustomerInquiry);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('Firestore inquiries subscribe warning:', err);
  });
}

// ==========================================
// 4. PRODUCT REVIEWS (FIRESTORE)
// ==========================================

export async function saveProductReviewToFirestore(
  review: Omit<ProductReview, 'id' | 'createdAt'>
): Promise<ProductReview> {
  const revCol = collection(firestoreDb, 'reviews');
  const revDoc = doc(revCol);
  const newRev: ProductReview = {
    id: revDoc.id,
    productId: review.productId,
    userName: review.userName || 'Verified Buyer',
    userEmail: review.userEmail || '',
    rating: review.rating,
    comment: review.comment,
    createdAt: new Date().toISOString(),
    verifiedPurchase: review.verifiedPurchase !== false,
  };
  await setDoc(revDoc, newRev);
  return newRev;
}

export function subscribeToProductReviews(
  productId: string,
  onUpdate: (reviews: ProductReview[]) => void
): Unsubscribe {
  const revCol = collection(firestoreDb, 'reviews');
  const q = query(
    revCol,
    where('productId', '==', productId),
    orderBy('createdAt', 'desc'),
    limit(30)
  );

  return onSnapshot(q, (snapshot) => {
    const list: ProductReview[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as ProductReview);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('Firestore reviews subscribe warning:', err);
  });
}

// ==========================================
// 5. USER ACCOUNTS (FIRESTORE)
// ==========================================

export async function saveUserToFirestore(user: UserAccount): Promise<void> {
  const userRef = doc(firestoreDb, 'users', user.id);
  await setDoc(userRef, {
    ...user,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

// ==========================================
// 6. STORE SETTINGS & PRODUCTS BACKUP SYNC
// ==========================================

export async function saveSettingsToFirestore(settings: StoreSettings): Promise<void> {
  const setRef = doc(firestoreDb, 'settings', 'store_settings');
  await setDoc(setRef, {
    ...settings,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function getSettingsFromFirestore(): Promise<StoreSettings | null> {
  try {
    const setRef = doc(firestoreDb, 'settings', 'store_settings');
    const snap = await getDoc(setRef);
    if (snap.exists()) {
      return snap.data() as StoreSettings;
    }
  } catch (err) {
    console.warn('Could not read settings from Firestore:', err);
  }
  return null;
}
