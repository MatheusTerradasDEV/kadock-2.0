import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { User, Mail, Bell } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    notificationPreferences: user?.notificationPreferences || {
      email: true,
      inApp: true,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
        });

        setUser({
          ...user!,
          displayName: formData.displayName,
          notificationPreferences: formData.notificationPreferences,
        });

        toast.success('Perfil Atualizado com Sucesso!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Falha ao atualizar o perfil');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Perfil</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{user?.displayName || 'User'}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Notification Preferences</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        email: e.target.checked,
                      },
                    })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences.inApp}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        inApp: e.target.checked,
                      },
                    })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">In-App Notifications</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Bell className="h-5 w-5" />
              <span>
                Notifications: {' '}
                {user?.notificationPreferences.email ? 'Email, ' : ''}
                {user?.notificationPreferences.inApp ? 'In-App' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}