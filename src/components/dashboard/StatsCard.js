'use client';

import { useState, useEffect } from 'react';

export default function StatsCard() {
	const [stats, setStats] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch stats from API
	useEffect(() => {
		const fetchStats = async () => {
			try {
				// Fetch from dashboard stats endpoint
				const response = await fetch('/dashboard/stats');

				if (!response.ok) {
					throw new Error('Failed to fetch dashboard stats');
				}

				const data = await response.json();
				setStats(data);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching stats:', error);
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (isLoading) {
		return (
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className='animate-pulse bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
						<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
						<div className='h-8 bg-gray-200 dark:bg-gray-700 rounded mb-1'></div>
						<div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
					</div>
				))}
			</div>
		);
	}

	if (!stats) {
		return (
			<div className='text-center py-4'>
				<p className='text-gray-500 dark:text-gray-400'>
					Could not load statistics at this time.
				</p>
			</div>
		);
	}

	// Format the next ride date
	const formatNextRideDate = () => {
		if (!stats.nextRide) return 'No upcoming rides';

		const date = new Date(stats.nextRide.date);
		const options = { weekday: 'short', month: 'short', day: 'numeric' };
		return `${date.toLocaleDateString('en-US', options)} at ${
			stats.nextRide.time
		}`;
	};

	return (
		<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
			<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
				<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
					Rides Completed
				</h3>
				<p className='text-2xl font-bold text-gray-900 dark:text-white'>
					{stats.ridesCompleted || 0}
				</p>
				<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
					All time
				</p>
			</div>

			<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
				<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
					Total Spent
				</h3>
				<p className='text-2xl font-bold text-gray-900 dark:text-white'>
					${stats.totalSpent?.toFixed(2) || '0.00'}
				</p>
				<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
					All time
				</p>
			</div>

			<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
				<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
					CO2 Saved
				</h3>
				<p className='text-2xl font-bold text-green-600 dark:text-green-400'>
					{stats.savedEmissions?.toFixed(1) || '0.0'} kg
				</p>
				<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
					Compared to driving
				</p>
			</div>

			<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
				<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
					Next Ride
				</h3>
				<p className='text-lg font-semibold text-gray-900 dark:text-white leading-tight'>
					{formatNextRideDate()}
				</p>
				<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
					{stats.nextRide ? 'On schedule' : 'Book now'}
				</p>
			</div>
		</div>
	);
}
