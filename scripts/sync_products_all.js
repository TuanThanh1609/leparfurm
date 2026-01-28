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
    let clean = priceStr.replace(/\s?VND/i, '').trim();
    clean = clean.replace(/\./g, '').replace(/,/g, '');
    return parseInt(clean, 10) || 0;
}

function parseDescriptionAttributes(text) {
    if (!text) return {};

    const extract = (regex) => {
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    };

    // Extract basic info
    const origin = extract(/Xuất xứ\s+([^\n]+?)(?=\s+(?:Năm phát hành|Nhóm hương|Phong cách|Mã hàng)|$)/i);
    const year = extract(/Năm phát hành\s+(\d{4})/i);
    const style = extract(/Phong cách\s+([^\n]+?)(?=\s+(?:Hương|Nốt|Chưa|$)|$)/i);
    const other_desc = extract(/(?:Chưa có mô tả|Mô tả sản phẩm)([\s\S]*)/i);

    // Extract notes (handle variations like "Hương đầu:", "Nốt hương đầu :")
    const topNotes = extract(/(?:Hương đầu|Nốt hương đầu)\s*[:]\s*([^\.]+?)(?=\.|Hương giữa|Nốt hương giữa|$)/i);
    const middleNotes = extract(/(?:Hương giữa|Nốt hương giữa)\s*[:]\s*([^\.]+?)(?=\.|Hương cuối|Nốt hương cuối|$)/i);
    const baseNotes = extract(/(?:Hương cuối|Nốt hương cuối)\s*[:]\s*([^\.]+?)(?=\.|$|Mô tả)/i);

    // Extract Group for tags
    const group = extract(/Nhóm hương\s+([^\n]+?)(?=\s+(?:Phong cách|Hương|$)|$)/i);
    let tags = [];
    if (group) {
        tags = group.split(/,|;/).map(t => t.trim()).filter(t => t);
    }

    return {
        origin,
        year,
        style,
        top_notes: topNotes,
        middle_notes: middleNotes,
        base_notes: baseNotes,
        tags
    };
}

// --- Main ---

try {
    console.log('Reading source files...');
    // Load backup for prices/images
    let products = new Map();
    const backupPath = path.join(rootDir, 'products_backup.json');
    if (fs.existsSync(backupPath)) {
        // Strip BOM if present
        const content = fs.readFileSync(backupPath, 'utf-8').replace(/^\uFEFF/, '');
        const backupData = JSON.parse(content);
        console.log(`Loaded ${backupData.length} products from backup (Source of Truth for Price/Image).`);
        backupData.forEach(p => {
            // Ensure numeric price
            p.price = typeof p.price === 'string' ? normalizePrice(p.price) : p.price;
            products.set(p.id, { ...p, source: 'backup' });
        });
    }

    // CSV for Description & Attributes
    console.log('Parsing CSV...');
    const csvContent = fs.readFileSync(path.join(rootDir, 'products_full.csv'), 'utf-8');
    const { headers, data: csvData } = parseCSV(csvContent);
    const h = headers;
    let updatedCount = 0;
    let newFromCsv = 0;

    console.log('Processing CSV data...');
    csvData.forEach(row => {
        const id = row[h['handle']]?.trim();
        if (!id) return;

        const description = row[h['description']]?.trim() || '';
        const attributes = parseDescriptionAttributes(description);

        // If product exists in backup, ONLY update description and attributes
        if (products.has(id)) {
            const existing = products.get(id);
            existing.description = description;
            existing.tags = attributes.tags || [];
            existing.origin = attributes.origin;
            existing.year = attributes.year;
            existing.style = attributes.style;
            existing.top_notes = attributes.top_notes;
            existing.middle_notes = attributes.middle_notes;
            existing.base_notes = attributes.base_notes;
            updatedCount++;
        } else {
            // New product from CSV (might have bad price/image, but better than nothing)
            const priceRaw = row[h['price']];
            const price = normalizePrice(priceRaw);

            // Detect placeholder image
            let image = row[h['image_link']]?.trim();
            if (image && image.includes('icon-ring.svg')) {
                image = ''; // Treat as empty so XML can fill it
            }

            products.set(id, {
                id: id,
                title: row[h['title']]?.trim(),
                description: description,
                brand: row[h['brand']]?.trim() || 'Unknown',
                price: price,
                image: image,
                link: row[h['link']]?.trim(),
                tags: attributes.tags || [],
                origin: attributes.origin,
                year: attributes.year,
                style: attributes.style,
                top_notes: attributes.top_notes,
                middle_notes: attributes.middle_notes,
                base_notes: attributes.base_notes,
                source: 'csv'
            });
            newFromCsv++;
        }
    });

    console.log(`Updated details for ${updatedCount} products from backup.`);
    console.log(`Added ${newFromCsv} new products from CSV.`);

    // Optional: Parse XML if we want to cross-check or find more products
    // For now, let's assume CSV + Backup is enough. 
    // But if you want to merge XML, we can do it similarly.
    console.log('Parsing XML...');
    const xmlData = parseXML(fs.readFileSync(path.join(rootDir, 'products_feed.xml'), 'utf-8'));
    console.log(`Found ${xmlData.length} items in XML.`);

    let mixedCount = 0;
    let newFromXml = 0;

    // Merge XML (Lower priority than CSV for description, but checks for new items)
    xmlData.forEach(item => {
        const existing = products.get(item.id);
        const xmlPrice = normalizePrice(item.price);

        if (existing) {
            // Only update if existing description is empty and XML has one
            if ((!existing.description || existing.description.length < 20) && item.description && item.description.length > 20) {
                existing.description = item.description;
                const newAttrs = parseDescriptionAttributes(item.description);
                existing.tags = newAttrs.tags.length > 0 ? newAttrs.tags : existing.tags;
                existing.origin = newAttrs.origin || existing.origin;
                existing.year = newAttrs.year || existing.year;
                existing.style = newAttrs.style || existing.style;
                existing.top_notes = newAttrs.top_notes || existing.top_notes;
                existing.middle_notes = newAttrs.middle_notes || existing.middle_notes;
                existing.base_notes = newAttrs.base_notes || existing.base_notes;
            }
            // If backup had price 0 (rare) and XML has price, use it? likely backup is good.
            if (existing.price === 0 && xmlPrice > 0) {
                existing.price = xmlPrice;
            }
            // Prefer XML image if CSV/Backup image is missing or placeholder
            if ((!existing.image || existing.image.includes('icon-ring.svg')) && item.image_link && !item.image_link.includes('icon-ring.svg')) {
                existing.image = item.image_link;
            }
            mixedCount++;
        } else {
            // New product from XML
            const xmlAttrs = parseDescriptionAttributes(item.description);
            products.set(item.id, {
                id: item.id,
                title: item.title,
                description: item.description,
                brand: item.brand || 'Unknown',
                price: xmlPrice,
                image: item.image_link,
                link: item.link,
                tags: xmlAttrs.tags || [],
                origin: xmlAttrs.origin,
                year: xmlAttrs.year,
                style: xmlAttrs.style,
                top_notes: xmlAttrs.top_notes,
                middle_notes: xmlAttrs.middle_notes,
                base_notes: xmlAttrs.base_notes,
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
