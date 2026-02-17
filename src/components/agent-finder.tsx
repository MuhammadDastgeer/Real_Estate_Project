"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  agentMatchingRecommendation,
  AgentMatchingRecommendationInput,
  AgentMatchingRecommendationOutput,
} from "@/ai/flows/agent-matching-recommendation";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UserCheck, Star, Briefcase } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const formSchema = z.object({
  location: z.string().min(2, "Location is required."),
  propertyType: z.string().min(3, "Property type is required."),
  budget: z.string().min(4, "Budget is required."),
  uniqueRequirements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AgentFinder() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AgentMatchingRecommendationOutput | null>(null);
  const { toast } = useToast();

  const agentImages = [
    PlaceHolderImages.find((img) => img.id === 'agent-1'),
    PlaceHolderImages.find((img) => img.id === 'agent-2'),
    PlaceHolderImages.find((img) => img.id === 'agent-3'),
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      propertyType: "",
      budget: "",
      uniqueRequirements: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResults(null);
    try {
      const response = await agentMatchingRecommendation(data);
      setResults(response);
    } catch (error) {
      console.error("Error finding agents:", error);
      toast({
        title: "Error",
        description: "Failed to find agents. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Preferences</CardTitle>
          <CardDescription>Tell us what you're looking for in a home and an agent.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'San Francisco, CA'" {...field} />
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
                      <FormControl>
                        <Input placeholder="e.g., 'Single-family house'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., '$800,000 - $1,200,000'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uniqueRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unique Requirements (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'Large backyard for a dog, near a good school'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Agents...
                  </>
                ) : (
                  "Find My Perfect Agent"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results && (
        <div
          className="mt-12"
        >
          <h2 className="text-center font-headline text-3xl font-bold tracking-tight">
            Your Recommended Agents
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-1">
            {results.recommendedAgents.map((agent, index) => (
              <Card key={index} className="flex flex-col md:flex-row overflow-hidden shadow-md transition-shadow hover:shadow-xl">
                <div className="flex-shrink-0 p-6 flex items-center justify-center">
                  {agentImages[index] && (
                       <Image
                          src={agentImages[index]?.imageUrl || ''}
                          alt={`Portrait of ${agent.name}`}
                          data-ai-hint={agentImages[index]?.imageHint}
                          width={100}
                          height={100}
                          className="rounded-full object-cover border-4 border-muted"
                      />
                  )}
                </div>
                <div className="p-6 border-t md:border-t-0 md:border-l flex-grow">
                  <CardTitle className="text-2xl">{agent.name}</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-primary" />
                          <span>{agent.specialization}</span>
                      </div>
                      {agent.experienceYears && (
                           <div className="flex items-center gap-1.5">
                              <Star className="h-4 w-4 text-primary" />
                              <span>{agent.experienceYears} years experience</span>
                          </div>
                      )}
                  </div>
                  <CardDescription className="mt-4 text-base">
                      <strong className="text-foreground flex items-center gap-2 mb-1">
                          <UserCheck className="h-5 w-5 text-primary" /> Why they're a great match:
                      </strong>
                      {agent.whyRecommended}
                  </CardDescription>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2 text-sm">
                       <Button className="w-full sm:w-auto">Contact {agent.name.split(' ')[0]}</Button>
                       <p className="text-muted-foreground text-center sm:text-left self-center">
                          Contact info: {agent.contactInfo}
                       </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
