import { chromium } from 'playwright';
import fs from 'fs';

// Configuration
const CATEGORIES = [
    { name: 'Nước hoa nữ', url: 'https://namperfume.net/collections/nuoc-hoa-nu' },
    { name: 'Nước hoa nam', url: 'https://namperfume.net/collections/nuoc-hoa-nam' },
    { name: 'Unisex', url: 'https://namperfume.net/collections/nuoc-hoa-unisex' }
];

const MAX_PAGES_PER_CAT = 10; // Safety limit per category
const MAX_PRODUCTS_TOTAL = 1200; // Total limit
const OUTPUT_CSV = 'products_full.csv';
const OUTPUT_XML = 'products_feed.xml';

interface Product {
    id: string;
    title: string;
    description: string;
    link: string;
    image_link: string;
    price: string;
    brand: string;
    availability: string;
    condition: string;
    category: string;
    google_product_category: string;
}

(async () => {
    console.log('🚀 Starting Full Site Scraper for Product Feed...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });

    let allProducts: Product[] = [];

    for (const cat of CATEGORIES) {
        console.log(`\n📂 Processing Category: ${cat.name} (${cat.url})`);
        const page = await context.newPage();
        let currentPage = 1;
        let hasNextPage = true;

        await page.goto(cat.url);

        while (hasNextPage && currentPage <= MAX_PAGES_PER_CAT && allProducts.length < MAX_PRODUCTS_TOTAL) {
            console.log(`   📄 Scanning page ${currentPage}...`);

            // Get product links
            const productLinks = await page.$$eval('.pro-loop', items => {
                return items.map(item => {
                    const link = item.querySelector('.pro-name a') || item.querySelector('a');
                    return link ? link.getAttribute('href') : null;
                }).filter(url => url !== null);
            });

            console.log(`   Found ${productLinks.length} products. Extracting details...`);

            for (const link of productLinks) {
                if (allProducts.length >= MAX_PRODUCTS_TOTAL) break;

                const productUrl = `https://namperfume.net${link}`;
                // Check for duplicates
                if (allProducts.some(p => p.link === productUrl)) continue;

                const pPage = await context.newPage();

                // Block heavy resources
                await pPage.route('**/*', (route) => {
                    const type = route.request().resourceType();
                    if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
                        return route.abort();
                    }
                    return route.continue();
                });

                // Helper: Safe Goto with Retry (Playwright Skill Pattern)
                const safeGoto = async (url: string, retries = 3) => {
                    for (let i = 0; i < retries; i++) {
                        try {
                            await pPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
                            return true;
                        } catch (e) {
                            if (i === retries - 1) throw e;
                            console.log(`      ⚠️ Retry ${i + 1}/${retries} for ${url}`);
                            await new Promise(r => setTimeout(r, 2000));
                        }
                    }
                    return false;
                };

                try {
                    await safeGoto(productUrl);

                    // Allow some time for dynamic content
                    await pPage.waitForTimeout(1000);

                    const data = await pPage.evaluate((catName) => {
                        // Strategy 1: JSON-LD (Preferred)
                        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
                        let ldProduct = null;

                        for (const script of jsonLdScripts) {
                            try {
                                const json = JSON.parse(script.textContent || '{}');
                                if (json['@type'] === 'Product') {
                                    ldProduct = json;
                                    break;
                                }
                            } catch (e) { }
                        }

                        let title = '', price = '0', image = '', description = '', brand = '';

                        if (ldProduct) {
                            title = ldProduct.name || '';
                            if (ldProduct.offers) {
                                const offer = Array.isArray(ldProduct.offers) ? ldProduct.offers[0] : ldProduct.offers;
                                price = offer.price ? String(offer.price) : '0';
                            }
                            if (ldProduct.image) {
                                image = Array.isArray(ldProduct.image) ? ldProduct.image[0] : ldProduct.image;
                            } else {
                                // Fallback to offers image if main image is missing
                                const offer = Array.isArray(ldProduct.offers) ? ldProduct.offers[0] : ldProduct.offers;
                                if (offer && offer.image) image = offer.image;
                            }
                            description = ldProduct.description || '';
                            brand = ldProduct.brand ? (ldProduct.brand.name || ldProduct.brand) : '';
                        }

                        // Strategy 2: DOM scraping (Fallback & Fill-in)
                        if (!title) title = document.querySelector('h1')?.textContent?.trim() || '';

                        if (price === '0') {
                            const priceRaw = document.querySelector('.product-price')?.textContent?.trim() ||
                                document.querySelector('.current-price')?.textContent?.trim() ||
                                document.querySelector('#price-preview')?.textContent?.trim() || '0';
                            price = priceRaw.replace(/[^0-9]/g, '');
                        }

                        // Sanitize Price
                        if (price.length > 8 && price.endsWith('00') && parseInt(price) > 100000000) {
                            // Heuristic: If > 100M and ends in 00, likely cents. Divide by 100.
                            price = String(parseInt(price) / 100);
                        }

                        if (!image || image.includes('icon-ring.svg') || (!image.startsWith('http') && !image.startsWith('//'))) {
                            // Try finding the largest image if not found via LD
                            const imgs = Array.from(document.querySelectorAll('img[src*="product"], img[src*="master"]')) as HTMLImageElement[];
                            if (imgs.length > 0) {
                                // Sort by visual size if possible, or just take first non-icon
                                const bestImg = imgs.find(i => !i.src.includes('icon') && !i.src.includes('logo'));
                                if (bestImg) image = bestImg.src;
                            }
                            // Final fallback
                            if (!image) image = document.querySelector('#product-featured-image')?.getAttribute('src') || '';
                        }

                        if (image.startsWith('//')) image = `https:${image}`;

                        // Ensure brand fallback
                        if (!brand) brand = document.querySelector('.pro-vendor')?.textContent?.replace('Thương hiệu', '').trim() || 'No Brand';

                        // Description fallback
                        if (!description) {
                            const descEl = document.querySelector('#tab-detail');
                            if (descEl) {
                                const clone = descEl.cloneNode(true) as HTMLElement;
                                clone.querySelectorAll('script, style').forEach(el => el.remove());
                                description = clone.textContent?.trim().replace(/\s+/g, ' ') || '';
                            }
                        }

                        // Sanity Check on Price (prevent 3800000000 error if weird currency)
                        if (price.length > 9) {
                            // If > 9 digits (e.g. 1 billion VND is rare for perfume), check if it's crazy
                            // 3,800,000 is 7 digits. 8 digits is 10M+. 9 digits is 100M+.
                            // If it's 380000000 (9 digits), maybe it is bad? 
                            // Realistically, leave it raw, but logic below in main script handles it? 
                            // We return raw digits.
                        }

                        // ID from URL (last part)
                        const id = document.location.pathname.split('/').pop() || 'unknown';

                        return {
                            id,
                            title,
                            price,
                            image_link: image,
                            description,
                            brand,
                            availability: 'in stock',
                            condition: 'new',
                            category: catName,
                            google_product_category: 'Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne'
                        };
                    }, cat.name);

                    allProducts.push({
                        ...data,
                        link: productUrl
                    });

                    process.stdout.write('.');

                } catch (err) {
                    console.error(`❌ Error scraping ${productUrl}: ${err instanceof Error ? err.message : String(err)}`);
                } finally {
                    await pPage.close();
                }

                // Rate limit
                await new Promise(r => setTimeout(r, 2000));
            }

            // Next Page
            const nextSelector = '#pagination a.next, .pagination .next a, a[title="Next"]';
            const nextButton = await page.$(nextSelector);
            if (nextButton && allProducts.length < MAX_PRODUCTS_TOTAL) {
                const nextUrl = await page.$eval(nextSelector, el => el.getAttribute('href'));
                console.log(`\n   ⏭️ Next page: ${nextUrl}`);
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                    // page.click(nextSelector) // Navigation sometimes fails on click, goto is safer if we extract URL
                    page.goto(`https://namperfume.net${nextUrl}`)
                ]);
                currentPage++;
            } else {
                console.log('\n   ⏹️ End of category or limit reached.');
                hasNextPage = false;
            }
        }
        await page.close();
    }

    // Export CSV
    console.log('\n💾 Generating CSV...');
    const csvHeader = 'id,title,description,link,image_link,price,brand,availability,condition,google_product_category\n';
    const csvRows = allProducts.map(p => {
        const escape = (txt: string) => `"${(txt || '').replace(/"/g, '""')}"`;
        return [
            escape(p.id),
            escape(p.title),
            escape(p.description),
            escape(p.link),
            escape(p.image_link),
            `${p.price} VND`,
            escape(p.brand),
            escape(p.availability),
            escape(p.condition),
            escape(p.google_product_category)
        ].join(',');
    }).join('\n');
    fs.writeFileSync(OUTPUT_CSV, '\uFEFF' + csvHeader + csvRows);

    // Export XML (RSS 2.0)
    console.log('💾 Generating XML Feed...');
    const xmlContent = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>NamPerfume Product Feed</title>
        <link>https://namperfume.net</link>
        <description>Product feed for NamPerfume</description>
${allProducts.map(p => `        <item>
            <g:id>${p.id}</g:id>
            <g:title><![CDATA[${p.title}]]></g:title>
            <g:description><![CDATA[${p.description}]]></g:description>
            <g:link>${p.link}</g:link>
            <g:image_link>${p.image_link}</g:image_link>
            <g:brand>${p.brand}</g:brand>
            <g:condition>${p.condition}</g:condition>
            <g:availability>${p.availability}</g:availability>
            <g:price>${p.price} VND</g:price>
            <g:google_product_category>${p.google_product_category}</g:google_product_category>
        </item>`).join('\n')}
    </channel>
</rss>`;
    fs.writeFileSync(OUTPUT_XML, xmlContent);

    console.log(`🎉 Success! Collected ${allProducts.length} products.`);
    console.log(`files: ${OUTPUT_CSV}, ${OUTPUT_XML}`);

    await browser.close();
})();
