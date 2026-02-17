"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, TrendingUp, ShieldCheck } from "lucide-react";

const featuresData = [
  {
    icon: UserCheck,
    title: "AI-Powered Agent Matching",
    description: "Our intelligent system analyzes your unique needs to connect you with the perfect real estate professional.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Market Insights",
    description: "Access comprehensive market trends and analytics to make informed investment decisions.",
  },
  {
    icon: ShieldCheck,
    title: "Seamless & Secure Platform",
    description: "Navigate the buying and selling process with confidence through our streamlined and secure platform.",
  },
];

export default function Features() {
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
    <section id="features" className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Estately?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We've built a platform designed to empower you at every step of your real estate journey.
          </p>
        </div>
        <motion.div 
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
            >
              <Card className="h-full text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
