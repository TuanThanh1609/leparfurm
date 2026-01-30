
import { chromium } from 'playwright';

(async () => {
    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Mimic real user agent
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });

    const url = 'https://namperfume.net/products/chloe-atelier-des-fleurs-magnolia-alba';
    console.log(`Navigating to ${url}...`);

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log('Page loaded.');

        // Wait a bit
        await page.waitForTimeout(3000);

        // Dump signals
        const data = await page.evaluate(() => {
            const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
                .map(el => {
                    try {
                        return JSON.parse(el.textContent);
                    } catch (e) {
                        return { error: 'Invalid JSON', content: el.textContent.substring(0, 100) };
                    }
                });

            return {
                jsonLd: jsonLd
            };
        });

        console.log('--- DATA ---');
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
})();
