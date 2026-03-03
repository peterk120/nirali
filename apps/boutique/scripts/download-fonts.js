const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '../public/fonts');

if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
}

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error('Failed to download: ' + res.statusCode));
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

async function downloadFont(family, variableUrl, outName) {
    const destPath = path.join(FONTS_DIR, outName);
    await download(variableUrl, destPath);
    console.log(`Downloaded ${family} variable font -> ${destPath}`);
}

async function run() {
    // URLs for typical Latin subset variable fonts
    // Extracted dynamically from standard Google Fonts CSS queries for modern browsers

    // DM Sans Variable (Latin-ext and Latin) WOFF2
    const dmSansUrl = 'https://fonts.gstatic.com/s/dmsans/v14/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4c.woff2';

    // Playfair Display Variable (Latin-ext and Latin) WOFF2
    const playfairUrl = 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtMK.woff2';

    try {
        await downloadFont('DM Sans', dmSansUrl, 'dm-sans-variable.woff2');
        await downloadFont('Playfair Display', playfairUrl, 'playfair-display-variable.woff2');
        console.log('Fonts downloaded successfully');
    } catch (e) {
        console.error('Error downloading fonts', e);
    }
}

run();
