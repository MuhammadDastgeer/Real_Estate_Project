"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import axios from "axios";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const formSchema = z.object({
  prompt: z.string().min(1, "Please describe your needs."),
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
      const response = await axios.post(
        "https://n8n-7k47.onrender.com/webhook-test/chatbot",
        data
      );
      setResults(response.data);
      toast({
        title: "We found some agents for you!",
      });
    } catch (error: any) {
      console.error("Error finding agents:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
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
                Recommended Agents
            </h2>
          
            {results?.recommendedAgents && Array.isArray(results.recommendedAgents) ? (
                <motion.div 
                    className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                >
                    {results.recommendedAgents.map((agent: any, index: number) => {
                        const agentImage = PlaceHolderImages.find((img) => img.id === `agent-${index + 1}`);
                        return (
                            <motion.div key={index} variants={itemVariants}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader className="flex-row items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            {agentImage ? (
                                                <AvatarImage src={agentImage.imageUrl} alt={agent.name} />
                                            ) : null }
                                            <AvatarFallback>
                                                <User className="h-8 w-8" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle>{agent.name}</CardTitle>
                                            {agent.specialization && (
                                                <CardDescription>{agent.specialization}</CardDescription>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 flex-grow">
                                        {agent.experienceYears && (
                                            <p className="text-sm">
                                                <strong>Experience:</strong> {agent.experienceYears} years
                                            </p>
                                        )}
                                        {agent.contactInfo && (
                                            <p className="text-sm">
                                                <strong>Contact:</strong> {agent.contactInfo}
                                            </p>
                                        )}
                                        {agent.whyRecommended && (
                                            <div>
                                                <h4 className="font-semibold text-sm">Why we recommend them:</h4>
                                                <p className="text-sm text-muted-foreground">{agent.whyRecommended}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            ) : (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Response</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <pre className="whitespace-pre-wrap break-all">{JSON.stringify(results, null, 2)}</pre>
                    </CardContent>
                </Card>
            )}
        </motion.div>
      )}
    </div>
  );
}
