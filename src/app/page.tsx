
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { BarChart, Bot, Brush, Clapperboard, Lightbulb, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";


const features = [
    {
        icon: <Bot className="w-10 h-10 text-primary" />,
        title: "AI-Powered Storytelling",
        description: "Generate compelling product descriptions and artisan stories that connect with customers on a deeper level."
    },
    {
        icon: <Clapperboard className="w-10 h-10 text-primary" />,
        title: "AI-Driven Visuals",
        description: "Create studio-quality product photos, lifestyle images, and social media banners with the power of AI."
    },
    {
        icon: <Lightbulb className="w-10 h-10 text-primary" />,
        title: "Personalized Marketing",
        description: "Get customized marketing copy and relevant hashtags to boost your visibility on social media."
    },
    {
        icon: <Store className="w-10 h-10 text-primary" />,
        title: "Instant E-commerce Storefront",
        description: "Launch your own mobile-friendly online store with a single click. No technical skills required."
    },
    {
        icon: <BarChart className="w-10 h-10 text-primary" />,
        title: "Sales & Insights",
        description: "Understand your business better with a simple dashboard showing sales trends and customer insights."
    }
];

export default function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-bold">Artisan Hub</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <section className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold mb-4">Welcome to Artisan Hub</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your craft is unique. Your online store should be too. Artisan Hub provides AI-powered tools to help you build a beautiful brand, connect with customers, and grow your business.
        </p>
        <Button size="lg" asChild>
            <Link href="/signup">Get Started for Free</Link>
        </Button>
      </section>

       <section className="py-20 px-4 bg-muted/40">
        <div className="text-center mb-12">
            <h3 className="text-3xl font-bold">Features Designed for Artisans</h3>
            <p className="text-muted-foreground mt-2">From product photography to sales insights, we've got you covered.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="text-center mb-12">
            <h3 className="text-3xl font-bold">From Our Talented Artisans</h3>
            <p className="text-muted-foreground mt-2">Discover unique, handcrafted goods you can't find anywhere else.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {placeholderImages.slice(0, 8).map((product) => (
                <div key={product.id} className="group relative">
                    <Image
                        src={product.url}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-auto object-cover rounded-lg aspect-square transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={product.aiHint}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-4">
                        <p className="text-white font-semibold">{product.name}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <footer className="text-center py-10 border-t">
        <p>&copy; {new Date().getFullYear()} Artisan Hub. All rights reserved.</p>
      </footer>
    </main>
  );
}
