# Oasis Resort Hotel Management System

A comprehensive hotel management system built with React, TypeScript, and Supabase. This system provides separate dashboards for administrators and guests, with full booking management, room inventory, restaurant services, and more.

## 🚀 Features

### Core Features

- **User Management**: Role-based authentication (Admin, Staff, Guest)
- **Room Management**: Complete CRUD operations, availability tracking, status management
- **Booking System**: Multi-step booking flow with real-time availability checking
- **Restaurant Management**: Menu management and table reservations
- **Events Management**: Event creation and registration system
- **Services**: Spa, activities, and additional service bookings
- **Reporting**: Analytics and revenue tracking
- **Payment Integration**: Secure payment processing (Stripe/PayPal ready)

### Admin Dashboard

- Today's check-ins/check-outs overview
- Occupancy rate visualization
- Revenue charts and analytics
- Room status management
- Staff activity logs
- Customer feedback management
- Pending actions and tasks

### Guest Dashboard

- Upcoming and past reservations
- Digital room key/QR code access
- In-stay services (housekeeping, room service)
- Bills and invoices
- Loyalty points program
- Personal preferences

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Radix UI** for accessible components
- **React Query** for data fetching
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Framer Motion** for animations
- **Recharts** for data visualization

### Backend

- **Supabase** for database and authentication
- **PostgreSQL** database
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates

### Development Tools

- **ESLint** for code quality
- **TypeScript** for type safety
- **Vitest** for testing
- **Prettier** for code formatting

## 📋 Database Schema

The system uses a comprehensive PostgreSQL schema with the following main tables:

### User Management

- `profiles` - User profile information
- `user_roles` - Role assignments (admin, staff, guest)

### Core Operations

- `rooms` - Room inventory and details
- `bookings` - Booking records and status
- `menu_items` - Restaurant menu management
- `table_reservations` - Restaurant table bookings
- `events` - Event management
- `event_registrations` - Event sign-ups
- `services` - Additional services (spa, activities)
- `promotions` - Discount and pricing management

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd oasis-resort
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env.local file
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `Todo.md` in your Supabase SQL editor
   - Enable Row Level Security (RLS) policies
   - Set up authentication providers

5. **Start the development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── booking/        # Booking flow components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── lib/
│   ├── supabase.ts     # Supabase client
│   └── database.types.ts # TypeScript types
├── pages/
│   ├── admin/          # Admin dashboard pages
│   └── guest/          # Guest dashboard pages
└── hooks/              # Custom React hooks
```

## 🔐 Authentication & Security

### Role-Based Access Control

- **Admin**: Full system access
- **Staff**: Limited operational access
- **Guest**: Personal booking and services access

### Security Features

- Row Level Security (RLS) on all tables
- JWT-based authentication
- Secure API endpoints
- Input validation and sanitization
- XSS protection

## 📱 Responsive Design

The system is fully responsive and works seamlessly on:

- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 UI/UX Features

- Modern, clean interface matching luxury resort aesthetic
- Intuitive navigation and user flows
- Real-time updates and notifications
- Loading states and error handling
- Accessibility compliance (WCAG 2.1)
- Dark mode support (planned)

## 📊 Analytics & Reporting

### Admin Reports

- Occupancy rates and trends
- Revenue breakdown by service
- Booking source tracking
- Customer demographics
- Seasonal trends analysis
- Export capabilities (PDF, Excel)

### Real-time Metrics

- Current occupancy
- Today's revenue
- Pending check-ins/check-outs
- Active service requests

## 🔧 API Integration

### Payment Processing

- Stripe integration ready
- PayPal support planned
- Secure payment handling
- Invoice generation

### External Services

- Email notifications (Resend/SendGrid)
- SMS notifications (Twilio)
- Calendar integration (Google Calendar)
- Channel manager integration

## 🧪 Testing

### Running Tests

```bash
# Run unit tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test --coverage
```

### Test Coverage

- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for API calls
- E2E testing planned (Playwright)

## 🚀 Deployment

### Production Build

```bash
bun build
# or
npm run build
```

### Environment Setup

- Production environment variables
- Supabase production configuration
- SSL certificates
- CDN setup for static assets

### Deployment Options

- **Vercel** (Recommended)
- **Netlify**
- **AWS Amplify**
- **Docker** container

## 📈 Performance Optimization

- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization
- Server-side rendering (planned)

## 🔄 Continuous Integration

### GitHub Actions

- Automated testing on PR
- Code quality checks
- Security scanning
- Auto-deployment on merge

## 📝 Development Guidelines

### Code Style

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

### Best Practices

- Component-driven development
- Custom hooks for logic
- Error boundaries
- Loading states
- Accessibility first

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the FAQ section

## 🗺 Roadmap

### Phase 1 (Current)

- ✅ Basic authentication
- ✅ Room management
- ✅ Booking system
- ✅ Admin dashboard
- ✅ Guest dashboard

### Phase 2 (In Progress)

- 🔄 Restaurant management
- 🔄 Events system
- 🔄 Payment integration
- 🔄 Email notifications

### Phase 3 (Planned)

- 📋 Mobile app (React Native)
- 📋 Advanced analytics
- 📋 Multi-property support
- 📋 Channel manager integration
- 📋 AI-powered recommendations

## 📞 Contact

For business inquiries or support:

- Email: support@oasisresort.com
- Phone: +1 (555) 123-4567
- Address: 123 Resort Drive, Paradise Island

---

**Built with ❤️ for Oasis Resort**
