//src/app/bookings/my/page.js
'use client';
import { useState, useEffect } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MyBookingsPage() {
	const [userId, setUserId] = useState('');
	const [bookings, setBookings] = useState([]);
	const [error, setError] = useState('');

	async function fetchBookings() {
		try {
			const res = await fetch(`/api/bookings/my?userId=${userId}`);
			if (res.ok) {
				const data = await res.json();
				setBookings(data);
			} else {
				setError('Failed to fetch bookings');
			}
		} catch (err) {
			setError('Error fetching bookings');
		}
	}

	function handleFetch(e) {
		e.preventDefault();
		if (userId) {
			fetchBookings();
		}
	}

	// Define the handleCancelBooking function
	async function handleCancelBooking(bookingId) {
		if (!confirm('Are you sure you want to cancel this booking?')) return;

		try {
			// For testing, we prompt for userId; later, use session info.
			const currentUserId = prompt('Enter your userId for cancellation:');
			const res = await fetch('/api/bookings/cancel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ bookingId, userId: currentUserId })
			});
			const data = await res.json();
			if (res.ok) {
				alert(
					`Cancellation successful. Refund: ${data.refundAmount} points. New wallet balance: ${data.newWalletBalance}. Penalty: ${data.penalty}`
				);
				// Refresh bookings after cancellation
				fetchBookings();
			} else {
				alert(`Cancellation failed: ${data.error}`);
			}
		} catch (error) {
			alert('Error cancelling booking: ' + error);
		}
	}

	return (
		<div className='container mx-auto py-10'>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>My Bookings</CardTitle>
					<CardDescription>
						View and manage your shuttle bookings
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleFetch}
						className='space-y-4 mb-6'>
						<div className='grid gap-2'>
							<Label htmlFor='userId'>User ID</Label>
							<Input
								id='userId'
								type='text'
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								placeholder='Enter your user ID'
								required
							/>
						</div>
						<Button
							type='submit'
							className='w-full'>
							Fetch My Bookings
						</Button>
					</form>

					{error && <div className='text-destructive mb-4'>{error}</div>}

					{bookings.length > 0 ? (
						<div className='rounded-md border'>
							<div className='space-y-2 divide-y'>
								{bookings.map((b) => (
									<div
										key={b.bookingId}
										className='p-4'>
										<div className='grid md:grid-cols-2 gap-2'>
											<div>
												<p className='text-sm font-medium'>Booking ID</p>
												<p className='text-sm text-muted-foreground'>
													{b.bookingId}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium'>Shuttle</p>
												<p className='text-sm text-muted-foreground'>
													{b.shuttleId}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium'>From</p>
												<p className='text-sm text-muted-foreground'>
													{b.fromStop}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium'>To</p>
												<p className='text-sm text-muted-foreground'>
													{b.toStop}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium'>Fare</p>
												<p className='text-sm text-muted-foreground'>
													{b.fare} points
												</p>
											</div>
											<div>
												<p className='text-sm font-medium'>Status</p>
												<span
													className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
														b.bookingStatus === 'confirmed'
															? 'bg-green-100 text-green-800'
															: 'bg-yellow-100 text-yellow-800'
													}`}>
													{b.bookingStatus}
												</span>
											</div>
										</div>
										{b.bookingStatus === 'confirmed' && (
											<div className='mt-4'>
												<Button
													variant='destructive'
													size='sm'
													onClick={() => handleCancelBooking(b.bookingId)}>
													Cancel Booking
												</Button>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					) : (
						<div className='text-center py-10 text-muted-foreground'>
							{userId
								? 'No bookings found'
								: 'Enter your user ID to fetch bookings'}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
