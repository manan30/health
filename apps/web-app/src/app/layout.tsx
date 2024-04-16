import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '~/components/ui/sonner';
import { cn } from '~/lib/utils';
import { Breadcrumbs } from './breadcrumbs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Health',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={cn(
					'min-h-screen bg-background antialiased',
					inter.className,
				)}
			>
				<Breadcrumbs />
				<main>{children}</main>
				<Toaster />
			</body>
		</html>
	);
}
