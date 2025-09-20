
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Using a dummy password for Firebase auth since the user wants a passwordless UI
    const dummyPassword = "default-password-for-all-users"; 
    try {
      await signInWithEmailAndPassword(auth, email, dummyPassword);
      router.push("/dashboard");
    } catch (error: any) {
      // If user does not exist, create a new account
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
            await createUserWithEmailAndPassword(auth, email, dummyPassword);
            router.push("/dashboard");
        } catch (signupError: any) {
            toast({
                title: "Authentication Failed",
                description: "Could not sign in or create an account. Please try again.",
                variant: "destructive",
            });
        }
      } else {
         toast({
            title: "Login Failed",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
        });
      }
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="flex justify-center items-center mb-4">
            <Logo />
          </Link>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Log in to your Artisan Hub account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
