"use client";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const steps = [
    {
        step: 1,
        title: "Tell Us Your Dream",
        description: "Start by providing your preferences through our intuitive form. Let our AI understand exactly what you're looking for."
    },
    {
        step: 2,
        title: "Meet Your Matched Agent",
        description: "We instantly connect you with a top-rated agent whose expertise aligns perfectly with your criteria."
    },
    {
        step: 3,
        title: "Explore with an Expert",
        description: "Your agent will guide you through curated listings and viewings, providing invaluable insights along the way."
    },
    {
        step: 4,
        title: "Close with Confidence",
        description: "From offer to closing, our platform and your agent ensure a smooth, transparent, and secure transaction."
    }
]

export default function HowItWorks() {
    return (
        <section className="py-20 sm:py-32 bg-card">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                        Your Journey, Simplified
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A clear, four-step path to finding and securing your new home.
                    </p>
                </div>

                <div className="relative mt-16 max-w-4xl mx-auto">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block"></div>
                    
                    {steps.map((step, index) => (
                        <div
                            key={step.step}
                            className={cn(
                                "relative flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0",
                                index % 2 !== 0 && "md:flex-row-reverse"
                            )}
                        >
                            <div className="flex-1">
                                <Badge variant="secondary" className="mb-2">Step {step.step}</Badge>
                                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl flex-shrink-0 z-10">
                                {step.step}
                            </div>
                            <div className="flex-1 hidden md:block"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
