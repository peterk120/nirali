import localFont from 'next/font/local';

export const playfairDisplay = localFont({
    src: '../public/fonts/playfair-display-variable.woff2',
    variable: '--font-heading',
    display: 'swap',
    weight: 'variable',
});

export const dmSans = localFont({
    src: '../public/fonts/dm-sans-variable.woff2',
    variable: '--font-body',
    display: 'swap',
    weight: 'variable',
});
