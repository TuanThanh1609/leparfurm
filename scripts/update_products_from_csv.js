import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../products_full.csv');
const jsonPath = path.join(__dirname, '../webview/src/data/products.json');

// specific CSV parser to handle quoted multi-line fields
function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            // End of field
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !insideQuotes) {
            // End of row
            if (char === '\r' && nextChar === '\n') i++; // Handle CRLF

            if (currentRow.length > 0 || currentField.length > 0) {
                currentRow.push(currentField);
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
            }
        } else {
            currentField += char;
        }
    }

    // Push last row if exists
    if (currentRow.length > 0 || currentField.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }

    return rows;
}

try {
    console.log('Reading files...');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('Parsing CSV...');
    const rows = parseCSV(csvContent);
    const headers = rows[0]; // id, title, description, ...

    // Log headers to debug
    console.log('Headers:', headers);

    const csvMap = new Map();
    // Assuming 'id' is index 0 and 'description' is index 2 based on file view
    // But let's find indices dynamically
    const idIndex = headers.findIndex(h => h.trim().toLowerCase() === 'id');
    const descIndex = headers.findIndex(h => h.trim().toLowerCase() === 'description');

    if (idIndex === -1 || descIndex === -1) {
        console.error('Could not find "id" or "description" columns in CSV');
        process.exit(1);
    }

    console.log(`Mapping ID (col ${idIndex}) to Description (col ${descIndex})...`);

    let matchCount = 0;

    // Start from 1 to skip header
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length <= Math.max(idIndex, descIndex)) continue;

        const id = row[idIndex].trim();
        const description = row[descIndex].trim();

        if (id && description) {
            csvMap.set(id, description);
        }
    }

    console.log(`Found ${csvMap.size} products in CSV.`);

    let updatedCount = 0;

    const updatedJson = jsonContent.map(product => {
        if (csvMap.has(product.id)) {
            const newDesc = csvMap.get(product.id);
            // Only update if description is different and not empty or "N/A"
            if (newDesc && newDesc.length > 10 && newDesc !== product.description) {
                product.description = newDesc;
                updatedCount++;
            }
        }
        return product;
    });

    console.log(`Updated ${updatedCount} products.`);

    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 2));
    console.log('Successfully wrote to products.json');

} catch (error) {
    console.error('Error:', error);
}
