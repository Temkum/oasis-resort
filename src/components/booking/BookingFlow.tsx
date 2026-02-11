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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Calendar as CalendarIcon,
  Users,
  Bed,
  DollarSign,
  Check,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Wifi,
  Car,
  Coffee,
} from 'lucide-react';
import { format, addDays, isBefore, isAfter, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
}

interface BookingData {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;
  roomId: string | undefined;
  room: Room | undefined;
  specialRequests: string;
  extras: string[];
  totalPrice: number;
}

const extras = [
  { id: 'breakfast', name: 'Breakfast', price: 25, icon: Coffee },
  { id: 'parking', name: 'Parking', price: 15, icon: Car },
  { id: 'wifi', name: 'Premium WiFi', price: 10, icon: Wifi },
];

export function BookingFlow() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: undefined,
    checkOut: undefined,
    guests: 1,
    roomId: undefined,
    room: undefined,
    specialRequests: '',
    extras: [],
    totalPrice: 0,
  });

  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['available-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available')
        .order('price_per_night');

      if (error) throw error;
      return data as Room[];
    },
    enabled: !!bookingData.checkIn && !!bookingData.checkOut,
  });

  const calculateTotalPrice = () => {
    if (!bookingData.room || !bookingData.checkIn || !bookingData.checkOut)
      return 0;

    const nights = Math.ceil(
      (bookingData.checkOut.getTime() - bookingData.checkIn.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const roomPrice = nights * bookingData.room.price_per_night;
    const extrasPrice = bookingData.extras.reduce((total, extraId) => {
      const extra = extras.find((e) => e.id === extraId);
      return total + (extra?.price || 0) * nights;
    }, 0);

    return roomPrice + extrasPrice;
  };

  const updateBookingData = (updates: Partial<BookingData>) => {
    const newData = { ...bookingData, ...updates };
    if (updates.room || updates.checkIn || updates.checkOut || updates.extras) {
      newData.totalPrice = calculateTotalPrice();
    }
    setBookingData(newData);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          bookingData.checkIn && bookingData.checkOut && bookingData.guests > 0
        );
      case 2:
        return bookingData.roomId && bookingData.room;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const Step1Dates = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Select Your Dates</h2>
        <p className="text-muted-foreground">
          Choose your check-in and check-out dates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !bookingData.checkIn && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bookingData.checkIn
                  ? format(bookingData.checkIn, 'PPP')
                  : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bookingData.checkIn}
                onSelect={(date) => {
                  if (date) {
                    setBookingData((prev) => ({ ...prev, checkIn: date }));
                    if (
                      bookingData.checkOut &&
                      isBefore(bookingData.checkOut, date)
                    ) {
                      setBookingData((prev) => ({
                        ...prev,
                        checkOut: addDays(date, 1),
                      }));
                    }
                  }
                }}
                disabled={(date) => isBefore(date, startOfDay(new Date()))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !bookingData.checkOut && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bookingData.checkOut
                  ? format(bookingData.checkOut, 'PPP')
                  : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bookingData.checkOut}
                onSelect={(date) =>
                  date &&
                  setBookingData((prev) => ({ ...prev, checkOut: date }))
                }
                disabled={(date) =>
                  isBefore(date, startOfDay(new Date())) ||
                  (bookingData.checkIn && isBefore(date, bookingData.checkIn))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Number of Guests</Label>
        <Select
          value={bookingData.guests.toString()}
          onValueChange={(value) =>
            setBookingData((prev) => ({ ...prev, guests: parseInt(value) }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select number of guests" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {bookingData.checkIn && bookingData.checkOut && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stay Duration</p>
                <p className="text-sm text-muted-foreground">
                  {Math.ceil(
                    (bookingData.checkOut.getTime() -
                      bookingData.checkIn.getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{' '}
                  nights
                </p>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const Step2Rooms = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Select Your Room</h2>
        <p className="text-muted-foreground">Choose from our available rooms</p>
      </div>

      {roomsLoading ? (
        <div>Loading rooms...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms?.map((room) => (
            <Card
              key={room.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                bookingData.roomId === room.id ? 'ring-2 ring-blue-500' : '',
              )}
              onClick={() => updateBookingData({ roomId: room.id, room })}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {room.room_number}
                    </CardTitle>
                    <CardDescription>{room.type}</CardDescription>
                  </div>
                  {bookingData.roomId === room.id && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
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

                  {room.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {room.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const Step3Extras = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Enhance Your Stay</h2>
        <p className="text-muted-foreground">
          Add extra services to your booking
        </p>
      </div>

      <div className="space-y-4">
        {extras.map((extra) => (
          <Card
            key={extra.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <extra.icon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">{extra.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${extra.price}/night
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={bookingData.extras.includes(extra.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateBookingData({
                        extras: [...bookingData.extras, extra.id],
                      });
                    } else {
                      updateBookingData({
                        extras: bookingData.extras.filter(
                          (id) => id !== extra.id,
                        ),
                      });
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="special-requests">Special Requests</Label>
        <Textarea
          id="special-requests"
          placeholder="Let us know if you have any special requests..."
          value={bookingData.specialRequests}
          onChange={(e) =>
            updateBookingData({ specialRequests: e.target.value })
          }
        />
      </div>
    </div>
  );

  const Step4Confirmation = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Confirm Your Booking</h2>
        <p className="text-muted-foreground">Review your booking details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-medium">
                    {bookingData.checkIn && format(bookingData.checkIn, 'PPP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-medium">
                    {bookingData.checkOut &&
                      format(bookingData.checkOut, 'PPP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-medium">{bookingData.guests} guests</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-medium">
                    {bookingData.room?.room_number} - {bookingData.room?.type}
                  </p>
                </div>
              </div>

              {bookingData.specialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Special Requests
                  </p>
                  <p className="text-sm">{bookingData.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="text-sm text-muted-foreground">Name:</span>{' '}
                  {user?.user_metadata?.full_name || 'Guest'}
                </p>
                <p>
                  <span className="text-sm text-muted-foreground">Email:</span>{' '}
                  {user?.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Room ({bookingData.room?.type})</span>
                <span>
                  ${bookingData.room?.price_per_night || 0} x{' '}
                  {bookingData.checkIn && bookingData.checkOut
                    ? Math.ceil(
                        (bookingData.checkOut.getTime() -
                          bookingData.checkIn.getTime()) /
                          (1000 * 60 * 60 * 24),
                      )
                    : 0}{' '}
                  nights
                </span>
              </div>

              {bookingData.extras.map((extraId) => {
                const extra = extras.find((e) => e.id === extraId);
                if (!extra) return null;
                const nights =
                  bookingData.checkIn && bookingData.checkOut
                    ? Math.ceil(
                        (bookingData.checkOut.getTime() -
                          bookingData.checkIn.getTime()) /
                          (1000 * 60 * 60 * 24),
                      )
                    : 0;
                return (
                  <div key={extraId} className="flex justify-between">
                    <span>{extra.name}</span>
                    <span>
                      ${extra.price} x {nights} nights
                    </span>
                  </div>
                );
              })}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${calculateTotalPrice()}</span>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg">
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Dates', description: 'Select your stay dates' },
    { number: 2, title: 'Room', description: 'Choose your room' },
    { number: 3, title: 'Extras', description: 'Add services' },
    { number: 4, title: 'Confirm', description: 'Review & book' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                currentStep >= step.number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600',
              )}
            >
              {step.number}
            </div>
            <div className="ml-3">
              <p
                className={cn(
                  'text-sm font-medium',
                  currentStep >= step.number
                    ? 'text-blue-600'
                    : 'text-gray-600',
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-8 h-0.5 mx-4',
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200',
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border p-6">
        {currentStep === 1 && <Step1Dates />}
        {currentStep === 2 && <Step2Rooms />}
        {currentStep === 3 && <Step3Extras />}
        {currentStep === 4 && <Step4Confirmation />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={nextStep}
          disabled={!isStepValid() || currentStep === 4}
        >
          {currentStep === 4 ? 'Complete Booking' : 'Next'}
          {currentStep < 4 && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
