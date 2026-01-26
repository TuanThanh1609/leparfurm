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
                const data = await pPage.evaluate(() => {
                    const title = document.querySelector('h1')?.textContent?.trim() || '';
                    const price = document.querySelector('.product-price')?.textContent?.trim() || '';
                    const image = document.querySelector('#product-featured-image')?.getAttribute('src') || document.querySelector('img')?.getAttribute('src') || '';

                    // Breadcrumb for Category
                    const breadcrumbLinks = Array.from(document.querySelectorAll('.breadcrumb a'));
                    // Usually 2nd or 3rd link is the collection. Logic: Take the one before the last (which is product Title)
                    let category = '';
                    if (breadcrumbLinks.length >= 2) {
                        category = breadcrumbLinks[breadcrumbLinks.length - 1].textContent?.trim() || ''; // Last link usually
                        // If last text matches title, take previous. simple heuristic:
                        if (category === title || category === '') {
                            category = breadcrumbLinks[breadcrumbLinks.length - 2]?.textContent?.trim() || 'Nước hoa nữ';
                        }
                    } else {
                        category = 'Nước hoa nữ'; // Fallback knowing the start URL
                    }

                    // Description text (using #tab-detail as identified)
                    const descEl = document.querySelector('#tab-detail');
                    // Remove scripts/styles from desc text
                    if (descEl) {
                        const clones = descEl.cloneNode(true);
                        const trash = clones.querySelectorAll('script, style');
                        trash.forEach(t => t.remove());
                    }
                    const description = descEl ? descEl.textContent?.trim().replace(/\s+/g, ' ') : ''; // Optimize whitespace

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
                console.error(`❌ Error scraping ${productUrl}: ${err.message}`);
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
