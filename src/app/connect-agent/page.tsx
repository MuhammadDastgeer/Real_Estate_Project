import { AgentFinder } from "@/components/agent-finder";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Connect with an Agent - Estately',
    description: 'Describe your needs and we will connect you with the perfect real estate agent.',
};

export default function ConnectAgentPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                    Find Your Perfect Agent
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Describe what you're looking for, and we'll connect you with top agents who fit your criteria.
                </p>
            </div>
            <AgentFinder />
        </div>
    );
}
