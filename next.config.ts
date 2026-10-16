import type { NextConfig } from 'next';

// Static export: `next build` writes plain HTML/CSS/JS to out/.
// Everything runs in the browser, so any static host (Firebase Hosting) can serve it.
const nextConfig: NextConfig = {
	output: 'export',
	images: { unoptimized: true },
};

export default nextConfig;
