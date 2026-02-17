"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Cta() {
  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div>
        <Card className="bg-primary text-primary-foreground text-center shadow-2xl overflow-hidden">
            <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-90"></div>
                 <div className="relative p-8 sm:p-12">
                    <CardHeader className="p-0">
                        <CardTitle className="text-3xl sm:text-4xl font-headline text-white">Ready to Begin Your Search?</CardTitle>
                        <CardDescription className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
                            Create an account today and take the first step towards finding your dream home with the power of AI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 mt-8">
                        <Button asChild size="lg" variant="secondary">
                            <Link href="/signup">Get Started Now</Link>
                        </Button>
                    </CardContent>
                </div>
            </div>
        </Card>
        </div>
      </div>
    </section>
  );
}
