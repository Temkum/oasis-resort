import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  Key,
  UtensilsCrossed,
  Snowflake,
  Menu,
  X,
  User,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navCategories = [
  { name: 'Hotels', icon: Building2 },
  { name: 'Residences', icon: Home },
  { name: 'Rentals', icon: Key },
  { name: 'Dining', icon: UtensilsCrossed },
  { name: 'Winter Travel', icon: Snowflake },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        {/* Top Bar */}
        <div
          className={`border-b transition-colors duration-500 ${
            isScrolled ? 'border-border' : 'border-white/20'
          }`}
        >
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                className={`flex items-center gap-2 text-xs uppercase tracking-widest transition-colors ${
                  isScrolled
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">English</span>
              </button>
            </div>

            <a
              href="/"
              className={`font-serif text-2xl md:text-3xl tracking-wide transition-colors ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              <span className="font-normal">OASIS</span>
              <span className="italic font-light ml-1">Resort</span>
            </a>

            <div className="flex items-center gap-4">
              {user ? (
                <button
                  className={`hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest transition-colors ${
                    isScrolled
                      ? 'text-muted-foreground hover:text-foreground'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>
                    <Link to="/admin/dashboard">Account</Link>
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className={`hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest transition-colors ${
                    isScrolled
                      ? 'text-muted-foreground hover:text-foreground'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 transition-colors ${
                  isScrolled ? 'text-foreground' : 'text-white'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="hidden lg:block">
          <div className="container mx-auto px-6">
            <ul className="flex items-center justify-center gap-8 py-4">
              {navCategories.map((category) => (
                <li key={category.name}>
                  <a
                    href={`#${category.name.toLowerCase().replace(' ', '-')}`}
                    className={`group flex items-center gap-2 text-xs uppercase tracking-widest transition-all duration-300 ${
                      isScrolled
                        ? 'text-muted-foreground hover:text-primary'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <category.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="relative">
                      {category.name}
                      <span
                        className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                          isScrolled ? 'bg-primary' : 'bg-white'
                        }`}
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background lg:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="pt-32 px-8"
            >
              <ul className="space-y-6">
                {navCategories.map((category, index) => (
                  <motion.li
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                  >
                    <a
                      href={`#${category.name.toLowerCase().replace(' ', '-')}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 text-2xl font-serif text-foreground hover:text-primary transition-colors"
                    >
                      <category.icon className="w-6 h-6 text-primary" />
                      {category.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
