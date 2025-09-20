
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { ArrowLeft, Wand2, Copy, Bot, ImageIcon, Loader2, Download } from "lucide-react";
import { generateStory } from "@/ai/flows/generate-story";
import { customizeImage } from "@/ai/flows/customize-image";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIToolsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Story Generator State
  const [productInfo, setProductInfo] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Image Customizer State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundPrompt, setBackgroundPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


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

  const handleGenerateStory = async () => {
      if (!productInfo) {
          toast({
              title: "Product Info Missing",
              description: "Please describe your product first.",
              variant: "destructive",
          });
          return;
      }
      setIsGeneratingStory(true);
      setGeneratedStory("");
      try {
        const result = await generateStory({ productInfo });
        setGeneratedStory(result.story);
      } catch (error) {
           toast({
              title: "Story Generation Failed",
              description: "Could not generate a story. Please try again.",
              variant: "destructive",
          });
          console.error(error)
      } finally {
        setIsGeneratingStory(false);
      }
  };
  
  const handleCopyToClipboard = () => {
      if (!generatedStory) return;
      navigator.clipboard.writeText(generatedStory);
      toast({
          title: "Copied to Clipboard!",
          description: "The product story has been copied.",
      });
  }

  const handleDownloadStory = () => {
    if (!generatedStory) return;
    const blob = new Blob([generatedStory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product-story.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
        title: "Story Downloaded",
        description: "The product story has been saved as a text file.",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setGeneratedImage(null);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  const handleGenerateImage = async () => {
    if (!imageFile || !backgroundPrompt) {
         toast({
              title: "Missing Information",
              description: "Please upload an image and provide a background description.",
              variant: "destructive",
          });
        return;
    }
    setIsGeneratingImage(true);
    setGeneratedImage(null);
     try {
        const imageDataUri = await fileToDataUri(imageFile);
        const result = await customizeImage({
            image: { url: imageDataUri },
            prompt: backgroundPrompt,
        });
        if (result.image?.url) {
             setGeneratedImage(result.image.url);
        } else {
             throw new Error("No image was generated");
        }
    } catch (error) {
        console.error(error);
        toast({
            title: "Image Generation Failed",
            description: "Could not customize the image. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'customized-product-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
        title: "Image Downloaded",
        description: "The customized image has been saved to your device.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Logo />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
       <header className="flex items-center h-16 px-4 border-b bg-background md:px-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/home">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Home</span>
          </Link>
        </Button>
        <div className="flex-1 text-center">
            <h1 className="text-xl font-semibold">AI Creative Tools</h1>
        </div>
        <div className="w-8"></div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
            {/* Story Generator Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> Product Story Generator</CardTitle>
                    <CardDescription>Describe your product, and let our AI write a compelling story for it.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="productInfo">Product Name & Description</Label>
                        <Textarea id="productInfo" placeholder="e.g., A hand-carved wooden bowl made from reclaimed oak, perfect for salads or as a decorative centerpiece." value={productInfo} onChange={(e) => setProductInfo(e.target.value)} />
                    </div>
                    <Button onClick={handleGenerateStory} disabled={isGeneratingStory} className="w-full">
                        {isGeneratingStory ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate Story</>}
                    </Button>
                    {isGeneratingStory && (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    )}
                    {generatedStory && (
                         <div className="p-4 border rounded-md bg-stone-50 relative">
                             <div className="absolute top-2 right-2 flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyToClipboard}>
                                    <Copy className="h-4 w-4"/>
                                </Button>
                                 <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDownloadStory}>
                                    <Download className="h-4 w-4"/>
                                </Button>
                             </div>
                            <p className="text-sm text-stone-700 whitespace-pre-wrap">{generatedStory}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Image Customizer Card */}
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ImageIcon /> Image Background Customizer</CardTitle>
                    <CardDescription>Upload a product image and describe a new background to create stunning visuals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="productImage">Product Image</Label>
                         <Input id="productImage" type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} />
                    </div>
                    {imagePreview && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <p className="text-sm font-medium text-center">Original</p>
                                <Image src={imagePreview} alt="Original product" width={300} height={300} className="rounded-md mx-auto aspect-square object-cover" />
                            </div>
                            <div className="space-y-2">
                                 <p className="text-sm font-medium text-center">Generated</p>
                                 <div className="w-full aspect-square rounded-md border border-dashed flex items-center justify-center bg-slate-50 relative">
                                      {isGeneratingImage ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> :
                                        generatedImage ? (
                                            <>
                                                <Image src={generatedImage} alt="Generated product" width={300} height={300} className="rounded-md mx-auto aspect-square object-cover" />
                                                <Button size="sm" className="absolute bottom-2 right-2" onClick={handleDownloadImage}>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </Button>
                                            </>
                                        ) :
                                        <div className="text-center text-muted-foreground">
                                            <ImageIcon className="mx-auto h-8 w-8" />
                                            <p className="text-xs">New image will appear here</p>
                                        </div>
                                      }
                                 </div>
                            </div>
                        </div>
                    )}
                     <div className="space-y-2">
                        <Label htmlFor="backgroundPrompt">New Background Description</Label>
                         <Input id="backgroundPrompt" placeholder="e.g., on a marble countertop next to a vase of flowers" value={backgroundPrompt} onChange={(e) => setBackgroundPrompt(e.target.value)} />
                    </div>
                    <Button onClick={handleGenerateImage} disabled={isGeneratingImage} className="w-full">
                         {isGeneratingImage ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate New Image</>}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

    