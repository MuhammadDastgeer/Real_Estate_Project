import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404: Page Not Found',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <TriangleAlert className="h-16 w-16 text-primary" />
      <h1 className="mt-8 font-headline text-4xl font-bold tracking-tight sm:text-5xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Oops! The page you're looking for doesn't seem to exist. It might have
        been moved or deleted.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}
