
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, PlusCircle, Compass, User as UserIcon, Store, Bot, Bell } from "lucide-react";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/");
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
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center h-16 px-4 border-b bg-background md:px-6">
           <Skeleton className="h-8 w-32" />
           <div className="ml-auto flex items-center gap-4">
             <Skeleton className="h-8 w-24" />
             <Skeleton className="h-8 w-24" />
             <Skeleton className="h-8 w-24" />
             <Skeleton className="h-10 w-10 rounded-full" />
           </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                 <Skeleton className="h-10 w-1/4 mb-4" />
                 <Skeleton className="h-6 w-1/2 mb-8" />
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Skeleton className="h-72" />
                    <Skeleton className="h-72" />
                    <Skeleton className="h-72" />
                    <Skeleton className="h-72" />
                    <Skeleton className="h-72" />
                    <Skeleton className="h-72" />
                    <Skeleton className="h-72" />
                    <Skeleton className="h-72" />
                </div>
            </div>
        </main>
      </div>
    );
  }
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const featuredProducts = placeholderImages.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="flex items-center h-16 px-4 border-b bg-background md:px-6 sticky top-0 z-50">
        <nav className="flex items-center gap-6 text-lg font-medium md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
          <Link href="/home" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Logo />
            <span className="sr-only">Artisan Hub</span>
          </Link>
          <div className="flex-1">
             <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Compass size={20} />
                  Explore
                </Link>
                <Link href="/my-store" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Store size={20}/>
                    My Store
                </Link>
                <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <UserIcon size={20}/>
                    Profile
                </Link>
                 <Link href="/ai-tools" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Bot size={20}/>
                    AI Tools
                </Link>
            </nav>
           </div>

          <div className="flex items-center gap-4 md:ml-auto">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                   <Avatar>
                        <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                        <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                    </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{user?.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                 <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Welcome to Artisan Hub
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl mt-2">
                    Discover unique, handcrafted goods from talented artisans around the world.
                  </p>
            </div>
             <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                   <Image
                      src={product.url}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-48 object-cover"
                      data-ai-hint={product.aiHint}
                    />
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-2">{product.category}</p>
                    <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
