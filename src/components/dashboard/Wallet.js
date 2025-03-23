'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Wallet() {
	const [walletData, setWalletData] = useState({
		balance: 0,
		transactions: []
	});
	const [isLoading, setIsLoading] = useState(true);

	// Fetch wallet data from API
	useEffect(() => {
		const fetchWalletData = async () => {
			try {
				// Fetch from the correct endpoint
				const response = await fetch('/dashboard/wallet');

				if (!response.ok) {
					throw new Error('Failed to fetch wallet data');
				}

				const data = await response.json();
				setWalletData(data);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching wallet data:', error);
				setIsLoading(false);
			}
		};

		fetchWalletData();
	}, []);

	if (isLoading) {
		return (
			<div className='animate-pulse'>
				<div className='h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3'></div>
				<div className='h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4'></div>
				<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4'></div>
				<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2'></div>
				<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2'></div>
			</div>
		);
	}

	return (
		<div>
			<div className='mb-6'>
				<h3 className='text-lg font-medium mb-2'>Current Balance</h3>
				<div className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-4 shadow-md'>
					<div className='text-2xl font-bold'>
						${walletData.balance?.toFixed(2) || '0.00'}
					</div>
					<div className='text-sm opacity-80 mt-1'>Available for bookings</div>
				</div>
			</div>

			<div>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-medium'>Recent Transactions</h3>
					<Link
						href='/wallet/transactions'
						className='text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300'>
						View all
					</Link>
				</div>

				{walletData.transactions && walletData.transactions.length > 0 ? (
					<div className='space-y-3'>
						{walletData.transactions.map((transaction) => (
							<div
								key={transaction.id}
								className='bg-gray-50 dark:bg-gray-700 rounded-md p-3 flex items-center justify-between'>
								<div className='flex items-center'>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
											transaction.type === 'deposit'
												? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
												: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
										}`}>
										{transaction.type === 'deposit' ? (
											<svg
												xmlns='http://www.w3.org/2000/svg'
												width='16'
												height='16'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'>
												<path d='m6 9 6 6 6-6' />
											</svg>
										) : (
											<svg
												xmlns='http://www.w3.org/2000/svg'
												width='16'
												height='16'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'>
												<path d='m6 15 6-6 6 6' />
											</svg>
										)}
									</div>
									<div>
										<div className='font-medium'>
											{transaction.type === 'deposit'
												? 'Deposit'
												: 'Booking Payment'}
										</div>
										<div className='text-xs text-gray-500 dark:text-gray-400'>
											{new Date(transaction.date).toLocaleDateString()}
										</div>
									</div>
								</div>
								<div
									className={`font-semibold ${
										transaction.type === 'deposit'
											? 'text-green-600 dark:text-green-400'
											: 'text-red-600 dark:text-red-400'
									}`}>
									{transaction.type === 'deposit' ? '+' : '-'}$
									{Math.abs(transaction.amount).toFixed(2)}
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='text-gray-500 dark:text-gray-400 text-center py-4'>
						No transactions found
					</p>
				)}

				<div className='mt-4'>
					<button
						onClick={() => (window.location.href = '/wallet/add-funds')}
						className='w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors'>
						Add Funds
					</button>
				</div>
			</div>
		</div>
	);
}
