// src/app/dashboard/page.js
import { Suspense } from 'react';

export default function DashboardPage() {
	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-4'>Dashboard</h1>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6'>
				<h2 className='text-xl font-semibold mb-3'>Account Overview</h2>
				<p className='text-gray-700 dark:text-gray-300 mb-4'>
					Welcome to your dashboard. Here you can view your wallet balance and
					manage your bookings.
				</p>

				<Suspense
					fallback={
						<div className='text-gray-500'>Loading wallet information...</div>
					}>
					{/* Wallet component will go here in the future */}
					<div className='p-4 border border-dashed border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700'>
						<p className='text-gray-500 dark:text-gray-400'>
							(Implement session management and wallet details retrieval in the
							future.)
						</p>
					</div>
				</Suspense>
			</div>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
				<h2 className='text-xl font-semibold mb-3'>Recent Bookings</h2>
				<p className='text-gray-500 dark:text-gray-400'>
					No recent bookings found.
				</p>
			</div>
		</div>
	);
}
