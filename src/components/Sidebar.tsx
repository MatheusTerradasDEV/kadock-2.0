import { Link } from 'react-router-dom';
import { Home, Box, User } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Box, label: 'Inventário', path: '/inventory' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}