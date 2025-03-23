// src/app/dashboard/page.js
'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
	const { data: session } = useSession();
	const isAdmin = session?.user?.role === 'admin';

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400'>
				Dashboard
			</h1>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6'>
				<h2 className='text-xl font-semibold mb-4'>Quick Links</h2>

				<div className='grid gap-4'>
					<Link
						href='/bookings/my'
						className='block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors'>
						<div className='flex items-center'>
							<div className='w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-4'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 text-indigo-600 dark:text-indigo-400'
									viewBox='0 0 20 20'
									fill='currentColor'>
									<path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
									<path
										fillRule='evenodd'
										d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<div className='flex flex-col'>
								<span className='font-medium text-gray-900 dark:text-white'>
									My Bookings
								</span>
								<span className='text-sm text-gray-500 dark:text-gray-400'>
									View all bookings
								</span>
							</div>
						</div>
					</Link>

					<Link
						href='/bookings/request'
						className='block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors'>
						<div className='flex items-center'>
							<div className='w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 text-green-600 dark:text-green-400'
									viewBox='0 0 20 20'
									fill='currentColor'>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<div className='flex flex-col'>
								<span className='font-medium text-gray-900 dark:text-white'>
									Book a Ride
								</span>
								<span className='text-sm text-gray-500 dark:text-gray-400'>
									Search & book new rides
								</span>
							</div>
						</div>
					</Link>

					{/* <Link
						href='/auth/profile'
						className='block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
						<div className='flex items-center'>
							<div className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 text-blue-600 dark:text-blue-400'
									viewBox='0 0 20 20'
									fill='currentColor'>
									<path
										fillRule='evenodd'
										d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<div className='flex flex-col'>
								<span className='font-medium text-gray-900 dark:text-white'>
									Profile
								</span>
								<span className='text-sm text-gray-500 dark:text-gray-400'>
									Update your details
								</span>
							</div>
						</div>
					</Link> */}

					<Link
						href='/dashboard/wallet'
						className='block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors'>
						<div className='flex items-center'>
							<div className='w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 text-purple-600 dark:text-purple-400'
									viewBox='0 0 20 20'
									fill='currentColor'>
									<path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
									<path
										fillRule='evenodd'
										d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<div className='flex flex-col'>
								<span className='font-medium text-gray-900 dark:text-white'>
									Wallet
								</span>
								<span className='text-sm text-gray-500 dark:text-gray-400'>
									View balance and transactions
								</span>
							</div>
						</div>
					</Link>
				</div>
			</div>

			{/* Admin Links - Only visible for admin users */}
			{isAdmin && (
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
					<h2 className='text-xl font-semibold mb-4'>Admin Links</h2>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<Link
							href='/admin/shuttles'
							className='block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
							<div className='flex items-center'>
								<div className='w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4 text-red-600 dark:text-red-400'
										viewBox='0 0 20 20'
										fill='currentColor'>
										<path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
										<path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h-2.25a1.25 1.25 0 110-2.5H12V6.49a1 1 0 00-1-1H4a1 1 0 00-1 1v.01a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0h1.05a1 1 0 100 2h-1.05a2.5 2.5 0 01-4.9 0H4a1 1 0 01-1-1V5zm12 8v-3h-2v1.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75V9H10a1 1 0 00-1 1v5a1 1 0 001 1h7a1 1 0 001-1v-4h-1v1.5a1.5 1.5 0 01-3 0V12z' />
									</svg>
								</div>
								<span className='font-medium text-gray-900 dark:text-white'>
									Manage Shuttles
								</span>
							</div>
						</Link>

						<Link
							href='/admin/stops'
							className='block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors'>
							<div className='flex items-center'>
								<div className='w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-3'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4 text-orange-600 dark:text-orange-400'
										viewBox='0 0 20 20'
										fill='currentColor'>
										<path
											fillRule='evenodd'
											d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
											clipRule='evenodd'
										/>
									</svg>
								</div>
								<span className='font-medium text-gray-900 dark:text-white'>
									Manage Stops
								</span>
							</div>
						</Link>

						<Link
							href='/admin/users'
							className='block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors'>
							<div className='flex items-center'>
								<div className='w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mr-3'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4 text-teal-600 dark:text-teal-400'
										viewBox='0 0 20 20'
										fill='currentColor'>
										<path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
									</svg>
								</div>
								<span className='font-medium text-gray-900 dark:text-white'>
									Manage Users
								</span>
							</div>
						</Link>

						<Link
							href='/admin/transactions'
							className='block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors'>
							<div className='flex items-center'>
								<div className='w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mr-3'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4 text-emerald-600 dark:text-emerald-400'
										viewBox='0 0 20 20'
										fill='currentColor'>
										<path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
										<path
											fillRule='evenodd'
											d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z'
											clipRule='evenodd'
										/>
									</svg>
								</div>
								<span className='font-medium text-gray-900 dark:text-white'>
									View Transactions
								</span>
							</div>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
