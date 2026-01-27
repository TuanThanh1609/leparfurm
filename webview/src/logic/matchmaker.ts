import type { Product } from '../components/Results';

export interface MatchResult {
    product: Product;
    score: number;
}

/**
 * Calculate match scores for products based on user answers.
 * Scoring: 
 *  - Tag Match: +2 points per matching tag
 *  - Budget Match: +3 points if price is within range
 *  - Luxury Brand Bonus: +1 for premium brands
 */
export function calculateMatchScores(
    answers: string[],
    products: Product[]
): MatchResult[] {
    // Extract budget answer (last question)
    const budgetAnswer = answers.find(a => ['Budget', 'Mid', 'Luxury'].includes(a));
    const vibeAnswers = answers.filter(a => !['Budget', 'Mid', 'Luxury'].includes(a));

    const scored = products.map(product => {
        let score = 0;

        // Tag matching (+2 per match)
        vibeAnswers.forEach(ans => {
            if (product.tags.includes(ans)) {
                score += 2;
            }
        });

        // Budget matching (+3 if within range)
        const price = product.price;
        if (budgetAnswer === 'Budget' && price < 1500000) {
            score += 3;
        } else if (budgetAnswer === 'Mid' && price >= 1000000 && price <= 3000000) {
            score += 3;
        } else if (budgetAnswer === 'Luxury' && price > 3000000) {
            score += 3;
        }

        // Luxury brand bonus (+1)
        const luxuryBrands = ['Chanel', 'Dior', 'Tom Ford', 'Creed', 'Guerlain'];
        if (luxuryBrands.some(b => product.brand.toLowerCase().includes(b.toLowerCase()))) {
            score += 1;
        }

        return { product, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored;
}

/**
 * Get top N matches from scored products.
 */
export function getTopMatches(
    answers: string[],
    products: Product[],
    topN: number = 5
): Product[] {
    const scored = calculateMatchScores(answers, products);
    return scored.slice(0, topN).map(s => s.product);
}
