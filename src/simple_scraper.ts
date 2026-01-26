import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('Navigating to namperfume.net...');
    await page.goto('https://namperfume.net/');

    const title = await page.title();
    console.log('Page Title:', title);

    // Validated selectors from inspection
    const products = await page.$$eval('.pro-loop', items => {
        return items.map(item => {
            const titleEl = item.querySelector('.pro-name a') || item.querySelector('a');
            const priceEl = item.querySelector('.pro-price');
            const imgEl = item.querySelector('img');

            return {
                title: titleEl?.textContent?.trim(),
                url: titleEl?.getAttribute('href'),
                price: priceEl?.textContent?.trim(),
                image: imgEl?.src
            };
        });
    });

    console.log(`Found ${products.length} products on home page.`);
    if (products.length > 0) {
        console.log('Top 5 Example:', products.slice(0, 5));

        // Save JSON
        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

        // Save CSV
        const csvHeader = 'Title,Price,URL,Image\n';
        const csvRows = products.map(p => {
            const t = (p.title || '').replace(/"/g, '""');
            const pr = (p.price || '').replace(/"/g, '""');
            return `"${t}","${pr}","${p.url || ''}","${p.image || ''}"`;
        }).join('\n');
        fs.writeFileSync('products.csv', csvHeader + csvRows);

        // Save XML
        const xmlItems = products.map(p => `
    <item>
        <title><![CDATA[${p.title || ''}]]></title>
        <price>${p.price || ''}</price>
        <link>https://namperfume.net${p.url || ''}</link>
        <image>${p.image || ''}</image>
    </item>`).join('');
        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<products>
${xmlItems}
</products>`;
        fs.writeFileSync('products.xml', xmlContent);

        console.log('Saved to products.json, products.csv, products.xml');
    } else {
        console.log('No products found. Selector might still be wrong or content dynamic.');
    }

    await browser.close();
})();
