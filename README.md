# Oasis Resort

A luxury hotel website inspired by Four Seasons, built with modern web technologies.

## Overview

Oasis Resort is a sophisticated, responsive luxury hospitality website featuring elegant design, smooth animations, and immersive user experience. The site showcases premium properties, dining experiences, and exclusive travel services.

## Features

- **Hero Section** - Full-screen video background with autoplay controls and scroll indicator
- **Horizontal Navigation** - Transparent navbar with category icons (Hotels, Residences, Rentals, Dining, Private Jet, Yachts, Winter Travel)
- **Discover Section** - Themed destination cards with hover effects
- **Featured Properties Carousel** - Animated property showcase with pagination and navigation
- **Dining Experiences** - Curated culinary offerings section
- **New Openings** - Upcoming property announcements with opening dates
- **History & Legacy** - Brand story with parallax effects and statistics
- **Responsive Footer** - Comprehensive navigation and social links

## Design System

### Typography
- **Headings**: Playfair Display (serif) with italic emphasis
- **Body**: DM Sans (sans-serif)

### Color Palette
- Primary Black: `#000000`
- Primary White: `#FFFFFF`
- Teal Accent: `#1A5F5B`
- Gold Accent: `#C9A962`
- Muted tones for backgrounds and text

### Animations
- Framer Motion for scroll-based animations
- Smooth transitions and hover effects
- Video background with play/pause controls

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── DiscoverSection.tsx
│   │   ├── FeaturedPropertiesSection.tsx
│   │   ├── DiningSection.tsx
│   │   ├── NewOpeningsSection.tsx
│   │   └── HistorySection.tsx
│   └── ui/
├── pages/
│   └── Index.tsx
├── hooks/
├── lib/
└── index.css
```

## License

This project is for demonstration purposes.
