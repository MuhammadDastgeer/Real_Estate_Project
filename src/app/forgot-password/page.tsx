"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.object({
    email: z.string().email('Invalid email address'),
});
type EmailFormData = z.infer<typeof emailSchema>;

const codeSchema = z.object({
    code: z.string().min(4, 'Verification code is required.'),
});
type CodeFormData = z.infer<typeof codeSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'enter-email' | 'enter-code'>('enter-email');
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
        code: '',
    },
  });

  async function onEmailSubmit(data: EmailFormData) {
    setIsLoading(true);
    try {
      await axios.post('https://n8n-7k47.onrender.com/webhook-test/forgot-password', data);
      toast({
        title: "Request Sent",
        description: "If an account with that email exists, you will receive a password reset code.",
      });
      setUserEmail(data.email);
      setStep('enter-code');
      emailForm.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.response?.data?.message || error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onCodeSubmit(data: CodeFormData) {
    setIsLoading(true);
    try {
        const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/verify-reset-code', {
            email: userEmail,
            code: data.code,
        });
        toast({
            title: "Success",
            description: "Your code has been verified. You may now reset your password.",
        });
        setStep('enter-email');
        codeForm.reset();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Verification Failed",
            description: error.response?.data?.message || error.message || "Invalid code. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div>
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className='flex justify-center mb-4'>
                <Logo />
            </div>
            <CardTitle className="text-2xl font-bold">
                {step === 'enter-email' ? 'Forgot Your Password?' : 'Enter Verification Code'}
            </CardTitle>
            <CardDescription>
                {step === 'enter-email' 
                    ? "Enter your email address and we'll send you a code to reset your password."
                    : `A code has been sent to ${userEmail}. Please enter it below.`
                }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'enter-email' ? (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="grid gap-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Code
                  </Button>
                </form>
              </Form>
            ) : (
                <Form {...codeForm}>
                    <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="grid gap-4">
                        <FormField
                            control={codeForm.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify Code
                        </Button>
                    </form>
                </Form>
            )}
             <div className="mt-4 text-center text-sm">
              Remember your password?{' '}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
