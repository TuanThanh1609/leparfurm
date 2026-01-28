import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '../');
const csvPath = path.join(rootDir, 'products_full.csv');
const xmlPath = path.join(rootDir, 'products_feed.xml');
const jsonPath = path.join(rootDir, 'webview/src/data/products.json');

// --- Helpers ---

function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            if (currentRow.length > 0 || currentField.length > 0) {
                currentRow.push(currentField);
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
            }
        } else {
            currentField += char;
        }
    }
    if (currentRow.length > 0 || currentField.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows;
}

function extractCDATA(str) {
    const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    return match ? match[1].trim() : str.trim();
}

function parseXML(text) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null) {
        const itemContent = match[1];

        const getTag = (tag) => {
            const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`);
            const m = itemContent.match(regex);
            return m ? extractCDATA(m[1]) : '';
        };

        items.push({
            id: getTag('g:id'),
            title: getTag('g:title'),
            description: getTag('g:description'),
            link: getTag('g:link'),
            image_link: getTag('g:image_link'),
            brand: getTag('g:brand'),
            price: getTag('g:price'),
            category: getTag('g:google_product_category')
        });
    }
    return items;
}

function normalizePrice(priceStr) {
    if (!priceStr) return 0;
    // Handle "1.200.000 VND" or "1200000" or "0 VND"
    // Remove " VND", remove dots/commas if they are thousands separators
    // Heuristic: if it contains "VND", strip it.
    let clean = priceStr.replace(/\s?VND/i, '').trim();
    // If it has dots as thousands separators (common in VN), remove them
    // But be careful of decimals. Usually VND doesn't have decimals.
    clean = clean.replace(/\./g, '').replace(/,/g, '');
    return parseInt(clean, 10) || 0;
}

// --- Main ---

try {
    console.log('Reading source files...');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');

    console.log('Parsing CSV...');
    const csvRows = parseCSV(csvContent);
    const csvHeaders = csvRows[0].map(h => h.trim().toLowerCase());

    // Map CSV headers to indices
    const h = {};
    csvHeaders.forEach((header, idx) => { h[header] = idx; });

    const products = new Map();

    // Process CSV first
    console.log('Processing CSV data...');
    let csvCount = 0;
    for (let i = 1; i < csvRows.length; i++) {
        const row = csvRows[i];
        if (row.length < 2) continue; // Skip empty rows

        const id = row[h['id']]?.trim();
        if (!id) continue;

        const priceRaw = row[h['price']];
        const price = normalizePrice(priceRaw);

        products.set(id, {
            id: id,
            title: row[h['title']]?.trim(),
            description: row[h['description']]?.trim(),
            brand: row[h['brand']]?.trim() || 'Unknown',
            price: price,
            image: row[h['image_link']]?.trim(),
            link: row[h['link']]?.trim(),
            tags: [], // Initialize tags
            source: 'csv'
        });
        csvCount++;
    }
    console.log(`Loaded ${csvCount} products from CSV.`);

    // Process XML
    console.log('Parsing XML...');
    const xmlItems = parseXML(xmlContent);
    console.log(`Found ${xmlItems.length} items in XML.`);

    let mixedCount = 0;
    let newFromXml = 0;

    xmlItems.forEach(item => {
        if (!item.id) return;

        const existing = products.get(item.id);
        const xmlPrice = normalizePrice(item.price);

        if (existing) {
            // MERGE POLICY
            // Prefer longer description
            if (item.description && item.description.length > (existing.description?.length || 0)) {
                existing.description = item.description;
            }
            // Prefer non-zero price (if CSV was 0)
            if (existing.price === 0 && xmlPrice > 0) {
                existing.price = xmlPrice;
            }
            // Prefer XML image if CSV image is missing
            if (!existing.image && item.image_link) {
                existing.image = item.image_link;
            }
            mixedCount++;
        } else {
            // New product from XML
            products.set(item.id, {
                id: item.id,
                title: item.title,
                description: item.description,
                brand: item.brand || 'Unknown',
                price: xmlPrice,
                image: item.image_link,
                link: item.link,
                tags: [],
                source: 'xml'
            });
            newFromXml++;
        }
    });

    console.log(`Merged ${mixedCount} products, added ${newFromXml} new from XML.`);

    // Convert to array
    const finalProducts = Array.from(products.values());

    // Filter out products with no valid title or id
    const validProducts = finalProducts.filter(p => p.id && p.title);

    console.log(`Final product count: ${validProducts.length}`);

    fs.writeFileSync(jsonPath, JSON.stringify(validProducts, null, 2));
    console.log(`Successfully wrote to ${jsonPath}`);

    // --- Cleanup ---
    // User asked to remove "unrelated product files".
    // We will list files in root and webview/src/data and warn logic (or just log for now to be safe)

} catch (error) {
    console.error('Error:', error);
}
