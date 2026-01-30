import { chromium } from 'playwright';
import fs from 'fs';

// Configuration
const START_URL = 'https://namperfume.net/collections/nuoc-hoa-nu';
const MAX_PAGES = 50; // Safety limit
const MAX_PRODUCTS = 300; // User request
const OUTPUT_FILE = 'products_women.csv';

(async () => {
    console.log('🚀 Starting Category Scraper: Nước hoa nữ...');
    const browser = await chromium.launch({ headless: true });
    // Use a persistent context if needed, but newPage is fine for read-only
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const page = await context.newPage();

    // State
    let allProducts = [];
    let currentPage = 1;
    let hasNextPage = true;

    // 1. Traverse Pagination
    console.log(`📂 Navigating to category: ${START_URL}`);
    await page.goto(START_URL);

    while (hasNextPage && allProducts.length < MAX_PRODUCTS && currentPage <= MAX_PAGES) {
        console.log(`📄 Scaning page ${currentPage}...`);

        // Get all product links on current page
        const productLinks = await page.$$eval('.pro-loop', items => {
            return items.map(item => {
                const link = item.querySelector('.pro-name a') || item.querySelector('a');
                return link ? link.getAttribute('href') : null;
            }).filter(url => url !== null);
        });

        console.log(`   Found ${productLinks.length} products. Extracting details...`);

        // 2. Visit each product (Deep Crawl)
        for (const link of productLinks) {
            if (allProducts.length >= MAX_PRODUCTS) break;

            const productUrl = `https://namperfume.net${link}`;
            const pPage = await context.newPage();

            try {
                await pPage.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

                // Extract Data
                // Extract Data
                const data = await pPage.evaluate(() => {
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

                    let title = '', price = '0', image = '', description = '', category = '';

                    if (ldProduct) {
                        title = ldProduct.name || '';
                        if (ldProduct.offers) {
                            const offer = Array.isArray(ldProduct.offers) ? ldProduct.offers[0] : ldProduct.offers;
                            price = offer.price ? String(offer.price) : '0';
                        }
                        if (ldProduct.image) {
                            image = Array.isArray(ldProduct.image) ? ldProduct.image[0] : ldProduct.image;
                        } else {
                            const offer = Array.isArray(ldProduct.offers) ? ldProduct.offers[0] : ldProduct.offers;
                            if (offer && offer.image) image = offer.image;
                        }
                        description = ldProduct.description || '';
                    }

                    // Strategy 2: DOM scraping (Fallback)
                    if (!title) title = document.querySelector('h1')?.textContent?.trim() || '';
                    if (price === '0') {
                        price = document.querySelector('.product-price')?.textContent?.trim() ||
                            document.querySelector('.current-price')?.textContent?.trim() || '';
                    }
                    // Sanitize Price
                    if (price.length > 8 && price.endsWith('00') && parseInt(price) > 100000000) {
                        price = String(parseInt(price) / 100);
                    }

                    if (!image || image.includes('icon-ring') || (!image.startsWith('http') && !image.startsWith('//'))) {
                        const imgs = Array.from(document.querySelectorAll('img[src*="product"], img[src*="master"]')) as HTMLImageElement[];
                        if (imgs.length > 0) {
                            const bestImg = imgs.find(i => !i.src.includes('icon') && !i.src.includes('logo'));
                            if (bestImg) image = bestImg.src;
                        }
                        if (!image) {
                            image = document.querySelector('#product-featured-image')?.getAttribute('src') ||
                                document.querySelector('img')?.getAttribute('src') || '';
                        }
                    }

                    // Breadcrumb for Category
                    const breadcrumbLinks = Array.from(document.querySelectorAll('.breadcrumb a'));
                    if (breadcrumbLinks.length >= 2) {
                        category = breadcrumbLinks[breadcrumbLinks.length - 1].textContent?.trim() || '';
                        if (category === title || category === '') {
                            category = breadcrumbLinks[breadcrumbLinks.length - 2]?.textContent?.trim() || 'Nước hoa nữ';
                        }
                    } else {
                        category = 'Nước hoa nữ';
                    }

                    // Description text
                    if (!description) {
                        const descEl = document.querySelector('#tab-detail');
                        if (descEl) {
                            const clones = descEl.cloneNode(true) as HTMLElement;
                            clones.querySelectorAll('script, style').forEach(el => el.remove());
                            description = clones.textContent?.trim().replace(/\s+/g, ' ') || '';
                        }
                    }

                    return { title, price, category, image, description };
                });

                allProducts.push({
                    url: productUrl,
                    ...data,
                    image: data.image.startsWith('//') ? `https:${data.image}` : data.image
                });

                // Progress indicator
                process.stdout.write('.');

            } catch (err) {
                console.error(`❌ Error scraping ${productUrl}: ${err instanceof Error ? err.message : String(err)}`);
            } finally {
                await pPage.close();
            }
        }

        console.log(`\n   ✅ Collected ${allProducts.length} items so far.`);

        // Check Pagination
        const nextSelector = '#pagination a.next, .pagination .next a, a[title="Next"]';
        const nextButton = await page.$(nextSelector);
        if (nextButton && allProducts.length < MAX_PRODUCTS) {
            const nextUrl = await page.$eval(nextSelector, el => el.getAttribute('href'));
            console.log(`   ⏭️ Next page detected: ${nextUrl}`);
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click('.pagination .next a')
            ]);
            currentPage++;
        } else {
            console.log('   ⏹️ End of lists or limit reached.');
            hasNextPage = false;
        }
    }

    // 3. Export
    console.log('💾 Saving to CSV...');
    const csvHeader = 'Category,Title,Price,URL,Image,Description\n';
    const csvRows = allProducts.map(p => {
        const cat = (p.category || '').replace(/"/g, '""');
        const tit = (p.title || '').replace(/"/g, '""');
        const pr = (p.price || '').replace(/"/g, '""');
        const desc = (p.description || '').replace(/"/g, '""'); // Potentially long
        return `"${cat}","${tit}","${pr}","${p.url}","${p.image}","${desc}"`;
    }).join('\n');

    // Add BOM (\uFEFF) for Excel to recognize UTF-8
    fs.writeFileSync(OUTPUT_FILE, '\uFEFF' + csvHeader + csvRows);
    console.log(`🎉 Done! Saved ${allProducts.length} products to ${OUTPUT_FILE}`);

    await browser.close();
})();
