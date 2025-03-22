//src/app/bookings/cancel/page.js
'use client';
import { useState } from 'react';
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle } from 'lucide-react';

export default function BookingCancellationPage() {
	const [bookingId, setBookingId] = useState('');
	const [userId, setUserId] = useState('');
	const [message, setMessage] = useState('');
	const [status, setStatus] = useState(null); // 'success' or 'error'

	async function handleCancel(e) {
		e.preventDefault();
		setMessage('');
		setStatus(null);

		try {
			const res = await fetch('/api/bookings/cancel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ bookingId, userId })
			});
			const data = await res.json();

			if (res.ok) {
				setStatus('success');
				setMessage(
					`Cancellation successful. Refund: ${data.refundAmount} points. New wallet balance: ${data.newWalletBalance}. Penalty applied: ${data.penalty}`
				);
			} else {
				setStatus('error');
				setMessage(`Error: ${data.error}`);
			}
		} catch (error) {
			setStatus('error');
			setMessage(`An unexpected error occurred: ${error.message}`);
		}
	}

	return (
		<div className='container mx-auto py-10 max-w-md'>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>Cancel Booking</CardTitle>
					<CardDescription>
						Enter your booking details to cancel a reservation
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleCancel}
						className='space-y-4'>
						<div className='grid gap-2'>
							<Label htmlFor='bookingId'>Booking ID</Label>
							<Input
								id='bookingId'
								type='text'
								value={bookingId}
								onChange={(e) => setBookingId(e.target.value)}
								placeholder='Enter your booking ID'
								required
							/>
						</div>
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

						{message && status && (
							<Alert
								variant={status === 'error' ? 'destructive' : 'default'}
								className='mt-4'>
								{status === 'success' ? (
									<Check className='h-4 w-4' />
								) : (
									<AlertCircle className='h-4 w-4' />
								)}
								<AlertTitle>
									{status === 'success' ? 'Success' : 'Error'}
								</AlertTitle>
								<AlertDescription>{message}</AlertDescription>
							</Alert>
						)}
					</form>
				</CardContent>
				<CardFooter>
					<Button
						onClick={handleCancel}
						className='w-full'
						variant='destructive'
						disabled={!bookingId || !userId}>
						Cancel Booking
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
