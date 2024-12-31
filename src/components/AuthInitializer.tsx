import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

export default function AuthInitializer() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName,
          photoURL: user.photoURL,
          notificationPreferences: {
            email: true,
            inApp: true,
          },
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return null;
}