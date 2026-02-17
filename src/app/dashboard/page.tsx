"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Bot, Building, DollarSign, Home, List, Tag, User, UserPlus, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";


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
    target: 'add-buyer',
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

const addBuyerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  city: z.string().min(1, "City is required"),
  areaSociety: z.string().min(1, "Area/Society is required"),
  priceRange: z.string().min(1, "Price range is required"),
  propertyType: z.enum(["house", "flat", "plot", "commercial"]),
  areaSize: z.coerce.number().min(1, "Area size is required"),
  areaUnit: z.enum(["sqft", "marla", "kanal"]),
  constructionStatus: z.enum(["ready", "under_construction"]),
});

type AddBuyerFormData = z.infer<typeof addBuyerSchema>;

function AddBuyerForm({ onBack }: { onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddBuyerFormData>({
    resolver: zodResolver(addBuyerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      areaSociety: "",
      priceRange: "",
      propertyType: "house",
      areaSize: undefined,
      areaUnit: "sqft",
      constructionStatus: "ready",
    },
  });

  function onSubmit(data: AddBuyerFormData) {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Buyer Added!",
        description: `${data.name} has been successfully added to your client list.`,
      });
      form.reset();
    }, 1000);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Buyer Tools
        </Button>
        <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Buyer</CardTitle>
          <CardDescription>
            Fill in the details below to add a new buyer to your client list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Range</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $500,000 - $700,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="areaSociety"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Area / Society</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Pacific Heights" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-lg font-medium">Property Details</h3>
                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a property type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="flat">Flat</SelectItem>
                                <SelectItem value="plot">Plot</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    
                    <div className="grid grid-cols-2 gap-4">
                         <FormField
                            control={form.control}
                            name="areaSize"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Area Size</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="10" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="areaUnit"
                            render={({ field }) => (
                                <FormItem className="self-end">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="sqft">sq ft</SelectItem>
                                    <SelectItem value="marla">marla</SelectItem>
                                    <SelectItem value="kanal">kanal</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                 </div>
              </div>
              
              <FormField
                control={form.control}
                name="constructionStatus"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Construction Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="ready" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Ready to move
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="under_construction" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Under construction
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Buyer
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'buyer' | 'seller' | 'add-buyer'>('dashboard');
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
  
  const viewportConfig = { once: false, amount: 0.3 };

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
      case 'add-buyer':
        return <AddBuyerForm onBack={() => setActiveView('buyer')} />;
      case 'buyer':
        return (
          <>
            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                <Button variant="ghost" onClick={() => setActiveView('dashboard')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                    Buyer Tools
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Everything you need to assist your buyers effectively.
                </p>
            </motion.div>
            <motion.div
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
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
                            <Button onClick={() => setActiveView(card.target as any)} className="w-full">
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
              whileInView="visible"
              viewport={viewportConfig}
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
                whileInView="visible"
                viewport={viewportConfig}
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
              whileInView="visible"
              viewport={viewportConfig}
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
