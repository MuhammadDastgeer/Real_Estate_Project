"use client";

import { useState } from 'react';
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

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  priceRange: z.string().min(1, 'Price range is required'),
  propertyType: z.enum(['House', 'Flat', 'Plot', 'Commercial']),
  area: z.string().min(1, 'Area is required'),
  constructionStatus: z.enum(['Ready to move', 'Under construction']),
});

type FormData = z.infer<typeof formSchema>;

interface AddBuyerFormProps {
    onBack: () => void;
}

export function AddBuyerForm({ onBack }: AddBuyerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      location: '',
      priceRange: '',
      propertyType: 'House',
      area: '',
      constructionStatus: 'Ready to move',
    },
  });

  function onSubmit(data: FormData) {
    setFormData(data);
    setShowPreview(true);
  }

  async function handleFinalSubmit() {
    if (!formData) return;
    setIsLoading(true);
    setShowPreview(false);
    try {
      const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/add_user', formData);
      toast({
        title: "Success!",
        description: "Buyer information submitted successfully.",
      });
      form.reset();
      onBack(); // Go back to the buyer tools view after successful submission
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response?.data?.message || "Could not submit buyer information.",
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
                <CardTitle>Add New Buyer</CardTitle>
                <CardDescription>Enter the buyer's details below.</CardDescription>
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
                 <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (sq ft / marla / kanal)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1200 sq ft" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            defaultValue={field.value}
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
                Preview Details
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Preview Buyer Details</AlertDialogTitle>
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
                <p><strong>Price Range:</strong> {formData.priceRange}</p>
                <p><strong>Property Type:</strong> {formData.propertyType}</p>
                <p><strong>Area:</strong> {formData.area}</p>
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
