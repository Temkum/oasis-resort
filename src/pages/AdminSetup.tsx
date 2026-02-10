import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Users,
  Crown,
  Settings,
  RefreshCw,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  email: string;
  role: 'admin' | 'staff' | 'guest';
  email_confirmed: boolean;
  last_sign_in: string | null;
}

export function AdminSetup() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'staff' | 'guest'>('guest');
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current user is admin
  const checkAdminStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      setCurrentUser(user.email || null);

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.error('Error checking admin status:', roleError);
        setError('Unable to verify admin status');
        return;
      }

      setIsAdmin(roleData?.role === 'admin');

      if (roleData?.role !== 'admin') {
        setError('You do not have admin privileges to access this page');
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError('Failed to verify permissions');
    }
  };

  // Fetch users from the secure Edge Function
  const fetchUsers = async () => {
    if (!isAdmin) return;

    setFetchingUsers(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-users`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFetchingUsers(false);
    }
  };

  // Assign role via the secure Edge Function
  const assignRole = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!isAdmin) {
      toast.error('Unauthorized - Admin access required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/assign-role`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim(), role }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign role');
      }

      const data = await response.json();
      toast.success(data.message || `Role ${role} assigned successfully`);
      setEmail('');
      setRole('guest');

      // Refresh user list
      await fetchUsers();
    } catch (err) {
      console.error('Error assigning role:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to assign role';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initialize on mount
  useEffect(() => {
    checkAdminStatus();
  }, []);

  // Fetch users when admin status is confirmed
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const getRoleIcon = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'staff':
        return <Settings className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'staff':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Show error state for non-admins
  if (error && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={() => (window.location.href = '/')}
              variant="outline"
              className="w-full"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Assign admin roles to users
          </p>
          {currentUser && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Logged in as: {currentUser}
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Assign User Role
            </CardTitle>
            <CardDescription>
              Give administrative privileges to existing users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  disabled={loading || !isAdmin}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      assignRole();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(value: 'admin' | 'staff' | 'guest') =>
                    setRole(value)
                  }
                  disabled={loading || !isAdmin}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guest">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Guest
                      </div>
                    </SelectItem>
                    <SelectItem value="staff">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Staff
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={assignRole}
                  disabled={loading || !email.trim() || !isAdmin}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Role'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Users</CardTitle>
                <CardDescription>
                  All registered users and their roles
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={fetchingUsers || !isAdmin}
              >
                {fetchingUsers ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {fetchingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No users found
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.email}
                        </p>
                        {user.email === currentUser && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.full_name || 'No name set'}
                      </p>
                      {!user.email_confirmed && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Email not confirmed
                        </p>
                      )}
                    </div>
                    <Badge className={getRoleColor(user.role)}>
                      <span className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
