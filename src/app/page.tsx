import { Metadata } from 'next';
import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import HowItWorks from '@/components/home/how-it-works';
import Cta from '@/components/home/cta';

export const metadata: Metadata = {
  title: 'Estately - Your Modern Real Estate Partner',
  description: 'Find your dream home and connect with expert agents on Estately. We make buying and selling homes a seamless experience.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Cta />
    </>
  );
}
