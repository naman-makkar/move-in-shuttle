'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
	const [isEditing, setIsEditing] = useState(false);

	// Placeholder user data - in a real app, this would come from your user authentication context
	const [userData, setUserData] = useState({
		name: 'John Doe',
		email: 'john.doe@example.com',
		phone: '+1 (555) 123-4567',
		address: '123 Main St, Anytown, USA',
		preferences: {
			notifications: true,
			emailUpdates: false
		}
	});

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name.includes('.')) {
			const [parent, child] = name.split('.');
			setUserData({
				...userData,
				[parent]: {
					...userData[parent],
					[child]: type === 'checkbox' ? checked : value
				}
			});
		} else {
			setUserData({
				...userData,
				[name]: type === 'checkbox' ? checked : value
			});
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would send the updated user data to your backend
		console.log('Updated user data:', userData);
		setIsEditing(false);
		// Show a success message
		alert('Profile updated successfully!');
	};

	return (
		<div className='container mx-auto p-6'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-3xl font-bold'>My Profile</h1>
				<Link
					href='/dashboard'
					className='text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300'>
					Back to Dashboard
				</Link>
			</div>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6'>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-xl font-semibold'>Personal Information</h2>
					<button
						onClick={handleEditToggle}
						className={`px-4 py-2 rounded-md ${
							isEditing
								? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
								: 'bg-indigo-600 text-white hover:bg-indigo-700'
						}`}>
						{isEditing ? 'Cancel' : 'Edit Profile'}
					</button>
				</div>

				{isEditing ? (
					<form onSubmit={handleSubmit}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
							<div>
								<label
									htmlFor='name'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
									Full Name
								</label>
								<input
									type='text'
									id='name'
									name='name'
									value={userData.name}
									onChange={handleChange}
									className='w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600'
									required
								/>
							</div>
							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
									Email Address
								</label>
								<input
									type='email'
									id='email'
									name='email'
									value={userData.email}
									onChange={handleChange}
									className='w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600'
									required
								/>
							</div>
							<div>
								<label
									htmlFor='phone'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
									Phone Number
								</label>
								<input
									type='tel'
									id='phone'
									name='phone'
									value={userData.phone}
									onChange={handleChange}
									className='w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600'
								/>
							</div>
							<div>
								<label
									htmlFor='address'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
									Address
								</label>
								<input
									type='text'
									id='address'
									name='address'
									value={userData.address}
									onChange={handleChange}
									className='w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600'
								/>
							</div>
						</div>

						<div className='mb-6'>
							<h3 className='text-lg font-medium mb-3'>Preferences</h3>
							<div className='space-y-3'>
								<div className='flex items-center'>
									<input
										type='checkbox'
										id='notifications'
										name='preferences.notifications'
										checked={userData.preferences.notifications}
										onChange={handleChange}
										className='mr-2'
									/>
									<label
										htmlFor='notifications'
										className='text-sm text-gray-700 dark:text-gray-300'>
										Enable push notifications
									</label>
								</div>
								<div className='flex items-center'>
									<input
										type='checkbox'
										id='emailUpdates'
										name='preferences.emailUpdates'
										checked={userData.preferences.emailUpdates}
										onChange={handleChange}
										className='mr-2'
									/>
									<label
										htmlFor='emailUpdates'
										className='text-sm text-gray-700 dark:text-gray-300'>
										Receive email updates about new features and promotions
									</label>
								</div>
							</div>
						</div>

						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'>
								Save Changes
							</button>
						</div>
					</form>
				) : (
					<div className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Full Name
								</h3>
								<p className='mt-1 text-gray-900 dark:text-gray-100'>
									{userData.name}
								</p>
							</div>
							<div>
								<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Email Address
								</h3>
								<p className='mt-1 text-gray-900 dark:text-gray-100'>
									{userData.email}
								</p>
							</div>
							<div>
								<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Phone Number
								</h3>
								<p className='mt-1 text-gray-900 dark:text-gray-100'>
									{userData.phone}
								</p>
							</div>
							<div>
								<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Address
								</h3>
								<p className='mt-1 text-gray-900 dark:text-gray-100'>
									{userData.address}
								</p>
							</div>
						</div>

						<div>
							<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
								Preferences
							</h3>
							<ul className='list-disc pl-5 text-gray-900 dark:text-gray-100'>
								<li>
									{userData.preferences.notifications
										? 'Push notifications enabled'
										: 'Push notifications disabled'}
								</li>
								<li>
									{userData.preferences.emailUpdates
										? 'Email updates enabled'
										: 'Email updates disabled'}
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
				<h2 className='text-xl font-semibold mb-6'>Account Security</h2>
				<div className='space-y-4'>
					<button className='w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-left'>
						Change Password
					</button>
					<button className='w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-left'>
						Enable Two-Factor Authentication
					</button>
				</div>
			</div>
		</div>
	);
}
