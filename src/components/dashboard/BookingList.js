'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BookingList({ limit = 3 }) {
	const [bookings, setBookings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch bookings from API
	useEffect(() => {
		const fetchBookings = async () => {
			try {
				// Real API call to bookings/my endpoint
				const response = await fetch(`/bookings/my?limit=${limit}`);

				if (!response.ok) {
					throw new Error('Failed to fetch bookings');
				}

				const data = await response.json();
				setBookings(data.bookings || []);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching bookings:', error);
				setIsLoading(false);
			}
		};

		fetchBookings();
	}, [limit]);

	// Helper function to format date
	const formatDate = (dateString) => {
		const options = { weekday: 'short', month: 'short', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en-US', options);
	};

	if (isLoading) {
		return (
			<div className='animate-pulse space-y-4'>
				{[...Array(limit)].map((_, index) => (
					<div
						key={index}
						className='bg-gray-100 dark:bg-gray-700 rounded-md p-4'>
						<div className='h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-3'></div>
						<div className='h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2'></div>
						<div className='h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3'></div>
					</div>
				))}
			</div>
		);
	}

	if (bookings.length === 0) {
		return (
			<div className='text-center py-6'>
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
						d='M19 9l-7 7-7-7'
					/>
				</svg>
				<p className='mt-2 text-gray-500 dark:text-gray-400'>
					No bookings found
				</p>
				<Link
					href='/bookings/request'
					className='mt-3 inline-block text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'>
					Book a ride
				</Link>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{bookings.map((booking) => (
				<Link
					href={`/bookings/my/${booking.id}`}
					key={booking.id}
					className='block'>
					<div className='bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow'>
						<div className='flex items-center justify-between mb-2'>
							<div className='font-semibold'>{booking.route}</div>
							<div
								className={`text-xs px-2 py-1 rounded-full ${
									booking.status === 'upcoming'
										? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
										: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
								}`}>
								{booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
							</div>
						</div>
						<div className='text-sm text-gray-600 dark:text-gray-300'>
							{formatDate(booking.date)} at {booking.time}
						</div>
						<div className='mt-2 flex items-center justify-between'>
							<div className='text-xs text-gray-500 dark:text-gray-400'>
								Booking ID: {booking.id}
							</div>
							<div className='font-medium'>
								${booking.price?.toFixed(2) || '0.00'}
							</div>
						</div>
					</div>
				</Link>
			))}

			<div className='text-center pt-2'>
				<Link
					href='/bookings/my'
					className='text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300'>
					View all bookings
				</Link>
			</div>
		</div>
	);
}
