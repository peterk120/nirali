import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, '../public/fonts');

if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
}

async function fetchGoogleCSS(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                // Modern Chrome UA to ensure we get woff2
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error('Failed to fetch CSS: ' + res.statusCode));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function downloadWoff2(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error('Failed to download font: ' + res.statusCode));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(dest);
            });
        }).on('error', reject);
    });
}

async function run() {
    try {
        console.log('Fetching DM Sans CSS...');
        const dmSansCss = await fetchGoogleCSS('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..500&display=swap');

        console.log('Fetching Playfair Display CSS...');
        const playfairCss = await fetchGoogleCSS('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..600&display=swap');

        // Extract urls from CSS
        const extractUrls = (css) => {
            const regex = /url\((https:\/\/[^)]+\.woff2)\)/g;
            const urls = [];
            let match;
            while ((match = regex.exec(css)) !== null) {
                urls.push(match[1]);
            }
            return urls;
        };

        const dmUrls = extractUrls(dmSansCss);
        const playfairUrls = extractUrls(playfairCss);

        if (dmUrls.length === 0 || playfairUrls.length === 0) {
            throw new Error('Could not find .woff2 URLs in Google Fonts response');
        }

        // Usually Google returns latin subset last or in a specific block. For safety we just grab the last one which is usually standard Latin subset.
        console.log(`Found ${dmUrls.length} DM Sans font variants. Downloading the primary latin variant...`);
        await downloadWoff2(dmUrls[dmUrls.length - 1], path.join(FONTS_DIR, 'dm-sans-variable.woff2'));

        console.log(`Found ${playfairUrls.length} Playfair Display font variants. Downloading the primary latin variant...`);
        await downloadWoff2(playfairUrls[playfairUrls.length - 1], path.join(FONTS_DIR, 'playfair-display-variable.woff2'));

        console.log('Fonts downloaded successfully!');
    } catch (e) {
        console.error('Error:', e);
    }
}

run();
