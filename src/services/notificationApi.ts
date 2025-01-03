import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function createNotification(userId: string, message: string, type: string) {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      userId,
      message,
      type,
      resolved: false,
      timestamp: new Date(),
    });
    console.log('Notification created with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding notification: ', e);
  }
}