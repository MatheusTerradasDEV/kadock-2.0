export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
  };
}

export interface Fabric {
  id: string;
  name: string;
  type: string;
  color: string;
  price: number;
  quantity: number;
  minQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'low_stock' | 'system' | 'action_required';
  read: boolean;
  createdAt: Date;
}