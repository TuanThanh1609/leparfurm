import { createPlaywrightRouter, Dataset } from 'crawlee';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ page, enqueueLinks, log }) => {
    log.info(`Processing home/category: ${page.url()}`);

    // Enqueue product details
    await enqueueLinks({
        selector: '.pro-loop a',
        globs: ['https://namperfume.net/products/*'],
        label: 'DETAIL',
    });

    // Enqueue pagination
    await enqueueLinks({
        selector: '.pagination .next a',
        label: 'CATEGORY',
    });
});

router.addHandler('CATEGORY', async ({ page, enqueueLinks, log }) => {
    log.info(`Processing category: ${page.url()}`);

    await enqueueLinks({
        selector: '.pro-loop a',
        globs: ['https://namperfume.net/products/*'],
        label: 'DETAIL',
    });

    await enqueueLinks({
        selector: '.pagination .next a',
        label: 'CATEGORY',
    });
});

router.addHandler('DETAIL', async ({ page, log, request }) => {
    log.info(`Processing product: ${page.url()}`);

    const title = await page.textContent('h1');
    const price = await page.textContent('.product-price');
    const description = await page.textContent('.product-description');
    const brand = await page.textContent('.pro-vendor');

    // Images - usually main image
    const imageUrl = await page.getAttribute('#product-featured-image', 'src') || await page.getAttribute('.product-image-feature', 'src') || await page.getAttribute('img', 'src');

    const data = {
        url: request.url,
        title: title?.trim(),
        brand: brand?.trim(),
        price: price?.trim().replace(/[^0-9]/g, ''),
        imageUrl: imageUrl ? (imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl) : null,
        description: description?.trim().slice(0, 500) + '...',
        scrapedAt: new Date().toISOString()
    };

    await Dataset.pushData(data);
});
