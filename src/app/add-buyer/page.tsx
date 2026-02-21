"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddBuyerForm } from '@/components/add-buyer-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
    name: string;
    email: string;
}

export default function AddBuyerPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const authDataString = localStorage.getItem('auth');
        if (authDataString) {
            try {
                const authData = JSON.parse(authDataString);
                if (authData.expiry && authData.expiry > Date.now()) {
                    setUser(authData.user);
                } else {
                    localStorage.removeItem('auth');
                    router.push('/login');
                }
            } catch (e) {
                console.error("Failed to parse auth data from localStorage", e);
                router.push('/login');
            }
        } else {
            router.push('/login');
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="container py-12 md:py-20">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                             <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
         return (
            <div className="text-center container py-12 md:py-16">
                <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                Please log in to add a buyer.
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                You need to be logged in to access this page.
                </p>
                <Button asChild className="mt-4">
                <Link href="/login">Login</Link>
                </Button>
            </div>
        );
    }
    
    return (
        <div className="container py-12 md:py-20 max-w-4xl mx-auto">
             <AddBuyerForm onBack={() => router.push('/dashboard')} />
        </div>
    )
}
