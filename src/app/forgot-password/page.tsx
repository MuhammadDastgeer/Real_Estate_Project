"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { useToast } from "@/hooks/use-toast";

// Schemas
const emailSchema = z.object({
    email: z.string().email('Invalid email address'),
});
type EmailFormData = z.infer<typeof emailSchema>;

const codeSchema = z.object({
    code: z.string().min(4, 'Verification code is required.'),
});
type CodeFormData = z.infer<typeof codeSchema>;

const passwordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'enter-email' | 'enter-code' | 'reset-password'>('enter-email');
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Forms
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  // Submit handlers
  async function onEmailSubmit(data: EmailFormData) {
    setIsLoading(true);
    try {
      const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/forgot-password', data);
      toast({
        description: response.data?.message || JSON.stringify(response.data, null, 2),
      });
      setUserEmail(data.email);
      setStep('enter-code');
      emailForm.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || (error.response?.data && JSON.stringify(error.response.data, null, 2)) || error.message || "An unexpected error occurred.",
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
            description: response.data?.message || JSON.stringify(response.data, null, 2),
        });
        setStep('reset-password');
        codeForm.reset();
    } catch (error: any) {
        toast({
            variant: "destructive",
            description: error.response?.data?.message || (error.response?.data && JSON.stringify(error.response.data, null, 2)) || error.message || "An unexpected error occurred.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormData) {
    setIsLoading(true);
    try {
        const response = await axios.post('https://n8n-7k47.onrender.com/webhook-test/reset-password', {
            email: userEmail,
            password: data.password,
        });
        toast({
            description: response.data?.message || JSON.stringify(response.data, null, 2),
        });
        router.push('/login');
    } catch (error: any) {
        toast({
            variant: "destructive",
            description: error.response?.data?.message || (error.response?.data && JSON.stringify(error.response.data, null, 2)) || error.message || "An unexpected error occurred.",
        });
    } finally {
        setIsLoading(false);
    }
  }
  
  const getTitle = () => {
    switch (step) {
      case 'enter-code':
        return 'Enter Verification Code';
      case 'reset-password':
        return 'Reset Your Password';
      case 'enter-email':
      default:
        return 'Forgot Your Password?';
    }
  };

  const getDescription = () => {
     switch (step) {
      case 'enter-code':
        return `A code has been sent to ${userEmail}. Please enter it below.`;
      case 'reset-password':
        return 'Please enter your new password.';
      case 'enter-email':
      default:
        return "Enter your email address and we'll send you a code to reset your password.";
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
            <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'enter-email' && (
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
                    Add Email
                  </Button>
                </form>
              </Form>
            )}
            {step === 'enter-code' && (
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
             {step === 'reset-password' && (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="********"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="********"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset Password
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
