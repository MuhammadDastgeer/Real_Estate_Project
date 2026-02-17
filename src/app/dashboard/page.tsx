"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Bot, Building, DollarSign, Home, List, Tag, User, UserPlus, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AddBuyerForm } from '@/components/add-buyer-form';


interface User {
    name: string;
    email: string;
}

const dashboardCards = [
  {
    icon: Home,
    title: 'For Buyers',
    description: 'Tools and features to help you find the perfect home for your clients.',
    cta: 'View Buyer Tools',
    actionType: 'view',
    target: 'buyer'
  },
  {
    icon: Tag,
    title: 'For Sellers',
    description: 'List your property, get market insights, and manage offers.',
    cta: 'View Seller Tools',
    actionType: 'view',
    target: 'seller'
  },
  {
    icon: List,
    title: 'Buyer Listing',
    description: 'View and manage all your buyer listings.',
    cta: 'View Listings',
    actionType: 'link',
    target: '#',
  },
  {
    icon: Building,
    title: 'Seller Listing',
    description: 'View and manage all your seller listings.',
    cta: 'View Listings',
    actionType: 'link',
    target: '#',
  },
];

const buyerTools = [
  {
    icon: UserPlus,
    title: 'Add New Buyers',
    description: 'Keep track of your clients and their preferences.',
    actionType: 'view',
    target: 'addBuyer',
    cta: 'Add Buyer'
  },
  {
    icon: List,
    title: 'Explore Buyer Listing',
    description: 'Search for properties that match your buyers\' needs.',
    actionType: 'link',
    target: '#',
    cta: 'Explore'
  },
  {
    icon: Bot,
    title: 'AI Chatbot Assistant',
    description: 'Get instant answers and market insights from our AI.',
    actionType: 'link',
    target: '#',
    cta: 'Chat Now'
  },
  {
    icon: Building,
    title: 'Price Based House Prediction',
    description: 'Use our AI to predict house prices based on features.',
    actionType: 'link',
    target: '#',
    cta: 'Predict Price'
  },
  {
    icon: DollarSign,
    title: 'House Basic Price Prediction',
    description: 'Get a quick valuation for any property.',
    actionType: 'link',
    target: '#',
    cta: 'Get Estimate'
  }
];

const sellerTools = [
  {
    icon: UserPlus,
    title: 'Add Seller',
    description: 'Add a new seller and property to your portfolio.',
    href: '#',
    cta: 'Add Seller'
  },
  {
    icon: Sparkles,
    title: 'AI Price Suggestion',
    description: 'Get an AI-powered price suggestion for your property.',
    href: '#',
    cta: 'Get Suggestion'
  },
  {
    icon: List,
    title: 'Explore Seller Listing',
    description: 'Manage and view your current seller listings.',
    href: '#',
    cta: 'Explore'
  },
  {
    icon: DollarSign,
    title: 'House Basic Price Prediction',
    description: 'Get a quick valuation for any property.',
    href: '#',
    cta: 'Get Estimate'
  },
  {
    icon: Bot,
    title: 'AI Chatbot Assistant',
    description: 'Get instant answers and market insights from our AI.',
    href: '#',
    cta: 'Chat Now'
  }
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'buyer' | 'seller'>('dashboard');
  const [buyerToolView, setBuyerToolView] = useState<'default' | 'addBuyer'>('default');
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

  if (!user) {
    return (
      <div className="text-center container py-12 md:py-16">
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
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'buyer':
        return (
          <>
            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                <Button variant="ghost" onClick={() => { setActiveView('dashboard'); setBuyerToolView('default'); }} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                { buyerToolView === 'default' && (
                    <>
                        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                            Buyer Tools
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Everything you need to assist your buyers effectively.
                        </p>
                    </>
                )}
            </motion.div>
            
            {buyerToolView === 'default' ? (
                <motion.div
                className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                >
                {buyerTools.map((card) => (
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
                        <CardDescription>{card.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                        {card.actionType === 'view' ? (
                                <Button onClick={() => setBuyerToolView(card.target as any)} className="w-full">
                                    {card.cta}
                                </Button>
                            ) : (
                                <Button asChild className="w-full">
                                    <Link href={card.target as string}>{card.cta}</Link>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                    </motion.div>
                ))}
                </motion.div>
            ) : buyerToolView === 'addBuyer' ? (
                <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mt-8">
                     <AddBuyerForm onBack={() => setBuyerToolView('default')} />
                </motion.div>
            ) : null}
          </>
        );
      case 'seller':
        return (
          <>
            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                <Button variant="ghost" onClick={() => setActiveView('dashboard')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                    Seller Tools
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Everything you need to manage your listings and sellers.
                </p>
            </motion.div>
            <motion.div
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sellerTools.map((card) => (
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
                       <CardDescription>{card.description}</CardDescription>
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
        );
      case 'dashboard':
      default:
        return (
          <>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={itemVariants}>
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
              animate="visible"
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
                        <CardDescription>{card.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                       {card.actionType === 'view' ? (
                            <Button onClick={() => setActiveView(card.target as 'dashboard' | 'buyer' | 'seller')} className="w-full">
                                {card.cta}
                            </Button>
                        ) : (
                            <Button asChild className="w-full">
                                <Link href={card.target as string}>{card.cta}</Link>
                            </Button>
                        )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </>
        );
    }
  };

  return (
    <div className="container py-12 md:py-16">
      {renderContent()}
    </div>
  );
}
