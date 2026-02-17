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

const formSchema = z.object({
  prompt: z.string().min(1, 'This field is required.'),
});

type FormData = z.infer<typeof formSchema>;

interface AIToolFormProps {
    title: string;
    description: string;
    onBack: () => void;
}

export function AIToolForm({ title, description, onBack }: AIToolFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/Check_Price', data);
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
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your query</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your query here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
