import fs from 'fs';
import Papa from 'papaparse';
import path from 'path';
import { getTags } from '../src/logic/tagging';

// Adjust paths based on where the script is run. 
// Assuming run from webview root: npx tsx scripts/process_data.ts
const CSV_PATH = path.resolve('../products_full.csv');
const JSON_OUTPUT = path.resolve('src/data/products.json');

if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV file not found at: ${CSV_PATH}`);
    process.exit(1);
}

console.log(`Openning CSV from ${CSV_PATH}...`);
const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');

Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
        const products = results.data
            .filter((p: any) => p.title && p.price) // Minimal validation
            .map((p: any) => {
                const description = p.description || '';
                const title = p.title || '';
                const brand = p.brand || '';

                // Construct searchable text
                const fullText = `${title} ${description} ${brand}`;
                const tags = getTags(fullText);

                // Clean price
                const priceNum = parseInt((p.price || '0').replace(/[^0-9]/g, ''), 10);

                return {
                    id: p.id,
                    title,
                    brand,
                    price: priceNum,
                    image: p.image_link,
                    tags,
                    description: description.substring(0, 150) + "..." // Truncate desc
                };
            });

        console.log(`✅ Processed ${products.length} products.`);
        fs.writeFileSync(JSON_OUTPUT, JSON.stringify(products, null, 2));
        console.log(`💾 Saved to ${JSON_OUTPUT}`);
    },
    error: (err: any) => {
        console.error("Error parsing CSV:", err);
    }
});
