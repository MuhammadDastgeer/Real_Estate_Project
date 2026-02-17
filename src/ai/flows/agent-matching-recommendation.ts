'use server';
/**
 * @fileOverview An AI agent matching service for homebuyers.
 *
 * - agentMatchingRecommendation - A function that handles the process of recommending real estate agents.
 * - AgentMatchingRecommendationInput - The input type for the agentMatchingRecommendation function.
 * - AgentMatchingRecommendationOutput - The return type for the agentMatchingRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AgentMatchingRecommendationInputSchema = z.object({
  location: z
    .string()
    .describe('The desired geographic location for the property (e.g., city, neighborhood, state).'),
  propertyType: z
    .string()
    .describe('The type of property the user is looking for (e.g., single-family house, condo, townhouse, commercial).'),
  budget: z
    .string()
    .describe('The approximate budget or price range for the property (e.g., "$500,000 - $700,000", "up to $1.2M").'),
  uniqueRequirements: z
    .string()
    .describe('Any specific or unique requirements for the property (e.g., "must have a large backyard", "close to good schools", "oceanfront view", "historic district").')
    .optional(),
});
export type AgentMatchingRecommendationInput = z.infer<typeof AgentMatchingRecommendationInputSchema>;

const AgentMatchingRecommendationOutputSchema = z.object({
  recommendedAgents: z
    .array(
      z.object({
        name: z.string().describe("The recommended agent's full name."),
        specialization:
          z.string().describe("The agent's area of specialization (e.g., Luxury homes, First-time buyers, Commercial)."),
        experienceYears:
          z.number().describe("The agent's years of experience in real estate.").optional(),
        contactInfo: z
          .string()
          .describe("Dummy contact information for the agent (e.g., email@example.com, phone: 555-123-4567)."),
        whyRecommended:
          z.string().describe("A brief explanation of why this agent is an optimal match for the user's criteria."),
      })
    )
    .describe('A list of highly recommended real estate agents.'),
});
export type AgentMatchingRecommendationOutput = z.infer<typeof AgentMatchingRecommendationOutputSchema>;

export async function agentMatchingRecommendation(
  input: AgentMatchingRecommendationInput
): Promise<AgentMatchingRecommendationOutput> {
  return agentMatchingRecommendationFlow(input);
}

const agentMatchingRecommendationPrompt = ai.definePrompt({
  name: 'agentMatchingRecommendationPrompt',
  input: { schema: AgentMatchingRecommendationInputSchema },
  output: { schema: AgentMatchingRecommendationOutputSchema },
  prompt: `You are an AI assistant specialized in matching homebuyers with the best real estate agents. Your goal is to analyze the user's housing preferences and needs, and then recommend up to 3 highly suitable real estate agents. For each recommended agent, provide their name, specialization, approximate years of experience, dummy contact information, and a clear explanation of why they are an optimal match for the given criteria.

User Housing Preferences and Needs:
Location: {{{location}}}
Property Type: {{{propertyType}}}
Budget: {{{budget}}}
{{#if uniqueRequirements}}Unique Requirements: {{{uniqueRequirements}}}{{/if}}

Based on these preferences, provide a list of recommended agents. Ensure the information is well-structured and relevant to the user's input.
`,
});

const agentMatchingRecommendationFlow = ai.defineFlow(
  {
    name: 'agentMatchingRecommendationFlow',
    inputSchema: AgentMatchingRecommendationInputSchema,
    outputSchema: AgentMatchingRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await agentMatchingRecommendationPrompt(input);
    return output!;
  }
);
