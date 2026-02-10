import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  Utensils,
  DollarSign,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  created_at: string;
}

interface TableReservation {
  id: string;
  user_id: string;
  date: string;
  time: string;
  guests: number;
  table_number: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  created_at: string;
}

const categories = [
  'Appetizers',
  'Main Course',
  'Desserts',
  'Beverages',
  'Soups',
  'Salads',
  'Specials',
];

export function RestaurantManagement() {
  const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [activeTab, setActiveTab] = useState('menu');
  const queryClient = useQueryClient();

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data as MenuItem[];
    },
  });

  const { data: reservations, isLoading: reservationsLoading } = useQuery({
    queryKey: ['table-reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('table_reservations')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data as TableReservation[];
    },
  });

  const createMenuItemMutation = useMutation({
    mutationFn: async (itemData: Omit<MenuItem, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item added successfully');
      setIsAddMenuItemDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to add menu item: ' + error.message);
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: async ({
      id,
      ...itemData
    }: Partial<MenuItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item updated successfully');
      setEditingMenuItem(null);
    },
    onError: (error) => {
      toast.error('Failed to update menu item: ' + error.message);
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete menu item: ' + error.message);
    },
  });

  const updateReservationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('table_reservations')
        .update({ status: status as any })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
      toast.success('Reservation status updated');
    },
    onError: (error) => {
      toast.error('Failed to update reservation: ' + error.message);
    },
  });

  const MenuItemForm = ({
    item,
    onSubmit,
  }: {
    item?: MenuItem;
    onSubmit: (data: any) => void;
  }) => {
    const [formData, setFormData] = useState({
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price || 0,
      category: item?.category || '',
      image_url: item?.image_url || '',
      available: item?.available ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: parseFloat(e.target.value),
              }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Enter item description..."
          />
        </div>

        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, image_url: e.target.value }))
            }
            placeholder="Enter image URL..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="available"
            checked={formData.available}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, available: checked }))
            }
          />
          <Label htmlFor="available">Available</Label>
        </div>

        <DialogFooter>
          <Button type="submit">{item ? 'Update Item' : 'Add Item'}</Button>
        </DialogFooter>
      </form>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedMenuItems =
    menuItems?.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, MenuItem[]>,
    ) || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Restaurant Management</h1>
          <p className="text-muted-foreground">
            Manage menu and table reservations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold">{menuItems?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold">
                  {menuItems?.filter((item) => item.available).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Reservations
                </p>
                <p className="text-2xl font-bold">
                  {reservations?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {reservations?.filter((r) => r.status === 'pending').length ||
                    0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="reservations">Table Reservations</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            <Dialog
              open={isAddMenuItemDialogOpen}
              onOpenChange={setIsAddMenuItemDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Menu Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to the restaurant menu
                  </DialogDescription>
                </DialogHeader>
                <MenuItemForm
                  onSubmit={(data) => createMenuItemMutation.mutate(data)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>{items.length} items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge
                            variant={item.available ? 'default' : 'secondary'}
                          >
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                        <p className="text-lg font-semibold text-blue-600 mt-2">
                          ${item.price}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMenuItem(item)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMenuItemMutation.mutate(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reservations" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Table Reservations</h2>
            <p className="text-muted-foreground">
              Manage restaurant table reservations
            </p>
          </div>

          <div className="space-y-4">
            {reservations?.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">
                          Table {reservation.table_number || 'TBD'}
                        </h3>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <p className="font-medium">{reservation.date}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <p className="font-medium">{reservation.time}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Guests:</span>
                          <p className="font-medium">{reservation.guests}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Created:
                          </span>
                          <p className="font-medium">
                            {new Date(
                              reservation.created_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {reservation.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Notes: {reservation.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateReservationStatusMutation.mutate({
                                id: reservation.id,
                                status: 'confirmed',
                              })
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateReservationStatusMutation.mutate({
                                id: reservation.id,
                                status: 'cancelled',
                              })
                            }
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Menu Item Dialog */}
      <Dialog
        open={!!editingMenuItem}
        onOpenChange={() => setEditingMenuItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Update menu item information</DialogDescription>
          </DialogHeader>
          {editingMenuItem && (
            <MenuItemForm
              item={editingMenuItem}
              onSubmit={(data) =>
                updateMenuItemMutation.mutate({
                  id: editingMenuItem.id,
                  ...data,
                })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
