import fs from 'fs';
import path from 'path';
import { getTags } from '../src/logic/tagging';

const ROOT_JSON_PATH = path.resolve('../products.json');
const JSON_OUTPUT = path.resolve('src/data/products.json');

if (!fs.existsSync(ROOT_JSON_PATH)) {
    console.error(`❌ JSON file not found at: ${ROOT_JSON_PATH}`);
    process.exit(1);
}

console.log(`Reading JSON from ${ROOT_JSON_PATH}...`);
const rawData = fs.readFileSync(ROOT_JSON_PATH, 'utf-8');
let productsRaw: any[] = [];

try {
    productsRaw = JSON.parse(rawData);
} catch (e) {
    console.error("Failed to parse JSON:", e);
    process.exit(1);
}

const products = productsRaw
    .filter((p: any) => p.title && p.price)
    .map((p: any, index: number) => {
        const title = p.title || '';
        // Extract ID from URL if possible, else use index
        const idMatch = p.url ? p.url.match(/\/products\/(.+)$/) : null;
        const id = idMatch ? idMatch[1] : `prod-${index}`;

        // Guess brand from title (First 2 words usually)
        // e.g. "Salvatore Ferragamo Signorina..." -> "Salvatore Ferragamo"
        const brand = title.split(' ').slice(0, 2).join(' ');

        // Clean price: "1,850,000₫" -> 1850000
        const priceNum = parseInt((p.price || '0').replace(/[^0-9]/g, ''), 10);

        // Tags logic
        const fullText = `${title} ${brand}`;
        const tags = getTags(fullText);

        return {
            id,
            title,
            brand,
            price: priceNum,
            image: p.image,
            tags,
            description: p.description || title, // Fallback description
            link: `https://namperfume.net${p.url}` // Full link for checkout
        };
    });

console.log(`✅ Processed ${products.length} products.`);
fs.writeFileSync(JSON_OUTPUT, JSON.stringify(products, null, 2));
console.log(`💾 Saved to ${JSON_OUTPUT}`);
