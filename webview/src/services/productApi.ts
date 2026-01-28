// NocoDB API service for fetching products
// Endpoint: nocodb.smax.in - Product Table: mj6tfz6krvq9mj4

import type { Product } from '../components/Results';
import { getTags } from '../logic/tagging';

const NOCODB_API_URL = "https://nocodb.smax.in/api/v2/tables/mj6tfz6krvq9mj4/records";

export interface NocoDBProduct {
    Id: number;
    title?: string;
    name?: string;
    price?: number | string;
    image?: string;
    image_link?: string;
    description?: string;
    brand?: string;
    link?: string;
    url?: string;
}

export interface FetchProductsResult {
    success: boolean;
    products: Product[];
    error?: string;
}

export async function fetchProducts(): Promise<FetchProductsResult> {
    try {
        const response = await fetch(`${NOCODB_API_URL}?limit=500`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "xc-token": import.meta.env.VITE_NOCODB_API_TOKEN || ""
            }
        });

        if (!response.ok) {
            throw new Error(`Lỗi server (${response.status})`);
        }

        const data = await response.json();
        const records: NocoDBProduct[] = data.list || [];

        // Map NocoDB records to Product interface
        const products: Product[] = records
            .filter((p) => (p.title || p.name) && p.price)
            .map((p, index) => {
                const title = p.title || p.name || '';
                const priceNum = typeof p.price === 'number'
                    ? p.price
                    : parseInt(String(p.price).replace(/[^0-9]/g, ''), 10) || 0;

                // Generate tags from title and description
                const fullText = `${title} ${p.description || ''} ${p.brand || ''}`;
                const tags = getTags(fullText);

                return {
                    id: `noco-${p.Id || index}`,
                    title,
                    brand: p.brand || title.split(' ').slice(0, 2).join(' '),
                    price: priceNum,
                    image: p.image || p.image_link || '',
                    tags,
                    description: p.description || title,
                    link: p.link || p.url || ''
                };
            });

        console.log(`✅ Fetched ${products.length} products from NocoDB`);
        return {
            success: true,
            products
        };
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return {
            success: false,
            products: [],
            error: error instanceof Error ? error.message : "Lỗi không xác định"
        };
    }
}
