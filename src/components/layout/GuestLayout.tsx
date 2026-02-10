import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Bed,
  Utensils,
  CalendarDays,
  Package,
  CreditCard,
  User,
  Settings,
  Home,
  QrCode,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/guest', icon: Home },
  { name: 'My Bookings', href: '/guest/bookings', icon: Calendar },
  { name: 'Book Room', href: '/guest/book', icon: Bed },
  { name: 'Room Service', href: '/guest/room-service', icon: Utensils },
  { name: 'Events', href: '/guest/events', icon: CalendarDays },
  { name: 'Services', href: '/guest/services', icon: Package },
  { name: 'Digital Key', href: '/guest/digital-key', icon: QrCode },
  { name: 'Billing', href: '/guest/billing', icon: CreditCard },
  { name: 'Profile', href: '/guest/profile', icon: User },
  { name: 'Settings', href: '/guest/settings', icon: Settings },
];

interface GuestLayoutProps {
  children: React.ReactNode;
}

export function GuestLayout({ children }: GuestLayoutProps) {
  const { user, profile } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/guest" className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">
                  Oasis Resort
                </h1>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              {navigation.slice(0, 6).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    location.pathname === item.href
                      ? 'text-blue-600 border-b-2 border-blue-600 px-1 py-2 text-sm font-medium'
                      : 'text-gray-500 hover:text-gray-700 px-1 py-2 text-sm font-medium',
                    'inline-flex items-center',
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className="md:hidden border-b bg-white">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                location.pathname === item.href
                  ? 'bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium',
                'flex items-center',
              )}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {profile?.full_name || 'Guest'}!
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your bookings, services, and more
            </p>
          </div>

          {/* Page content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © 2024 Oasis Resort. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
