
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ShoppingBag, 
  User, 
  Crown, 
  LogOut,
  Scissors,
  Home,
  ClipboardList,
  Package
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Book', href: '/book', icon: Calendar },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Membership', href: '/membership', icon: Crown },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Scissors className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BarberApp</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/appointments" className="text-gray-600 hover:text-gray-900">
                <ClipboardList className="h-5 w-5" />
              </Link>
              <Link to="/orders" className="text-gray-600 hover:text-gray-900">
                <Package className="h-5 w-5" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-1 ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
