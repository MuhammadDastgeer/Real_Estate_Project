"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Target, Users } from 'lucide-react';

const values = [
    {
        icon: Target,
        title: "Our Mission",
        description: "To empower home buyers and sellers with transparent, data-driven tools and expert guidance, making real estate simple and accessible for everyone."
    },
    {
        icon: Star,
        title: "Our Vision",
        description: "To be the most trusted and innovative real estate platform, creating seamless and positive experiences for every client we serve."
    },
    {
        icon: Users,
        title: "Our Team",
        description: "A dedicated group of technologists, designers, and real estate professionals passionate about building the future of property ownership."
    }
]

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-us');

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
    <div className="container py-12 md:py-20">
      <div>
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Revolutionizing Real Estate
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Estately was founded on the principle that buying and selling a home
            should be an exciting and seamless journey, not a stressful one.
          </p>
        </div>
      </div>

      <motion.div
        className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-headline text-3xl font-bold">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            In a market cluttered with outdated practices, we saw an opportunity
            for change. Combining deep industry expertise with the latest
            technology, we've built a platform that puts you, the user, first.
            Our tools provide clarity, our agents provide expertise, and our
            process provides peace of mind.
          </p>
          <p className="mt-4 text-muted-foreground">
            From first-time buyers to seasoned investors, Estately is designed
            to support your unique goals. We're more than just a listing
            service; we're your partner in one of life's most important
            transactions.
          </p>
        </motion.div>
        {aboutImage && (
          <motion.div variants={itemVariants} className="aspect-video overflow-hidden rounded-lg shadow-lg">
            <Image
              src={aboutImage.imageUrl}
              alt={aboutImage.description}
              data-ai-hint={aboutImage.imageHint}
              width={600}
              height={400}
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}
      </motion.div>

       <motion.section 
        className="mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        >
            <div className="text-center">
                <h2 className="font-headline text-3xl font-bold">Our Core Values</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">The principles that guide every decision we make.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                {values.map((value, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="text-center h-full group">
                            <CardContent className="p-6">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                    <value.icon className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
                                </div>
                                <h3 className="text-xl font-semibold">{value.title}</h3>
                                <p className="mt-2 text-muted-foreground">{value.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
       </motion.section>
    </div>
  );
}
