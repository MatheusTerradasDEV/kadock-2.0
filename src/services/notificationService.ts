import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { User } from '../types';

export async function createNotification(userId: string, message: string, type: 'low_stock' | 'system' | 'action_required') {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      message,
      type,
      read: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export async function handleLowStockNotification(fabricName: string, quantity: number, user: User) {
  const message = `Estoque Baixo: ${fabricName} está com ${quantity} reabasteça`;
  
  if (user.notificationPreferences.inApp) {
    await createNotification(user.id, message, 'low_stock');
  }
  
  if (user.notificationPreferences.email) {
    // In a real application, you would integrate with an email service here
    console.log('Sending email notification:', message);
  }
  
  toast.error(message, {
    duration: 5000,
    icon: '⚠️',
  });
}