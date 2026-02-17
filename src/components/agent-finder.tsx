"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  prompt: z.string().min(2, "Please describe your needs in more detail."),
});

type FormData = z.infer<typeof formSchema>;

export function AgentFinder() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResults(null);
    try {
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Functionality Disabled",
        description: "The webhook for connecting with an agent has been removed.",
      });
    } catch (error: any) {
      console.error("Error finding agents:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Preferences</CardTitle>
          <CardDescription>Describe what you're looking for in a home and an agent.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Request</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 'I'm looking for a 3-bedroom house in San Francisco with a budget of $1.5M. I need a backyard for my dog.'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect with an Agent"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results && (
        <motion.div
          className="mt-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-center font-headline text-3xl font-bold tracking-tight">
            Response
          </h2>
          <Card className="mt-8">
            <CardContent className="p-6">
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(results, null, 2)}</pre>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
