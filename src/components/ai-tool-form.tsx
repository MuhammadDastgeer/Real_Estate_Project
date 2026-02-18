"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Loader2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Schema for single prompt input
const promptSchema = z.object({
  prompt: z.string().min(1, 'This field is required.'),
});

// Schema for Price Based House Prediction & AI Price Suggestion
const priceToolSchema = z.object({
    prompt: z.string().min(1, 'This field is required.'),
    currency: z.enum(['USD', 'PKR']),
});

// Schema for House Basic Price Prediction
const housePriceSchema = z.object({
    area: z.string().min(1, 'Area is required.'),
    areaUnit: z.enum(['sq ft', 'marla', 'kanal']),
    location: z.string().min(1, 'Location is required.'),
});

interface AIToolFormProps {
    title: string;
    description: string;
    onBack: () => void;
}

export function AIToolForm({ title, description, onBack }: AIToolFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const { toast } = useToast();

  const isHousePricePrediction = title === 'House Basic Price Prediction';
  const isPriceTool = title === 'Price Based House Prediction' || title === 'AI Price Suggestion';

  const getFormSchema = () => {
    if (isHousePricePrediction) return housePriceSchema;
    if (isPriceTool) return priceToolSchema;
    return promptSchema;
  }

  const getDefaultValues = () => {
    if (isHousePricePrediction) return { area: '', areaUnit: 'sq ft', location: '' };
    if (isPriceTool) return { prompt: '', currency: 'USD' };
    return { prompt: '' };
  }

  const form = useForm({
    resolver: zodResolver(getFormSchema() as any),
    defaultValues: getDefaultValues(),
  });

  const getPlaceholder = (fieldName?: string) => {
    if (isHousePricePrediction) {
        if (fieldName === 'area') return 'e.g., 1200';
        if (fieldName === 'location') return 'e.g., Anytown, USA';
    }
    switch (title) {
        case 'AI Chatbot Assistant':
            return 'Ask anything about the real estate market...';
        case 'Price Based House Prediction':
            return 'e.g., 800000';
        case 'AI Price Suggestion':
            return 'e.g., 1500';
        default:
            return 'Enter your query here...';
    }
  };

  const getInputType = () => {
    switch (title) {
        case 'Price Based House Prediction':
        case 'AI Price Suggestion':
            return 'number';
        default:
            return 'text';
    }
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      let payload = data;
      if (isHousePricePrediction) {
        const { areaUnit, ...rest } = data;
        payload = {
            ...rest,
            area: `${data.area} ${data.areaUnit}`
        }
      } else if (isPriceTool) {
        const { currency, ...rest } = data;
        payload = {
            ...rest,
            prompt: `${data.prompt} ${data.currency}`
        }
      }

      const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/Check_Price', payload);
      setResult(response.data);
      toast({
        title: "Success!",
        description: "Received a response from the AI assistant.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response?.data?.message || "Could not get a response.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center gap-4'>
            <Button variant="ghost" size="icon" onClick={onBack} disabled={isLoading}>
                <ArrowLeft />
            </Button>
            <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {isHousePricePrediction ? (
                <>
                  <div className="space-y-2">
                    <Label>Area</Label>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormControl>
                              <Input type="number" placeholder={getPlaceholder('area')} {...field} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (City, Area, Society)</FormLabel>
                        <FormControl>
                          <Input placeholder={getPlaceholder('location')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : isPriceTool ? (
                <div className="space-y-2">
                    <Label>Your query</Label>
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                    <Input placeholder={getPlaceholder()} type={getInputType()} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              ) : (
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your query</FormLabel>
                      <FormControl>
                        <Input placeholder={getPlaceholder()} type={getInputType()} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get AI Response
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="mt-6 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {result && (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>AI Assistant Response</CardTitle>
                </CardHeader>
                <CardContent>
                    {result?.output && typeof result.output === 'string' ? (
                        <p>{result.output}</p>
                    ) : (
                        <pre className="whitespace-pre-wrap break-all bg-muted p-4 rounded-md">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    )}
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </>
  );
}
