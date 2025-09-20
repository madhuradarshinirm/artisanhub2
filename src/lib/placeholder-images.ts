import placeholderData from './placeholder-images.json';

type Product = {
    id: number;
    name: string;
    url: string;
    category: string;
    price: number;
    aiHint: string;
};

export const placeholderImages: Product[] = placeholderData.images;
