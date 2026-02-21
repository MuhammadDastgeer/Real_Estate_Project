"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Bot, Building, DollarSign, Home, List, Tag, User, UserPlus, ArrowLeft, Sparkles, FilterX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AddBuyerForm } from '@/components/add-buyer-form';
import { AddSellerForm } from '@/components/add-seller-form';
import { AIToolForm } from '@/components/ai-tool-form';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ListingDetailsDialog } from '@/components/listing-details-dialog';


interface User {
    name: string;
    email: string;
}

const usdPriceRanges = [
  '50,000 - 100,000',
  '100,001 - 250,000',
  '250,001 - 500,000',
  '500,001 - 1,000,000',
  '1,000,001+',
];

const pkrPriceRanges = [
  '1,000,000 - 5,000,000',
  '5,000,001 - 10,000,000',
  '10,000,001 - 25,000,000',
  '25,000,001 - 50,000,000',
  '50,000,001+',
];

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
    actionType: 'viewDashboard',
    target: 'buyerListing',
  },
  {
    icon: Building,
    title: 'Seller Listing',
    description: 'View and manage all your seller listings.',
    cta: 'View Listings',
    actionType: 'viewDashboard',
    target: 'sellerListing',
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
    actionType: 'view',
    target: 'exploreBuyerListing',
    cta: 'Explore'
  },
  {
    icon: Bot,
    title: 'AI Chatbot Assistant',
    description: 'Get instant answers and market insights from our AI.',
    actionType: 'assistant',
    target: '#',
    cta: 'Chat Now'
  },
  {
    icon: Building,
    title: 'Price Based House Prediction',
    description: 'Use our AI to predict house prices based on features.',
    actionType: 'assistant',
    target: '#',
    cta: 'Predict Price'
  },
  {
    icon: DollarSign,
    title: 'House Basic Price Prediction',
    description: 'Get a quick valuation for any property.',
    actionType: 'assistant',
    target: '#',
    cta: 'Get Estimate'
  }
];

const sellerTools = [
  {
    icon: UserPlus,
    title: 'Add Seller',
    description: 'Add a new seller and property to your portfolio.',
    actionType: 'view',
    target: 'addSeller',
    cta: 'Add Seller'
  },
  {
    icon: Sparkles,
    title: 'AI Price Suggestion',
    description: 'Get an AI-powered price suggestion for your property.',
    actionType: 'assistant',
    target: '#',
    cta: 'Get Suggestion'
  },
  {
    icon: List,
    title: 'Explore Seller Listing',
    description: 'Manage and view your current seller listings.',
    actionType: 'view',
    target: 'exploreSellerListing',
    cta: 'Explore'
  },
  {
    icon: DollarSign,
    title: 'House Basic Price Prediction',
    description: 'Get a quick valuation for any property.',
    actionType: 'assistant',
    target: '#',
    cta: 'Get Estimate'
  },
  {
    icon: Bot,
    title: 'AI Chatbot Assistant',
    description: 'Get instant answers and market insights from our AI.',
    actionType: 'assistant',
    target: '#',
    cta: 'Chat Now'
  }
];

