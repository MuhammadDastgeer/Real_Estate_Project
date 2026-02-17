"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

export default function AddBuyerPage() {
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
    // Here you would typically send the data to your backend
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
    <div className="container py-12 md:py-16">
       <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
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
    </div>
  );
}
