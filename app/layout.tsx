import type { Metadata, Viewport } from 'next';
import { Geologica } from 'next/font/google';
import type { ReactNode } from 'react';
import Providers from '@/components/Providers';
import './globals.css';

const geologica = Geologica({ subsets: ['latin'], variable: '--font-geologica' });

const title = 'Somasekhar Praneeth | Full-Stack Developer';
const description = 'Somasekhar Praneeth is a full-stack developer from Tadepalligudem, Andhra Pradesh, building web applications, mobile apps and AI-powered products.';

export const metadata: Metadata = {
	title,
	description,
	authors: [{ name: 'Somasekhar Praneeth' }],
	openGraph: { type: 'website', title, description: 'Full-stack developer building web applications, mobile apps and AI-powered products.' },
};

export const viewport: Viewport = { themeColor: '#0b1230' };

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={geologica.variable}>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