const propertyTypes = ['House', 'Flat', 'Plot', 'Commercial'];
const constructionStatuses = ['Ready to move', 'Under construction'];
const currencies = ['USD', 'PKR'];
const areaUnits = ['sq ft', 'marla', 'kanal'];


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'buyer' | 'seller'>('dashboard');
  const [dashboardView, setDashboardView] = useState<'default' | 'buyerListing' | 'sellerListing'>('default');
  const [buyerToolView, setBuyerToolView] = useState<'default' | 'addBuyer' | 'assistant' | 'exploreBuyerListing'>('default');
  const [sellerToolView, setSellerToolView] = useState<'default' | 'addSeller' | 'assistant' | 'exploreSellerListing'>('default');
  const [activeAssistant, setActiveAssistant] = useState<{ title: string; description: string; cta: string; } | null>(null);
  const [listings, setListings] = useState<any[] | null>(null);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [sellerListings, setSellerListings] = useState<any[] | null>(null);
  const [sellerListingsLoading, setSellerListingsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [listingType, setListingType] = useState<'Buyer' | 'Seller'>('Buyer');

  const [buyerFilters, setBuyerFilters] = useState({ location: '', price: '', type: '', area: '', status: '', priceCurrency: '', areaUnit: '' });
  const [sellerFilters, setSellerFilters] = useState({ location: '', price: '', type: '', area: '', status: '', priceCurrency: '', areaUnit: '' });

  const handleViewDetails = (listing: any, type: 'Buyer' | 'Seller') => {
    setSelectedListing(listing);
    setListingType(type);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedListing(null);
  };

  const handleBuyerFilterChange = (filterName: string, value: string) => {
    setBuyerFilters(prev => ({ ...prev, [filterName]: value === 'all' ? '' : value }));
  };

  useEffect(() => {
    setBuyerFilters(prev => ({ ...prev, price: '' }));
  }, [buyerFilters.priceCurrency]);
  
  useEffect(() => {
    setSellerFilters(prev => ({ ...prev, price: '' }));
  }, [sellerFilters.priceCurrency]);

  const clearBuyerFilters = () => {
    setBuyerFilters({ location: '', price: '', type: '', area: '', status: '', priceCurrency: '', areaUnit: '' });
  };
  
  const handleSellerFilterChange = (filterName: string, value: string) => {
    setSellerFilters(prev => ({ ...prev, [filterName]: value === 'all' ? '' : value }));
  };

  const clearSellerFilters = () => {
    setSellerFilters({ location: '', price: '', type: '', area: '', status: '', priceCurrency: '', areaUnit: '' });
  };


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

  useEffect(() => {
    if (buyerToolView !== 'exploreBuyerListing') return;

    const fetchListings = async () => {
      setListingsLoading(true);
      setListings(null);
      try {
        const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/get_buyer', {});
        
        if (response.data && Array.isArray(response.data)) {
          const buyers = response.data.map(item => item.json || item);
          setListings(buyers);
          if (buyers.length > 0) {
            toast({ title: "All listings loaded" });
          } else {
            toast({ title: "No listings found" });
          }
        } else {
          setListings([]);
          toast({
            title: "Unexpected format",
            description: "Could not parse listings from the server.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        setListings([]);
        toast({
          variant: "destructive",
          title: "Failed to fetch listings",
          description: error.response?.data?.message || "An error occurred.",
        });
      } finally {
        setListingsLoading(false);
      }
    };

    fetchListings();
  }, [buyerToolView, toast]);
  
  useEffect(() => {
    if (sellerToolView !== 'exploreSellerListing') return;

    const fetchSellerListings = async () => {
      setSellerListingsLoading(true);
      setSellerListings(null);
      try {
        const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/get_seller', {});
        
        if (response.data && Array.isArray(response.data)) {
          const sellers = response.data.map(item => item.json || item);
          setSellerListings(sellers);
          if (sellers.length > 0) {
            toast({ title: "All seller listings loaded" });
          } else {
            toast({ title: "No seller listings found" });
          }
        } else {
          setSellerListings([]);
          toast({
            title: "Unexpected format",
            description: "Could not parse seller listings from the server.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        setSellerListings([]);
        toast({
          variant: "destructive",
          title: "Failed to fetch seller listings",
          description: error.response?.data?.message || "An error occurred.",
        });
      } finally {
        setSellerListingsLoading(false);
      }
    };

    fetchSellerListings();
  }, [sellerToolView, toast]);

  useEffect(() => {
    if (dashboardView !== 'buyerListing') {
      if(listings) setListings(null);
      return;
    }

    const fetchListings = async () => {
        setListingsLoading(true);
        setListings(null);
        try {
            const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/get_buyer', {});
            
            if (response.data && Array.isArray(response.data)) {
                const buyers = response.data.map(item => item.json || item);
                setListings(buyers);
                if (buyers.length > 0) {
                  toast({ title: "All listings loaded" });
                } else {
                  toast({ title: "No listings found" });
                }
            } else {
                setListings([]);
                toast({
                    title: "Unexpected format",
                    description: "Could not parse listings from the server.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            setListings([]);
            toast({
                variant: "destructive",
                title: "Failed to fetch listings",
                description: error.response?.data?.message || "An error occurred.",
            });
        } finally {
            setListingsLoading(false);
        }
    };

    fetchListings();
}, [dashboardView, toast]);

useEffect(() => {
    if (dashboardView !== 'sellerListing') {
        if(sellerListings) setSellerListings(null);
        return;
    }

    const fetchSellerListings = async () => {
        setSellerListingsLoading(true);
        setSellerListings(null);
        try {
            const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/get_seller', {});
            
            if (response.data && Array.isArray(response.data)) {
                const sellers = response.data.map(item => item.json || item);
                setSellerListings(sellers);
                if (sellers.length > 0) {
                  toast({ title: "All seller listings loaded" });
                } else {
                  toast({ title: "No seller listings found" });
                }
            } else {
                setSellerListings([]);
                toast({
                    title: "Unexpected format",
                    description: "Could not parse seller listings from the server.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            setSellerListings([]);
            toast({
                variant: "destructive",
                title: "Failed to fetch seller listings",
                description: error.response?.data?.message || "An error occurred.",
            });
        } finally {
            setSellerListingsLoading(false);
        }
    };

    fetchSellerListings();
}, [dashboardView, toast]);

const filteredBuyerListings = useMemo(() => {
    if (!listings) return null;
    return listings.filter(buyer => {
        const locationMatch = !buyerFilters.location || buyer.Location_?.toLowerCase().includes(buyerFilters.location.toLowerCase());
        
        const priceString = buyer.Price_Range || '';
        const priceMatch = (!buyerFilters.price || priceString.includes(buyerFilters.price)) && 
                           (!buyerFilters.priceCurrency || priceString.toLowerCase().includes(buyerFilters.priceCurrency.toLowerCase()));

        const typeMatch = !buyerFilters.type || buyer.Property_Type === buyerFilters.type;
        
        const areaString = buyer.Area || '';
        const areaMatch = (!buyerFilters.area || areaString.toLowerCase().includes(buyerFilters.area.toLowerCase())) &&
                          (!buyerFilters.areaUnit || areaString.toLowerCase().includes(buyerFilters.areaUnit.toLowerCase()));

        const statusMatch = !buyerFilters.status || buyer.Construction_Status === buyerFilters.status;
        return locationMatch && priceMatch && typeMatch && areaMatch && statusMatch;
    });
}, [listings, buyerFilters]);

const filteredSellerListings = useMemo(() => {
    if (!sellerListings) return null;
    return sellerListings.filter(seller => {
        const locationMatch = !sellerFilters.location || seller.Location_?.toLowerCase().includes(sellerFilters.location.toLowerCase());
        
        const priceString = seller.Price_Range || '';
        const priceMatch = (!sellerFilters.price || priceString.includes(sellerFilters.price)) &&
                           (!sellerFilters.priceCurrency || priceString.toLowerCase().includes(sellerFilters.priceCurrency.toLowerCase()));

        const typeMatch = !sellerFilters.type || seller.Property_Type === sellerFilters.type;

        const areaString = seller.Area || '';
        const areaMatch = (!sellerFilters.area || areaString.toLowerCase().includes(sellerFilters.area.toLowerCase())) &&
                          (!sellerFilters.areaUnit || areaString.toLowerCase().includes(sellerFilters.areaUnit.toLowerCase()));

        const statusMatch = !sellerFilters.status || seller.Construction_Status === sellerFilters.status;
        return locationMatch && priceMatch && typeMatch && areaMatch && statusMatch;
    });
}, [sellerListings, sellerFilters]);


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
                        ) : card.actionType === 'assistant' ? (
                            <Button onClick={() => {
                                setActiveAssistant(card as any);
                                setBuyerToolView('assistant');
                            }} className="w-full">
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
            ) : buyerToolView === 'exploreBuyerListing' ? (
              <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mt-8">
                  <Card>
                      <CardHeader>
                          <div className='flex items-center gap-4'>
                              <Button variant="ghost" size="icon" onClick={() => setBuyerToolView('default')} disabled={listingsLoading}>
                                  <ArrowLeft />
                              </Button>
                              <div>
                                  <CardTitle>Explore Buyer Listings</CardTitle>
                                  <CardDescription>A list of all potential buyers.</CardDescription>
                              </div>
                          </div>
                      </CardHeader>
                      <CardContent>
                          {listingsLoading ? (
                              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                  {[...Array(3)].map((_, i) => (
                                      <Card key={i}>
                                          <CardHeader>
                                              <Skeleton className="h-6 w-3/4" />
                                          </CardHeader>
                                          <CardContent className="space-y-2 pt-4">
                                              <Skeleton className="h-4 w-full" />
                                              <Skeleton className="h-4 w-2/3" />
                                              <Skeleton className="h-4 w-full" />
                                              <Skeleton className="h-4 w-1/2" />
                                          </CardContent>
                                      </Card>
                                  ))}
                              </div>
                          ) : listings && listings.length > 0 ? (
                              <motion.div 
                                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                  variants={containerVariants}
                                  initial="hidden"
                                  animate="visible"
                              >
                                  {listings.map((buyer: any, index: number) => (
                                      <motion.div key={buyer.id || index} variants={itemVariants}>
                                          <Card className="h-full flex flex-col">
                                              <CardHeader>
                                                  <CardTitle className="text-xl">{buyer.Name || 'Unnamed Buyer'}</CardTitle>
                                                  <CardDescription>{buyer.Email || 'No email provided'}</CardDescription>
                                              </CardHeader>
                                              <CardContent className="space-y-1 text-sm flex-grow">
                                                  <p><strong>Phone:</strong> {buyer.Phone_Number || 'N/A'}</p>
                                                  <p><strong>Location:</strong> {buyer.Location_ || 'N/A'}</p>
                                                  <p><strong>Price:</strong> {buyer.Price_Range || 'N/A'}</p>
                                                  <p><strong>Type:</strong> {buyer.Property_Type || 'N/A'}</p>
                                                  <p><strong>Area:</strong> {buyer.Area || 'N/A'}</p>
                                                  <p><strong>Status:</strong> {buyer.Construction_Status || 'N/A'}</p>
                                              </CardContent>
                                              <CardFooter>
                                                <Button className="w-full" onClick={() => handleViewDetails(buyer, 'Buyer')}>View</Button>
                                              </CardFooter>
                                          </Card>
                                      </motion.div>
                                  ))}
                              </motion.div>
                          ) : (
                              <div className="text-center py-12 text-muted-foreground">
                                  No buyer listings found or there was an error loading them.
                              </div>
                          )}
                      </CardContent>
                  </Card>
              </motion.div>
            ) : buyerToolView === 'assistant' && activeAssistant ? (
              <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mt-8">
                <AIToolForm 
                    title={activeAssistant.title}
                    description={activeAssistant.description}
                    onBack={() => {
                        setBuyerToolView('default');
                        setActiveAssistant(null);
                    }}
                />
              </motion.div>
            ) : null}
          </>
        );
      case 'seller':
        return (
          <>
            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                <Button variant="ghost" onClick={() => { setActiveView('dashboard'); setSellerToolView('default'); }} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                { sellerToolView === 'default' && (
                  <>
                    <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                        Seller Tools
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Everything you need to manage your listings and sellers.
                    </p>
                  </>
                )}
            </motion.div>
            {sellerToolView === 'default' ? (
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
                        {card.actionType === 'view' ? (
                            <Button onClick={() => setSellerToolView(card.target as any)} className="w-full">
                                {card.cta}
                            </Button>
                        ) : card.actionType === 'assistant' ? (
                            <Button onClick={() => {
                                setActiveAssistant(card as any);
                                setSellerToolView('assistant');
                            }} className="w-full">
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
            ) : sellerToolView === 'addSeller' ? (
              <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mt-8">
                <AddSellerForm onBack={() => setSellerToolView('default')} />
              </motion.div>
            ) : sellerToolView === 'exploreSellerListing' ? (
                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mt-8">
                    <Card>
                        <CardHeader>
                            <div className='flex items-center gap-4'>
                                <Button variant="ghost" size="icon" onClick={() => setSellerToolView('default')} disabled={sellerListingsLoading}>
                                    <ArrowLeft />
                                </Button>
                                <div>
                                    <CardTitle>Explore Seller Listings</CardTitle>
                                    <CardDescription>A list of all potential sellers.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {sellerListingsLoading ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {[...Array(3)].map((_, i) => (
                                        <Card key={i}>
                                            <CardHeader>
                                                <Skeleton className="h-6 w-3/4" />
                                            </CardHeader>
                                            <CardContent className="space-y-2 pt-4">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-2/3" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : sellerListings && sellerListings.length > 0 ? (
                                <motion.div 
                                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {sellerListings.map((seller: any, index: number) => (
                                        <motion.div key={seller.id || index} variants={itemVariants}>
                                            <Card className="h-full flex flex-col">
                                                <CardHeader>
                                                    <CardTitle className="text-xl">{seller.Name || 'Unnamed Seller'}</CardTitle>
                                                    <CardDescription>{seller.Email || 'No email provided'}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-1 text-sm flex-grow">
                                                    <p><strong>Phone:</strong> {seller.Phone_Number || 'N/A'}</p>
                                                    <p><strong>Location:</strong> {seller.Location_ || 'N/A'}</p>
                                                    <p><strong>Price:</strong> {seller.Price_Range || 'N/A'}</p>
                                                    <p><strong>Type:</strong> {seller.Property_Type || 'N/A'}</p>
                                                    <p><strong>Area:</strong> {seller.Area || 'N/A'}</p>
                                                    <p><strong>Status:</strong> {seller.Construction_Status || 'N/A'}</p>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button className="w-full" onClick={() => handleViewDetails(seller, 'Seller')}>View</Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No seller listings found or there was an error loading them.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            ) : sellerToolView === 'assistant' && activeAssistant ? (
                <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mt-8">
                    <AIToolForm 
                        title={activeAssistant.title}
                        description={activeAssistant.description}
                        onBack={() => {
                            setSellerToolView('default');
                            setActiveAssistant(null);
                        }}
                    />
                </motion.div>
            ) : null}
          </>
        );
      case 'dashboard':
      default:
        if (dashboardView === 'buyerListing') {
            return (
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                    <Button variant="ghost" size="icon" onClick={() => setDashboardView('default')} disabled={listingsLoading}>
                                        <ArrowLeft />
                                    </Button>
                                    <div>
                                        <CardTitle>Buyer Listings</CardTitle>
                                        <CardDescription>A list of all potential buyers.</CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='border-b pb-6'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end'>
                                <div className="space-y-2"><Label>Location</Label><Input placeholder="e.g. Multan" value={buyerFilters.location} onChange={(e) => handleBuyerFilterChange('location', e.target.value)} /></div>
                                <div className="space-y-2">
                                    <Label>Price</Label>
                                    <div className="flex gap-2">
                                         <Select value={buyerFilters.price} onValueChange={(value) => handleBuyerFilterChange('price', value)}>
                                            <SelectTrigger><SelectValue placeholder="All Prices" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Prices</SelectItem>
                                                {(buyerFilters.priceCurrency === 'PKR' ? pkrPriceRanges : usdPriceRanges).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select value={buyerFilters.priceCurrency} onValueChange={(value) => handleBuyerFilterChange('priceCurrency', value)}>
                                            <SelectTrigger className="w-[100px]"><SelectValue placeholder="All" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2"><Label>Type</Label>
                                    <Select value={buyerFilters.type} onValueChange={(value) => handleBuyerFilterChange('type', value)}>
                                        <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Area</Label>
                                    <div className="flex gap-2">
                                        <Input placeholder="e.g. 1200" value={buyerFilters.area} onChange={(e) => handleBuyerFilterChange('area', e.target.value)} />
                                        <Select value={buyerFilters.areaUnit} onValueChange={(value) => handleBuyerFilterChange('areaUnit', value)}>
                                            <SelectTrigger className="w-[120px]"><SelectValue placeholder="All" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {areaUnits.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2"><Label>Status</Label>
                                     <Select value={buyerFilters.status} onValueChange={(value) => handleBuyerFilterChange('status', value)}>
                                        <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {constructionStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button variant="outline" onClick={clearBuyerFilters}><FilterX className="mr-2 h-4 w-4" /> Clear</Button>
                            </div>
                        </CardContent>
                        <CardContent>
                            {listingsLoading ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6">
                                    {[...Array(3)].map((_, i) => (
                                        <Card key={i}>
                                            <CardHeader>
                                                <Skeleton className="h-6 w-3/4" />
                                            </CardHeader>
                                            <CardContent className="space-y-2 pt-4">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-2/3" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : filteredBuyerListings && filteredBuyerListings.length > 0 ? (
                                <motion.div 
                                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {filteredBuyerListings.map((buyer: any, index: number) => (
                                        <motion.div key={buyer.id || index} variants={itemVariants}>
                                            <Card className="h-full flex flex-col">
                                                <CardHeader>
                                                    <CardTitle className="text-xl">{buyer.Name || 'Unnamed Buyer'}</CardTitle>
                                                    <CardDescription>{buyer.Email || 'No email provided'}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-1 text-sm flex-grow">
                                                    <p><strong>Phone:</strong> {buyer.Phone_Number || 'N/A'}</p>
                                                    <p><strong>Location:</strong> {buyer.Location_ || 'N/A'}</p>
                                                    <p><strong>Price:</strong> {buyer.Price_Range || 'N/A'}</p>
                                                    <p><strong>Type:</strong> {buyer.Property_Type || 'N/A'}</p>
                                                    <p><strong>Area:</strong> {buyer.Area || 'N/A'}</p>
                                                    <p><strong>Status:</strong> {buyer.Construction_Status || 'N/A'}</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No buyer listings match your criteria.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )
        }
        if (dashboardView === 'sellerListing') {
            return (
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                    <Card>
                        <CardHeader>
                            <div className='flex items-center gap-4'>
                                <Button variant="ghost" size="icon" onClick={() => setDashboardView('default')} disabled={sellerListingsLoading}>
                                    <ArrowLeft />
                                </Button>
                                <div>
                                    <CardTitle>Seller Listings</CardTitle>
                                    <CardDescription>A list of all potential sellers.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='border-b pb-6'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end'>
                                <div className="space-y-2"><Label>Location</Label><Input placeholder="e.g. Multan" value={sellerFilters.location} onChange={(e) => handleSellerFilterChange('location', e.target.value)} /></div>
                                <div className="space-y-2">
                                    <Label>Price</Label>
                                    <div className="flex gap-2">
                                        <Select value={sellerFilters.price} onValueChange={(value) => handleSellerFilterChange('price', value)}>
                                            <SelectTrigger><SelectValue placeholder="All Prices" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Prices</SelectItem>
                                                {(sellerFilters.priceCurrency === 'PKR' ? pkrPriceRanges : usdPriceRanges).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select value={sellerFilters.priceCurrency} onValueChange={(value) => handleSellerFilterChange('priceCurrency', value)}>
                                            <SelectTrigger className="w-[100px]"><SelectValue placeholder="All" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2"><Label>Type</Label>
                                    <Select value={sellerFilters.type} onValueChange={(value) => handleSellerFilterChange('type', value)}>
                                        <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Area</Label>
                                    <div className="flex gap-2">
                                        <Input placeholder="e.g. 1200" value={sellerFilters.area} onChange={(e) => handleSellerFilterChange('area', e.target.value)} />
                                        <Select value={sellerFilters.areaUnit} onValueChange={(value) => handleSellerFilterChange('areaUnit', value)}>
                                            <SelectTrigger className="w-[120px]"><SelectValue placeholder="All" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {areaUnits.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2"><Label>Status</Label>
                                     <Select value={sellerFilters.status} onValueChange={(value) => handleSellerFilterChange('status', value)}>
                                        <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {constructionStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button variant="outline" onClick={clearSellerFilters}><FilterX className="mr-2 h-4 w-4" /> Clear</Button>
                            </div>
                        </CardContent>
                        <CardContent>
                            {sellerListingsLoading ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6">
                                    {[...Array(3)].map((_, i) => (
                                        <Card key={i}>
                                            <CardHeader>
                                                <Skeleton className="h-6 w-3/4" />
                                            </CardHeader>
                                            <CardContent className="space-y-2 pt-4">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-2/3" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : filteredSellerListings && filteredSellerListings.length > 0 ? (
                                <motion.div 
                                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {filteredSellerListings.map((seller: any, index: number) => (
                                        <motion.div key={seller.id || index} variants={itemVariants}>
                                            <Card className="h-full flex flex-col">
                                                <CardHeader>
                                                    <CardTitle className="text-xl">{seller.Name || 'Unnamed Seller'}</CardTitle>
                                                    <CardDescription>{seller.Email || 'No email provided'}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-1 text-sm flex-grow">
                                                    <p><strong>Phone:</strong> {seller.Phone_Number || 'N/A'}</p>
                                                    <p><strong>Location:</strong> {seller.Location_ || 'N/A'}</p>
                                                    <p><strong>Price:</strong> {seller.Price_Range || 'N/A'}</p>
                                                    <p><strong>Type:</strong> {seller.Property_Type || 'N/A'}</p>
                                                    <p><strong>Area:</strong> {seller.Area || 'N/A'}</p>
                                                    <p><strong>Status:</strong> {seller.Construction_Status || 'N/A'}</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No seller listings match your criteria.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )
        }
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
                        ) : card.actionType === 'viewDashboard' ? (
                            <Button onClick={() => setDashboardView(card.target as 'buyerListing' | 'sellerListing')} className="w-full">
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
      <ListingDetailsDialog 
        listing={selectedListing}
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        listingType={listingType}
      />
    </div>
  );
}
