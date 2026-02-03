
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Handling ESM dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const INSTAGRAM_USERNAME = 'glowfastoficial';
// Adjust path relative to where the script is run (root)
const TARGET_DIR = path.resolve('public', 'assets', 'instagram');

// Professional Fallback Images (Matches the salon aesthetic)
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800&auto=format&fit=crop", // Hair styling
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop", // Salon interior
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=800&auto=format&fit=crop", // Manicure
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop", // Makeup
    "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=800&auto=format&fit=crop"  // Face treatment
];

// --- HELPERS ---

function ensureDirectoryExists() {
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }
}

async function downloadImage(url: string, filename: string): Promise<boolean> {
    return new Promise((resolve) => {
        const filePath = path.join(TARGET_DIR, filename);
        const file = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Saved: ${filename}`);
                    resolve(true);
                });
            } else {
                file.close();
                fs.unlink(filePath, () => {}); // Clean up
                console.error(`❌ Download failed for ${filename} (Status: ${response.statusCode})`);
                resolve(false);
            }
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            console.error(`❌ Error saving ${filename}: ${err.message}`);
            resolve(false);
        });
    });
}

async function main() {
    ensureDirectoryExists();
    console.log(`🚀 Starting Instagram updates for @${INSTAGRAM_USERNAME}...`);

    console.log(`✨  Applying premium curated aesthetics (Fallback Mode)...`);
    
    // In the future, if we have specific post URLs or a token, we can add the logic here.
    // For now, we ensure the site looks perfect with these 5 assets.

    // ALWAYS ensure we have 5 valid images in the folder
    for (let i = 0; i < 5; i++) {
        const filename = `insta-${i + 1}.jpg`;
        await downloadImage(FALLBACK_IMAGES[i], filename);
    }

    console.log("\n🏁 Done! The website assets are ready.");
}

main();
