import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com',
  },
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com',
  },
];

const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/connect-agent', label: 'Find an Agent' },
];

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Modern solutions for modern real estate. We help you find your
              dream home with ease.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:col-span-2 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Contact Us</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>123 Main Street</li>
                <li>Anytown, USA 12345</li>
                <li>
                  <a href="mailto:info@estately.com" className="hover:text-foreground">
                    info@estately.com
                  </a>
                </li>
                <li>
                  <a href="tel:+1234567890" className="hover:text-foreground">
                    (123) 456-7890
                  </a>
                </li>
              </ul>
            </div>
             <div className="hidden md:block">
              <h3 className="text-sm font-semibold">Follow Us</h3>
              <div className="mt-4 flex gap-2">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <a href={social.url} target="_blank" rel="noreferrer">
                      <social.icon className="h-4 w-4" />
                      <span className="sr-only">{social.name}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Estately, Inc. All rights reserved.
          </p>
          <div className="mt-4 flex gap-2 sm:hidden">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a href={social.url} target="_blank" rel="noreferrer">
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                </Button>
              ))}
            </div>
        </div>
      </div>
    </footer>
  );
}
