"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ListingDetailsDialog } from '@/components/listing-details-dialog';

const pkrPriceRanges = [
  '1,000,000 - 5,000,000',
  '5,000,001 - 10,000,000',
  '10,000,001 - 25,000,000',
  '25,000,001 - 50,000,000',
  '50,000,001+',
];
const usdPriceRanges = [
  '50,000 - 100,000',
  '100,001 - 250,000',
  '250,001 - 500,000',
  '500,001 - 1,000,000',
  '1,000,001+',
];

const propertyTypes = ['House', 'Flat', 'Plot', 'Commercial'];
const constructionStatuses = ['Ready to move', 'Under construction'];
const currencies = ['USD', 'PKR'];
const areaUnits = ['sq ft', 'marla', 'kanal'];


export default function ListingsPage() {
    const [listings, setListings] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [selectedListing, setSelectedListing] = useState<any | null>(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

    const [filters, setFilters] = useState({ location: '', price: '', type: '', area: '', status: '', priceCurrency: '', areaUnit: '' });
    
    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value === 'all' ? '' : value }));
    };

    useEffect(() => {
        setFilters(prev => ({ ...prev, price: '' }));
    }, [filters.priceCurrency]);

    const clearFilters = () => {
        setFilters({ location: '', price: '', type: '', area: '', status: '', priceCurrency: '', areaUnit: '' });
    };
    
    const handleViewDetails = (listing: any) => {
        setSelectedListing(listing);
        setIsDetailsDialogOpen(true);
    };

    const closeDetailsDialog = () => {
        setIsDetailsDialogOpen(false);
        setSelectedListing(null);
    };
    
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/get_seller', {});
                if (response.data && Array.isArray(response.data)) {
                    const sellers = response.data.map(item => item.json || item);
                    setListings(sellers);
                    if (sellers.length === 0) {
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
                setLoading(false);
            }
        };

        fetchListings();
    }, [toast]);
    
    const filteredListings = useMemo(() => {
        if (!listings) return null;
        return listings.filter(seller => {
            const locationMatch = !filters.location || seller.Location_?.toLowerCase().includes(filters.location.toLowerCase());
            const priceString = seller.Price_Range || '';
            const priceMatch = (!filters.price || priceString.includes(filters.price)) &&
                               (!filters.priceCurrency || priceString.toLowerCase().includes(filters.priceCurrency.toLowerCase()));
            const typeMatch = !filters.type || seller.Property_Type === filters.type;
            const areaString = seller.Area || '';
            const areaMatch = (!filters.area || areaString.toLowerCase().includes(filters.area.toLowerCase())) &&
                              (!filters.areaUnit || areaString.toLowerCase().includes(filters.areaUnit.toLowerCase()));
            const statusMatch = !filters.status || seller.Construction_Status === filters.status;
            return locationMatch && priceMatch && typeMatch && areaMatch && statusMatch;
        });
    }, [listings, filters]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.2 },
        },
      };
    
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };

    return (
        <div className="container py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                    Available Properties
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Browse through our curated list of properties from top sellers.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Filter Properties</CardTitle>
                    <CardDescription>Refine your search using the filters below.</CardDescription>
                </CardHeader>
                <CardContent className='border-b pb-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end'>
                        <div className="space-y-2"><Label>Location</Label><Input placeholder="e.g. Multan" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} /></div>
                        <div className="space-y-2">
                            <Label>Price</Label>
                            <div className="flex gap-2">
                                <Select value={filters.price} onValueChange={(value) => handleFilterChange('price', value)}>
                                    <SelectTrigger><SelectValue placeholder="All Prices" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Prices</SelectItem>
                                        {(filters.priceCurrency === 'PKR' ? pkrPriceRanges : usdPriceRanges).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Select value={filters.priceCurrency} onValueChange={(value) => handleFilterChange('priceCurrency', value)}>
                                    <SelectTrigger className="w-[100px]"><SelectValue placeholder="All" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Type</Label>
                            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
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
                                <Input placeholder="e.g. 1200" value={filters.area} onChange={(e) => handleFilterChange('area', e.target.value)} />
                                <Select value={filters.areaUnit} onValueChange={(value) => handleFilterChange('areaUnit', value)}>
                                    <SelectTrigger className="w-[120px]"><SelectValue placeholder="All" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {areaUnits.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Status</Label>
                                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {constructionStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" onClick={clearFilters}><FilterX className="mr-2 h-4 w-4" /> Clear</Button>
                    </div>
                </CardContent>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                                    <CardContent className="space-y-2 pt-4">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredListings && filteredListings.length > 0 ? (
                        <motion.div 
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredListings.map((listing: any, index: number) => {
                                const imageUrl = listing.Image || listing.image;
                                return (
                                    <motion.div key={listing.id || index} variants={itemVariants}>
                                        <Card className="h-full flex flex-col overflow-hidden">
                                            {imageUrl && typeof imageUrl === 'string' && (
                                                <div className="relative aspect-video w-full bg-muted">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={listing.Name || 'Property Image'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader>
                                                <CardTitle className="text-xl">{listing.Name || 'Unnamed Seller'}</CardTitle>
                                                <CardDescription>{listing.Property_Type || 'N/A'}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-1 text-sm flex-grow pt-4">
                                                <p><strong>Location:</strong> {listing.Location_ || 'N/A'}</p>
                                                <p><strong>Price:</strong> {listing.Price_Range || 'N/A'}</p>
                                                <p><strong>Area:</strong> {listing.Area || 'N/A'}</p>
                                                <p><strong>Status:</strong> {listing.Construction_Status || 'N/A'}</p>
                                            </CardContent>
                                            <CardFooter className="mt-auto">
                                                <Button className="w-full" onClick={() => handleViewDetails(listing)}>View Details</Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No listings match your criteria.
                        </div>
                    )}
                </CardContent>
            </Card>

            <ListingDetailsDialog 
                listing={selectedListing}
                isOpen={isDetailsDialogOpen}
                onClose={closeDetailsDialog}
                listingType="Seller"
            />
        </div>
    );
}
