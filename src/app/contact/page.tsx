"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-20">
      <div
        className="text-center"
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Have questions or ready to start your journey? We're here to help.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you today?"
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-foreground">Our Office</h3>
                        <p>123 Main Street, Anytown, USA 12345</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-foreground">Email Us</h3>
                        <a href="mailto:info@estately.com" className="hover:text-primary">info@estately.com</a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-foreground">Call Us</h3>
                        <a href="tel:+1234567890" className="hover:text-primary">(123) 456-7890</a>
                    </div>
                </div>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Map Placeholder
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
