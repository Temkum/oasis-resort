import React, { useState } from 'react';
import { useRoomStore } from '@/stores/roomStore';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  Edit,
  Trash2,
  Bed,
  Users,
  DollarSign,
  Image as ImageIcon,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const roomTypes = [
  'Standard',
  'Deluxe',
  'Suite',
  'Presidential',
  'Ocean View',
  'Garden View',
];
const amenities = [
  'WiFi',
  'Air Conditioning',
  'Mini Bar',
  'Safe',
  'Balcony',
  'Ocean View',
  'King Bed',
  'Queen Bed',
  'Twin Beds',
  'Jacuzzi',
  'Kitchenette',
  'Living Room',
];

interface Room {
  id: string;
  room_number: string;
  type: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  images: string[];
  description: string | null;
  status: 'available' | 'maintenance' | 'booked';
  created_at: string;
  updated_at: string;
}

type RoomFormData = Omit<Room, 'id' | 'created_at' | 'updated_at'>;

export function RoomManagement() {
  const {
    isAddRoomModalOpen,
    isEditRoomModalOpen,
    currentRoom,
    openAddRoomModal,
    closeAddRoomModal,
    openEditRoomModal,
    closeEditRoomModal,
  } = useRoomStore();
  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');

      if (error) throw error;
      return data as Room[];
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: async (
      roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>,
    ) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert(roomData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room created successfully');
      closeAddRoomModal();
    },
    onError: (error) => {
      toast.error('Failed to create room: ' + error.message);
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: async ({ id, ...roomData }: Partial<Room> & { id: string }) => {
      const { data, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room updated successfully');
      closeEditRoomModal();
    },
    onError: (error) => {
      toast.error('Failed to update room: ' + error.message);
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rooms').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete room: ' + error.message);
    },
  });

  const RoomForm = ({
    room,
    onSubmit,
  }: {
    room?: Room;
    onSubmit: (data: RoomFormData) => void;
  }) => {
    const [formData, setFormData] = useState({
      room_number: room?.room_number || '',
      type: room?.type || '',
      capacity: room?.capacity || 2,
      price_per_night: room?.price_per_night || 100,
      amenities: room?.amenities || [],
      images: room?.images || [],
      description: room?.description || '',
      status: room?.status || ('available' as const),
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const handleAmenityToggle = (amenity: string, checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, amenity]
          : prev.amenities.filter((a) => a !== amenity),
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="room_number">Room Number</Label>
            <Input
              id="room_number"
              value={formData.room_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  room_number: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Room Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="10"
              value={formData.capacity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  capacity: parseInt(e.target.value),
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="price_per_night">Price per Night</Label>
            <Input
              id="price_per_night"
              type="number"
              min="0"
              step="0.01"
              value={formData.price_per_night}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price_per_night: parseFloat(e.target.value),
                }))
              }
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: Room['status']) =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Amenities</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleAmenityToggle(amenity, checked as boolean)
                  }
                />
                <Label htmlFor={amenity} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Enter room description..."
          />
        </div>

        <DialogFooter>
          <Button type="submit">{room ? 'Update Room' : 'Create Room'}</Button>
        </DialogFooter>
      </form>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Room Management</h1>
          <p className="text-muted-foreground">
            Manage hotel rooms and availability
          </p>
        </div>
        <Dialog open={isAddRoomModalOpen} onOpenChange={closeAddRoomModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Create a new room in the hotel inventory
              </DialogDescription>
            </DialogHeader>
            <RoomForm onSubmit={(data) => createRoomMutation.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Room Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Bed className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold">{rooms?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold">
                  {rooms?.filter((r) => r.status === 'available').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-red-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Booked</p>
                <p className="text-2xl font-bold">
                  {rooms?.filter((r) => r.status === 'booked').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold">
                  {rooms?.filter((r) => r.status === 'maintenance').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms?.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{room.room_number}</CardTitle>
                  <CardDescription>{room.type}</CardDescription>
                </div>
                <Badge className={getStatusColor(room.status)}>
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {room.capacity} guests
                  </div>
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {room.price_per_night}/night
                  </div>
                </div>

                {room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="text-xs"
                      >
                        {amenity}
                      </Badge>
                    ))}
                    {room.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {room.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {room.description}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditRoomModal(room)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteRoomMutation.mutate(room.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Room Dialog */}
      <Dialog open={isEditRoomModalOpen} onOpenChange={closeEditRoomModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update room information and settings
            </DialogDescription>
          </DialogHeader>
          {currentRoom && (
            <RoomForm
              room={currentRoom}
              onSubmit={(data) =>
                updateRoomMutation.mutate({ id: currentRoom.id, ...data })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
