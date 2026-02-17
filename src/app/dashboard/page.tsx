"use client";

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Heart, Users, ShieldCheck, TrendingUp, LineChart } from 'lucide-react';
import Link from 'next/link';

// Metadata is defined but will not be used in a client component.
export const metadata: Metadata = {
  title: 'Dashboard - Estately',
  description: 'Your personal dashboard for managing your real estate activities on Estately.',
};

const dashboardCards = [
  {
    icon: Search,
    title: 'Search Properties',
    description: 'Explore thousands of listings with our advanced search tools.',
    href: '#',
  },
  {
    icon: Heart,
    title: 'Save Favorites',
    description: 'Keep a list of your favorite homes and get instant updates.',
    href: '#',
  },
  {
    icon: Users,
    title: 'Connect with Agents',
    description: 'Find the perfect AI-matched agent to guide you through your journey.',
    href: '/connect-agent',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Deals',
    description: 'Manage offers and close deals with our secure transaction system.',
    href: '#',
  },
  {
    icon: TrendingUp,
    title: 'Smart Investment Insights',
    description: 'Use our AI analytics to identify high-value investment opportunities.',
    href: '#',
  },
  {
    icon: LineChart,
    title: 'Explore Market Trends',
    description: 'Stay informed with up-to-date real estate market data and trends.',
    href: '#',
  },
];

export default function DashboardPage() {
   const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <div className="container py-12 md:py-16">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Welcome to Your Dashboard
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Here's an overview of what you can do on the Estately platform.
        </p>
      </div>

      <motion.div
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
          >
            <Link href={card.href} passHref>
              <Card className="h-full transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 cursor-pointer">
                <CardHeader className="flex flex-col items-center text-center p-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <card.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription className="mt-2 text-center">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
