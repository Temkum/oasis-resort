import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Bed,
  Utensils,
  QrCode,
  CreditCard,
  Star,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react';

export function GuestDashboard() {
  // Mock data - replace with real data from Supabase
  const upcomingBooking = {
    id: 1,
    roomType: 'Deluxe Suite',
    roomNumber: '205',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    status: 'confirmed',
    totalPrice: '$1,200',
  };

  const pastBookings = [
    {
      id: 2,
      roomType: 'Standard Room',
      checkIn: '2023-12-20',
      checkOut: '2023-12-22',
      status: 'completed',
    },
    {
      id: 3,
      roomType: 'Ocean View',
      checkIn: '2023-11-15',
      checkOut: '2023-11-17',
      status: 'completed',
    },
  ];

  const quickActions = [
    {
      title: 'Book New Room',
      description: 'Reserve your next stay',
      icon: Bed,
      href: '/guest/book',
    },
    {
      title: 'Room Service',
      description: 'Order food to your room',
      icon: Utensils,
      href: '/guest/room-service',
    },
    {
      title: 'Digital Key',
      description: 'Access your room digitally',
      icon: QrCode,
      href: '/guest/digital-key',
    },
    {
      title: 'View Bills',
      description: 'Check your charges',
      icon: CreditCard,
      href: '/guest/billing',
    },
  ];

  const currentStay = {
    roomNumber: '205',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    daysRemaining: 2,
    totalCharges: '$450',
  };

  return (
    <div className="space-y-6">
      {/* Current Stay Card */}
      {currentStay && (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Current Stay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Room</p>
                <p className="text-xl font-semibold">
                  {currentStay.roomNumber}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Check-out</p>
                <p className="text-xl font-semibold">{currentStay.checkOut}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Days Remaining</p>
                <p className="text-xl font-semibold">
                  {currentStay.daysRemaining}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Current Charges</p>
                <p className="text-xl font-semibold">
                  {currentStay.totalCharges}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                Digital Key
              </Button>
              <Button variant="secondary" size="sm">
                <Utensils className="h-4 w-4 mr-2" />
                Room Service
              </Button>
              <Button variant="secondary" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                View Bill
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="text-center">
                <action.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <CardTitle className="text-sm">{action.title}</CardTitle>
                <CardDescription className="text-xs">
                  {action.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Booking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Booking
            </CardTitle>
            <CardDescription>Your next reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{upcomingBooking.roomType}</p>
                  <p className="text-sm text-muted-foreground">
                    Room {upcomingBooking.roomNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {upcomingBooking.checkIn} - {upcomingBooking.checkOut}
                  </p>
                </div>
                <Badge variant="default">{upcomingBooking.status}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold">{upcomingBooking.totalPrice}</p>
                <Button size="sm">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Past Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Past Bookings
            </CardTitle>
            <CardDescription>Your previous stays</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium">{booking.roomType}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.checkIn} - {booking.checkOut}
                    </p>
                  </div>
                  <Badge variant="secondary">{booking.status}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotel Services */}
      <Card>
        <CardHeader>
          <CardTitle>Hotel Services</CardTitle>
          <CardDescription>
            Explore what Oasis Resort has to offer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Utensils className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Restaurant</h3>
              <p className="text-sm text-muted-foreground">
                Fine dining experience
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View Menu
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Star className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Spa & Wellness</h3>
              <p className="text-sm text-muted-foreground">
                Relax and rejuvenate
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Book Spa
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Events</h3>
              <p className="text-sm text-muted-foreground">
                Upcoming activities
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View Events
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Need assistance? We're here to help</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Front Desk</p>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Utensils className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Room Service</p>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4568
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Concierge</p>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4569
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
