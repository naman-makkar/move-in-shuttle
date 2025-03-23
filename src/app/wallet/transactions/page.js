'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WalletTransactionsPage() {
	const [transactions, setTransactions] = useState([]);
	const [balance, setBalance] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Fetch wallet and transaction data
		const fetchTransactions = async () => {
			try {
				// Use the correct endpoints
				const [walletResponse, transactionsResponse] = await Promise.all([
					fetch('/dashboard/wallet'),
					fetch('/wallet/transactions')
				]);

				if (!walletResponse.ok || !transactionsResponse.ok) {
					throw new Error('Failed to fetch wallet data');
				}

				const walletData = await walletResponse.json();
				const transactionsData = await transactionsResponse.json();

				setBalance(walletData.balance || 0);
				setTransactions(transactionsData.transactions || []);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setIsLoading(false);
			}
		};

		fetchTransactions();
	}, []);

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en-US', options);
	};

	return (
		<div className='container mx-auto p-6'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-3xl font-bold'>Wallet Transactions</h1>
				<Link
					href='/dashboard'
					className='text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300'>
					Back to Dashboard
				</Link>
			</div>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6'>
				<h2 className='text-xl font-semibold mb-4'>Current Balance</h2>
				<div className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-4 shadow-md mb-4'>
					<div className='text-3xl font-bold'>${balance.toFixed(2)}</div>
					<div className='text-sm opacity-80 mt-1'>Available for bookings</div>
				</div>
				<div className='flex gap-4'>
					<Link
						href='/wallet/add-funds'
						className='flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors text-center'>
						Add Funds
					</Link>
					<Link
						href='/wallet/withdraw'
						className='flex-1 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors text-center'>
						Withdraw
					</Link>
				</div>
			</div>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
				<h2 className='text-xl font-semibold mb-4'>Transaction History</h2>

				{isLoading ? (
					<div className='animate-pulse space-y-4'>
						{[...Array(5)].map((_, index) => (
							<div
								key={index}
								className='flex items-center p-3 border-b border-gray-200 dark:border-gray-700'>
								<div className='w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3'></div>
								<div className='flex-1'>
									<div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2'></div>
									<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4'></div>
								</div>
								<div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-20'></div>
							</div>
						))}
					</div>
				) : transactions.length > 0 ? (
					<div className='divide-y divide-gray-200 dark:divide-gray-700'>
						{transactions.map((transaction) => (
							<div
								key={transaction.id}
								className='py-4 flex items-center justify-between'>
								<div className='flex items-center'>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
											transaction.type === 'deposit'
												? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
												: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
										}`}>
										{transaction.type === 'deposit' ? (
											<svg
												xmlns='http://www.w3.org/2000/svg'
												width='20'
												height='20'
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
												width='20'
												height='20'
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
										<div className='text-sm text-gray-500 dark:text-gray-400'>
											{formatDate(transaction.date)}
										</div>
										{transaction.description && (
											<div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
												{transaction.description}
											</div>
										)}
									</div>
								</div>
								<div className='flex flex-col items-end'>
									<div
										className={`font-semibold ${
											transaction.type === 'deposit'
												? 'text-green-600 dark:text-green-400'
												: 'text-red-600 dark:text-red-400'
										}`}>
										{transaction.type === 'deposit' ? '+' : '-'}$
										{Math.abs(transaction.amount).toFixed(2)}
									</div>
									<div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
										{transaction.status}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='text-center py-8'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='mx-auto h-12 w-12 text-gray-400'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
							/>
						</svg>
						<p className='mt-2 text-gray-500 dark:text-gray-400'>
							No transactions found
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
