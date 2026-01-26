import { PlaywrightCrawler, Dataset } from 'crawlee';
import { router } from './routes';
import * as dotenv from 'dotenv';
dotenv.config();

const crawler = new PlaywrightCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this for better performance if you know the site is static, 
    // but Playwright is safer for modern sites.
    headless: process.env.HEADLESS === 'true',
});

console.log('Starting the scraper...');

await crawler.run(['https://namperfume.net/']);

console.log('Scraper finished.');
console.log('Exporting data to CSV...');
await Dataset.exportToCSV('products');
console.log('Done! Check products.csv in the storage/default/datasets directory (or root).');
