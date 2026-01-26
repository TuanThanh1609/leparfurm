import { chromium } from 'playwright';

(async () => {
    console.log('Launching browser...');
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        console.log('Navigating...');
        await page.goto('https://namperfume.net/');
        console.log('Title:', await page.title());
        await browser.close();
        console.log('Done.');
    } catch (e) {
        console.error('Error:', e);
    }
})();
