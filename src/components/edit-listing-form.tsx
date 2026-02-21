"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Loader2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

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

const currencies = ['USD', 'PKR'];
const areaUnits = ['sq ft', 'marla', 'kanal'];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  priceRange: z.string().min(1, 'Price range is required'),
  priceCurrency: z.enum(['USD', 'PKR']),
  propertyType: z.enum(['House', 'Flat', 'Plot', 'Commercial']),
  area: z.string().min(1, 'Area is required'),
  areaUnit: z.enum(['sq ft', 'marla', 'kanal']),
  constructionStatus: z.enum(['Ready to move', 'Under construction']),
});

type FormData = z.infer<typeof formSchema>;

interface EditListingFormProps {
    listing: any;
    onBack: () => void;
    onEditSuccess: (updatedListing: any) => void;
}

export function EditListingForm({ listing, onBack, onEditSuccess }: EditListingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (listing) {
      const priceString = listing.Price_Range || '';
      const detectedCurrency = currencies.find(c => priceString.endsWith(c)) || 'USD';
      const priceRangeValue = detectedCurrency ? priceString.replace(new RegExp(` ${detectedCurrency}$`), '').trim() : priceString;
      
      const areaString = listing.Area || '';
      const detectedUnit = areaUnits.find(u => areaString.endsWith(u)) || 'sq ft';
      const areaValueOnly = detectedUnit ? areaString.replace(new RegExp(` ${detectedUnit}$`), '').trim() : areaString;

      form.reset({
        name: listing.Name || '',
        email: listing.Email || '',
        phoneNumber: listing.Phone_Number || '',
        location: listing.Location_ || '',
        priceRange: priceRangeValue,
        priceCurrency: detectedCurrency as 'USD' | 'PKR',
        propertyType: listing.Property_Type || 'House',
        area: areaValueOnly,
        areaUnit: detectedUnit as 'sq ft' | 'marla' | 'kanal',
        constructionStatus: listing.Construction_Status || 'Ready to move',
      });
    }
  }, [listing, form]);

  const priceCurrency = form.watch('priceCurrency');
  const priceRanges = priceCurrency === 'USD' ? usdPriceRanges : pkrPriceRanges;

  useEffect(() => {
    // This effect is to reset priceRange if currency changes, but we should be careful not to erase user's new selection
    const subscription = form.watch((value, { name }) => {
      if (name === 'priceCurrency') {
        form.setValue('priceRange', '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(data: FormData) {
    setFormData(data);
    setShowPreview(true);
  }

  async function handleFinalSubmit() {
    if (!formData) return;
    setIsLoading(true);
    setShowPreview(false);
    try {
      const { priceCurrency, areaUnit, ...rest } = formData;
      const postData = {
        ...rest,
        priceRange: `${formData.priceRange} ${formData.priceCurrency}`,
        area: `${formData.area} ${formData.areaUnit}`,
      };
      const postDataWithId = { ...postData, id: listing.id };

      await axios.post('https://n8n-7k47.onrender.com/webhook-test/card_edit', postDataWithId);
      
      toast({
        title: "Success!",
        description: "Listing updated successfully.",
      });

      const updatedStateObject = {
        ...listing,
        Name: formData.name,
        Email: formData.email,
        Phone_Number: formData.phoneNumber,
        Location_: formData.location,
        Price_Range: `${formData.priceRange} ${formData.priceCurrency}`,
        Property_Type: formData.propertyType,
        Area: `${formData.area} ${formData.areaUnit}`,
        Construction_Status: formData.constructionStatus,
      };

      onEditSuccess(updatedStateObject);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response?.data?.message || "Could not update listing.",
      });
    } finally {
      setIsLoading(false);
      setFormData(null);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center gap-4'>
            <Button variant="ghost" size="icon" onClick={onBack} disabled={isLoading}>
                <ArrowLeft />
            </Button>
            <div>
                <CardTitle>Edit {listing.type} Listing</CardTitle>
                <CardDescription>Update the details for {listing.Name}.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (City, Area, Society)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, Mission District" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                    <Label>Price</Label>
                    <div className="flex gap-2">
                         <FormField
                            control={form.control}
                            name="priceRange"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a price range" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {priceRanges.map((range) => (
                                                <SelectItem key={range} value={range}>{range}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priceCurrency"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="PKR">PKR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Area</Label>
                    <div className="flex gap-2">
                         <FormField
                            control={form.control}
                            name="area"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 1200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="areaUnit"
                            render={({ field }) => (
                                <FormItem>
                                     <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="sq ft">sq ft</SelectItem>
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
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Flat">Flat</SelectItem>
                          <SelectItem value="Plot">Plot</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="constructionStatus"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Construction Status</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Ready to move" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                Ready to move
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Under construction" />
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
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Preview Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Preview Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Please review the information below before submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {formData && (
            <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                <p><strong>Location:</strong> {formData.location}</p>
                <p><strong>Price Range:</strong> {formData.priceRange} {formData.priceCurrency}</p>
                <p><strong>Property Type:</strong> {formData.propertyType}</p>
                <p><strong>Area:</strong> {formData.area} {formData.areaUnit}</p>
                <p><strong>Status:</strong> {formData.constructionStatus}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFormData(null)} disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm & Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
