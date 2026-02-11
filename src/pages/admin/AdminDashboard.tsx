import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Bed,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export function AdminDashboard() {
  // Mock data - replace with real data from Supabase
  const stats = [
    {
      title: 'Total Bookings',
      value: '127',
      change: '+12%',
      changeType: 'positive',
      icon: Calendar,
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: '+5%',
      changeType: 'positive',
      icon: Bed,
    },
    {
      title: 'Revenue Today',
      value: '$12,450',
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Active Guests',
      value: '89',
      change: '+3%',
      changeType: 'positive',
      icon: Users,
    },
  ];

  const todayCheckIns = [
    {
      id: 1,
      guest: 'John Smith',
      room: '101',
      time: '2:00 PM',
      status: 'confirmed',
    },
    {
      id: 2,
      guest: 'Sarah Johnson',
      room: '205',
      time: '3:00 PM',
      status: 'pending',
    },
    {
      id: 3,
      guest: 'Michael Brown',
      room: '302',
      time: '4:00 PM',
      status: 'confirmed',
    },
  ];

  const todayCheckOuts = [
    {
      id: 1,
      guest: 'Emma Wilson',
      room: '103',
      time: '11:00 AM',
      status: 'completed',
    },
    {
      id: 2,
      guest: 'David Lee',
      room: '207',
      time: '12:00 PM',
      status: 'pending',
    },
  ];

  const recentBookings = [
    {
      id: 1,
      guest: 'Alice Cooper',
      room: 'Deluxe Suite',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      status: 'confirmed',
    },
    {
      id: 2,
      guest: 'Bob Martin',
      room: 'Standard Room',
      checkIn: '2024-01-16',
      checkOut: '2024-01-17',
      status: 'pending',
    },
    {
      id: 3,
      guest: 'Carol White',
      room: 'Presidential Suite',
      checkIn: '2024-01-20',
      checkOut: '2024-01-25',
      status: 'confirmed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Today's Check-ins
            </CardTitle>
            <CardDescription>Guests checking in today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayCheckIns.map((checkIn) => (
              <div
                key={checkIn.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{checkIn.guest}</p>
                  <p className="text-sm text-muted-foreground">
                    Room {checkIn.room} • {checkIn.time}
                  </p>
                </div>
                <Badge
                  variant={
                    checkIn.status === 'confirmed' ? 'default' : 'secondary'
                  }
                >
                  {checkIn.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Check-ins
            </Button>
          </CardContent>
        </Card>

        {/* Today's Check-outs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Check-outs
            </CardTitle>
            <CardDescription>Guests checking out today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayCheckOuts.map((checkOut) => (
              <div
                key={checkOut.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{checkOut.guest}</p>
                  <p className="text-sm text-muted-foreground">
                    Room {checkOut.room} • {checkOut.time}
                  </p>
                </div>
                <Badge
                  variant={
                    checkOut.status === 'completed' ? 'default' : 'secondary'
                  }
                >
                  {checkOut.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Check-outs
            </Button>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{booking.guest}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.room}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.checkIn} - {booking.checkOut}
                  </p>
                </div>
                <Badge
                  variant={
                    booking.status === 'confirmed' ? 'default' : 'secondary'
                  }
                >
                  {booking.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Bookings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Room Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Room Status Overview
          </CardTitle>
          <CardDescription>
            Current room availability and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">45</div>
              <div className="text-sm text-green-800">Available</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">32</div>
              <div className="text-sm text-blue-800">Occupied</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-yellow-800">Maintenance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-purple-800">Reserved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Pending Actions
          </CardTitle>
          <CardDescription>Tasks requiring your attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <p className="font-medium">Room 305 - Maintenance Required</p>
              <p className="text-sm text-muted-foreground">
                Air conditioning issue reported
              </p>
            </div>
            <Button size="sm">View Details</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium">New Booking Request</p>
              <p className="text-sm text-muted-foreground">
                Group booking for 10 rooms - pending approval
              </p>
            </div>
            <Button size="sm">Review</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium">Payment Received</p>
              <p className="text-sm text-muted-foreground">
                Booking #1234 - payment confirmed
              </p>
            </div>
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
