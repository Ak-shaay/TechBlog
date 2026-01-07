import { SubscribeForm } from "./SubscribeForm";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Menu, X, Moon, Sun, Home, BookOpen, Users, Mail, Shield, FileText, AlertCircle, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/about", label: "About", icon: Users },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  const resourceLinks = [
    { href: "/privacy", label: "Privacy Policy", icon: Shield },
    { href: "/terms", label: "Terms of Service", icon: FileText },
    { href: "/disclaimer", label: "Disclaimer", icon: AlertCircle },
  ];

  const socialLinks = [
    { href: "https://instagram.com", label: "Instagram", icon: Instagram },
    { href: "https://twitter.com", label: "Twitter", icon: X },
    { href: "https://facebook.com", label: "Facebook", icon: Facebook },
    { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
              <Logo />
              <span className="hidden font-bold text-lg sm:inline-block">TechTrendsAI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors no-underline"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-accent" />
                ) : (
                  <Moon className="h-5 w-5 text-accent" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors md:hidden"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="border-t border-border md:hidden py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors no-underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          {/* Newsletter Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 pb-12 border-b border-border">
            {/* Brand & Subscribe */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Logo />
                <span className="font-bold text-lg">TechTrendsAI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Deep dives into modern technology, software development, AI, cloud infrastructure, and cybersecurity.
              </p>

              <div className="space-y-2 max-w-sm">
                <h4 className="text-sm font-semibold">Subscribe to our newsletter</h4>
                <SubscribeForm />
              </div>

              <p className="text-xs text-muted-foreground pt-4">
                © {new Date().getFullYear()} TechTrendsAI. All rights reserved.
              </p>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="font-semibold mb-6 text-foreground">Quick Links</h4>
              <ul className="space-y-3 list-none ml-0">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors no-underline group"
                      >
                        <Icon className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Resources & Legal */}
            <div>
              <h4 className="font-semibold mb-6 text-foreground">Legal & Resources</h4>
              <ul className="space-y-3 list-none ml-0">
                {resourceLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors no-underline group"
                      >
                        <Icon className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              Empowering developers with insights on cutting-edge technologies and best practices.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:block">
                Follow Us
              </span>
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200 group"
                      aria-label={link.label}
                    >
                      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


