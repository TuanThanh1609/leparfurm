export const TAG_RULES: Record<string, string[]> = {
    // Scent Profiles
    "Fresh": ["citrus", "cam", "chanh", "biển", "mát", "fresh", "aquatic", "clean", "bưởi"],
    "Floral": ["hoa", "floral", "rose", "jasmine", "huệ", "nhài", "sen", "bloom", "floral"],
    "Woody": ["gỗ", "woody", "sandalwood", "cedar", "đàn hương", "tuyết tùng", "vetiver"],
    "Sweet": ["ngọt", "sweet", "vanilla", "vani", "candy", "gourmand", "trái cây", "fruit", "honey", "mật ong"],
    "Spicy": ["cay", "spicy", "pepper", "tiêu", "warm", "ấm", "ginger", "gừng"],
    "Musky": ["xạ hương", "musk", "amber", "hổ phách", "da thuộc", "leather"],

    // Vibes / Occasions (Inferred)
    "Classy": ["chanel", "dior", "luxury", "sang", "classic", "elegant", "quý phái"],
    "Sexy": ["hẹn hò", "date", "night", "sexy", "quyến rũ", "gợi cảm", "thu hút"],
    "Office": ["nhẹ", "light", "office", "văn phòng", "clean", "sạch", "thanh lịch", "daily"],
    "Summer": ["mùa hè", "summer", "mát mẻ", "hot", "nắng"],
    "Winter": ["mùa đông", "winter", "ấm áp", "cold", "lạnh"]
};

export function getTags(text: string): string[] {
    const normalized = text.toLowerCase();
    const tags: Set<string> = new Set();

    for (const [tag, keywords] of Object.entries(TAG_RULES)) {
        if (keywords.some(k => normalized.includes(k))) {
            tags.add(tag);
        }
    }

    return Array.from(tags);
}
