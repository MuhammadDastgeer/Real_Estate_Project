"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const storage = getStorage();

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
  image: z.any().optional(),
});

interface ProcessedFormData extends Omit<z.infer<typeof formSchema>, 'image'> {
    image?: File;
    imageDataUrl?: string;
}

interface EditListingFormProps {
    listing: any;
    onBack: () => void;
    onEditSuccess: (updatedListing: any) => void;
}

export function EditListingForm({ listing, onBack, onEditSuccess }: EditListingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<ProcessedFormData | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
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
      const imageUrl = listing.image || listing.Image;

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
        image: imageUrl || undefined,
      });
    }
  }, [listing, form]);

  const priceCurrency = form.watch('priceCurrency');
  const priceRanges = priceCurrency === 'USD' ? usdPriceRanges : pkrPriceRanges;
  const currentImageFile = form.watch('image');

  const existingImageUrl = listing.image || listing.Image;
  const [previewImage, setPreviewImage] = useState<string | null>(existingImageUrl || null);

  useEffect(() => {
    if (currentImageFile && typeof currentImageFile !== 'string' && currentImageFile.length > 0) {
      const file = currentImageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (typeof currentImageFile === 'string') {
        setPreviewImage(currentImageFile);
    } else if (!currentImageFile) {
        setPreviewImage(existingImageUrl || null)
    }
  }, [currentImageFile, existingImageUrl]);


  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'priceCurrency') {
        form.setValue('priceRange', '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    let imageFile: File | undefined = undefined;
    let imageDataUrl: string | undefined = existingImageUrl;

    if (data.image && typeof data.image !== 'string' && data.image.length > 0) {
        const file = data.image[0];
        if (file.size > 5 * 1024 * 1024) {
            form.setError('image', { type: 'manual', message: 'Image size cannot exceed 5MB.' });
            return;
        }
        imageFile = file;
        imageDataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    setFormData({ ...data, image: imageFile, imageDataUrl });
    setShowPreview(true);
  }

  async function handleFinalSubmit() {
    if (!formData) return;
    setIsLoading(true);
    setShowPreview(false);
    try {
      let imageUrl = existingImageUrl || ''; // Keep old image URL if no new one

      // if new image is uploaded and firebase is configured
      if (firebaseConfig.projectId !== "your-project-id" && formData.image instanceof File) {
          const newFile = formData.image;

          // Delete old image from storage if it exists
          if (existingImageUrl) {
              try {
                  const oldImageRef = ref(storage, existingImageUrl);
                  await deleteObject(oldImageRef);
              } catch(e: any) {
                  if (e.code !== 'storage/object-not-found') {
                    console.warn("Could not delete old image from storage", e);
                  }
              }
          }

          // Upload new image
          const newImageRef = ref(storage, `seller-images/${Date.now()}_${newFile.name}`);
          await uploadBytes(newImageRef, newFile);
          imageUrl = await getDownloadURL(newImageRef);
      }

      const { image, imageDataUrl, ...rest } = formData;
      const postData = {
        ...rest,
        priceRange: `${formData.priceRange} ${formData.priceCurrency}`,
        area: `${formData.area} ${formData.areaUnit}`,
        image: imageUrl,
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
        image: imageUrl,
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
                <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                          <FormLabel>Property Image (leave blank to keep existing)</FormLabel>
                           {previewImage && (
                              <div className="mt-2">
                                  <Image src={previewImage} alt="Current property image" width={200} height={150} className="rounded-md object-cover" />
                              </div>
                          )}
                          <FormControl>
                            <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => onChange(e.target.files)}
                                {...rest}
                                className="mt-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
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
            <div className="space-y-4 text-sm text-muted-foreground">
                {formData.imageDataUrl && (
                    <div className="aspect-video relative w-full overflow-hidden rounded-lg bg-muted border">
                        <Image src={formData.imageDataUrl} alt="Property preview" fill className="object-cover" />
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                    <p><strong>Location:</strong> {formData.location}</p>
                    <p><strong>Price Range:</strong> {formData.priceRange} {formData.priceCurrency}</p>
                    <p><strong>Property Type:</strong> {formData.propertyType}</p>
                    <p><strong>Area:</strong> {formData.area} {formData.areaUnit}</p>
                    <p><strong>Status:</strong> {formData.constructionStatus}</p>
                </div>
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
