import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Technology', href: '/category/technology' },
  { label: 'Design', href: '/category/design' },
  { label: 'Business', href: '/category/business' },
];

const UserLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <span className="font-serif text-xl font-bold text-foreground">BlogCMS</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === link.href
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <Input placeholder="Search articles..." className="w-48 lg:w-64 h-9" autoFocus />
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
                  <Search className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleDark}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md ${
                    location.pathname === link.href ? 'text-primary bg-primary/5' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">B</span>
                </div>
                <span className="font-serif text-xl font-bold">BlogCMS</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A modern, self-hosted blog platform built for developers and content creators.
              </p>
            </div>
            <div>
              <h4 className="font-sans font-semibold text-sm mb-4">Categories</h4>
              <div className="flex flex-col gap-2">
                {['Technology', 'Design', 'Business', 'Lifestyle'].map(cat => (
                  <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{cat}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-sans font-semibold text-sm mb-4">Resources</h4>
              <div className="flex flex-col gap-2">
                {['API Documentation', 'GitHub', 'Changelog', 'Support'].map(item => (
                  <span key={item} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-sans font-semibold text-sm mb-4">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-3">Get the latest articles delivered to your inbox.</p>
              <div className="flex gap-2">
                <Input placeholder="your@email.com" className="h-9 text-sm" />
                <Button size="sm" className="h-9">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BlogCMS. All rights reserved.</p>
            <div className="flex gap-4">
              {['Privacy', 'Terms', 'Contact'].map(item => (
                <span key={item} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
