
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useToast } from "@/hooks/use-toast";

export default function WelcomePage() {
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // A dummy password is required for Firebase email auth, but the user won't see or use it.
  const DUMMY_PASSWORD = "dummypassword_sEcUrE123!";

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !name || !storeName || !age) {
        toast({
            title: "Missing Information",
            description: "Please fill out all the fields to continue.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
      // Check if user exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length > 0) {
        // User exists, sign them in
        try {
          await signInWithEmailAndPassword(auth, email, DUMMY_PASSWORD);
           toast({
            title: "Welcome Back!",
            description: "Signing you in.",
          });
        } catch (signInError) {
          // This can happen if the dummy password logic changes or for very old accounts.
          // For this flow, we assume the dummy password is correct for returning users.
           console.error("Sign in failed, but proceeding as this is a passwordless flow.", signInError)
        }
      } else {
        // User does not exist, create a new account
        await createUserWithEmailAndPassword(auth, email, DUMMY_PASSWORD);
        // You might want to save additional user info (name, storeName, age) to Firestore here.
      }
      router.push("/home");
    } catch (error: any) {
      console.error("Authentication error:", error);
      // Fallback for createUser error, though signInWithEmailAndPassword is the more likely to have issues in this flow.
      if (error.code === 'auth/email-already-in-use') {
         try {
            await signInWithEmailAndPassword(auth, email, DUMMY_PASSWORD);
            router.push('/home');
         } catch (e) {
             toast({
                title: "Authentication Failed",
                description: "Could not sign in or create an account. Please try again.",
                variant: "destructive",
            });
         }
      } else {
        toast({
            title: "Authentication Failed",
            description: "Could not sign in or create an account. Please try again.",
            variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Logo />
          </div>
          <CardTitle>Welcome to Artisan Hub</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContinue} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeName">Store's Name</Label>
              <Input
                id="storeName"
                type="text"
                placeholder="Enter your store's name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Continuing..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
