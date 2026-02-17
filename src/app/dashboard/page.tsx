"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Home, Tag, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
    name: string;
    email: string;
}

const dashboardCards = [
  {
    icon: Home,
    title: 'For Buyers',
    description: 'Find your dream home, save favorites, and connect with agents.',
    href: '#',
    cta: 'Explore Listings'
  },
  {
    icon: Tag,
    title: 'For Sellers',
    description: 'List your property, get market insights, and manage offers.',
    href: '#',
    cta: 'List Your Property'
  }
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authDataString = localStorage.getItem('auth');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        if (authData.expiry && authData.expiry > Date.now()) {
          setUser(authData.user);
        } else {
          localStorage.removeItem('auth');
          setUser(null);
          router.push('/login');
        }
      } catch (e) {
        console.error("Failed to parse auth data from localStorage", e)
        setUser(null)
      }
    }
    setLoading(false);
  }, [router]);

   const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (loading) {
    return (
      <div className="container py-12 md:py-16">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2 mt-4" />
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Skeleton className="h-6 w-6 rounded-full" /> <Skeleton className="h-6 w-40" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-16">
      {user ? (
        <>
          <motion.div initial="hidden" animate="visible" variants={itemVariants}>
            <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              We're glad to see you again. Here's your personalized dashboard to manage your real estate journey.
            </p>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="text-primary" /> Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Username:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="mt-8 grid gap-6 sm:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {dashboardCards.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                className="h-full"
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="rounded-full bg-primary/10 p-3">
                      <card.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{card.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <CardDescription>
                        {card.description}
                      </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={card.href}>{card.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <div className="text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            Please log in to view your dashboard.
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            You need to be logged in to access this page.
          </p>
          <Button asChild className="mt-4">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
