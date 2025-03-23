import './globals.css'; // if you have global styles
import { Inter } from 'next/font/google';
import Navigation from '@/components/navigation';
import { cn } from '@/lib/utils';
import SessionProviderWrapper from '@/components/sessionProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'University Shuttle Service',
	description: 'Campus transportation system for students, faculty and staff'
};

// This function gets called for each request/page load
export default function RootLayout({ children, session }) {
	return (
		<html
			lang='en'
			suppressHydrationWarning>
			<body
				className={cn(
					'min-h-screen bg-white font-sans antialiased',
					inter.className
				)}>
				<div className='relative flex min-h-screen flex-col'>
					<SessionProviderWrapper session={session}>
						<Navigation />
						<main className='flex-1'>{children}</main>
					</SessionProviderWrapper>
				</div>
			</body>
		</html>
	);
}
