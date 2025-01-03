import { Link } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import logo from './inventory/logokadock.png';

export default function Navbar() {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7x5 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-end"> 
            <Link to="/" className="text-xl font-bold text-gray-800">
              <img src={logo} alt="Kadock estoque" className="h-16 w-auto" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="text-gray-600 hover:text-gray-800">
              <Bell className="h-6 w-6" />
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}