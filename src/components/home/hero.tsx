"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-background");

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover -z-10"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <div className="container px-4">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Find Your Future Home, Intelligently.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-primary-foreground/80 md:text-xl">
            Estately combines cutting-edge AI with expert human guidance to make
            your real estate journey seamless and successful.
          </p>
        </div>
        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/connect-agent">
              Connect with an Agent <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
            <Link href="/dashboard">Explore Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
