import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Initialize Firebase safely
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom database ID from config
export const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(firebaseApp);

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Error Context: ', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot per Firebase guidelines
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connection note: Database is syncing in background.');
    }
  }
}

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

  try {
    let exists = false;
    try {
      const snap = await getDoc(chatRef);
      exists = snap.exists();
    } catch (readErr) {
      // If offline or first read fails, proceed to setDoc
      console.warn('Chat session check note:', readErr);
    }

    if (!exists) {
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
      }, { merge: true });

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
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `chats/${chatId}`);
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

  try {
    await setDoc(msgDoc, newMsg);

    // Update session document
    const chatDocRef = doc(firestoreDb, 'chats', chatId);
    await updateDoc(chatDocRef, {
      lastMessage: message.text,
      lastSender: message.sender,
      updatedAt: new Date().toISOString(),
    }).catch(async () => {
      await setDoc(chatDocRef, {
        id: chatId,
        lastMessage: message.text,
        lastSender: message.sender,
        updatedAt: new Date().toISOString(),
        status: 'active',
      }, { merge: true });
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `chats/${chatId}/messages/${msgDoc.id}`);
  }

  return newMsg;
}

export function subscribeToChatMessages(
  chatId: string,
  onUpdate: (messages: ChatMessage[]) => void
): Unsubscribe {
  const messagesCol = collection(firestoreDb, 'chats', chatId, 'messages');
  const q = query(messagesCol, orderBy('timestamp', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        messages.push(docSnap.data() as ChatMessage);
      });
      onUpdate(messages);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `chats/${chatId}/messages`);
    }
  );
}

export function subscribeToAllChatSessions(
  onUpdate: (sessions: ChatSession[]) => void
): Unsubscribe {
  const chatsCol = collection(firestoreDb, 'chats');
  const q = query(chatsCol, orderBy('updatedAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const sessions: ChatSession[] = [];
      snapshot.forEach((docSnap) => {
        sessions.push(docSnap.data() as ChatSession);
      });
      onUpdate(sessions);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'chats');
    }
  );
}

// ==========================================
// 2. ORDERS PERSISTENCE (FIRESTORE)
// ==========================================

export async function saveOrderToFirestore(order: Order): Promise<void> {
  const orderRef = doc(firestoreDb, 'orders', order.id);
  try {
    await setDoc(orderRef, {
      ...order,
      firestoreUpdatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `orders/${order.id}`);
  }
}

export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void
): Unsubscribe {
  const ordersCol = collection(firestoreDb, 'orders');
  const q = query(ordersCol, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as Order);
      });
      onUpdate(orders);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
  );
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: Order['status'],
  trackingNumber?: string
): Promise<void> {
  const orderRef = doc(firestoreDb, 'orders', orderId);
  try {
    await updateDoc(orderRef, {
      status,
      ...(trackingNumber ? { trackingNumber } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
  }
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

  try {
    await setDoc(inqDoc, newInq);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `inquiries/${inqDoc.id}`);
  }

  return newInq;
}

export function subscribeToInquiries(
  onUpdate: (inquiries: CustomerInquiry[]) => void
): Unsubscribe {
  const inqCol = collection(firestoreDb, 'inquiries');
  const q = query(inqCol, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: CustomerInquiry[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as CustomerInquiry);
      });
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'inquiries');
    }
  );
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

  try {
    await setDoc(revDoc, newRev);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `reviews/${revDoc.id}`);
  }

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

  return onSnapshot(
    q,
    (snapshot) => {
      const list: ProductReview[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as ProductReview);
      });
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `reviews?productId=${productId}`);
    }
  );
}

// ==========================================
// 5. USER ACCOUNTS (FIRESTORE)
// ==========================================

export async function saveUserToFirestore(user: UserAccount): Promise<void> {
  const userRef = doc(firestoreDb, 'users', user.id);
  try {
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.id}`);
  }
}

// ==========================================
// 6. STORE SETTINGS & PRODUCTS BACKUP SYNC
// ==========================================

export async function saveSettingsToFirestore(settings: StoreSettings): Promise<void> {
  const setRef = doc(firestoreDb, 'settings', 'store_settings');
  try {
    await setDoc(setRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/store_settings');
  }
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
