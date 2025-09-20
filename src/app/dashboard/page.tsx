
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, PlusCircle, ShoppingBag, BarChart2, Bot } from "lucide-react";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl p-8 space-y-4">
            <Skeleton className="w-1/4 h-8" />
            <Skeleton className="w-1/2 h-6" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <Skeleton className="w-full h-96" />
        </div>
      </div>
    );
  }

  const userProducts = placeholderImages.slice(0, 4); // Example products

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-bold">Artisan Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">{user?.email}</p>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="w-5 h-5" />
            </Button>
        </div>
      </header>
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <span className="text-2xl">💰</span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$4,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <BarChart2 className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Tools</CardTitle>
                    <Bot className="h-6 w-6 text-primary" />
                </CardHeader>
                <CardContent>
                     <div className="text-2xl font-bold">Generate</div>
                    <p className="text-xs text-muted-foreground">Descriptions, Photos & More</p>
                </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>Manage and view your artisanal products.</CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </CardHeader>
            <CardContent>
              {userProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {userProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <Image 
                        src={product.url}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover"
                        data-ai-hint={product.aiHint}
                      />
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4">{product.category}</p>
                        <div className="font-bold text-lg">${product.price}</div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Edit</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium text-foreground">No products yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first product.</p>
                  <div className="mt-6">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
