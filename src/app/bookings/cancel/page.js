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
import { Check, AlertCircle, TicketX, MapPinIcon } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
	width: '100%',
	height: '250px',
	borderRadius: '0.5rem'
};

// Center at Greater Noida
const center = {
	lat: 28.4595,
	lng: 77.5021
};

// Pre-defined locations for the stops in Greater Noida
const stopLocations = {
	'Pari Chowk': { lat: 28.4651, lng: 77.503 },
	Depot: { lat: 28.4757, lng: 77.5047 },
	'Bennett University': { lat: 28.4496, lng: 77.5858 },
	'Delta 1': { lat: 28.4755, lng: 77.5044 }
};

export default function BookingCancellationPage() {
	const [bookingId, setBookingId] = useState('');
	const [userId, setUserId] = useState('');
	const [message, setMessage] = useState('');
	const [status, setStatus] = useState(null); // 'success' or 'error'
	const [loading, setLoading] = useState(false);
	const [bookingDetails, setBookingDetails] = useState(null);
	const [fetchingDetails, setFetchingDetails] = useState(false);

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
		libraries: ['maps', 'directions']
	});

	async function handleCancel(e) {
		e.preventDefault();
		setMessage('');
		setStatus(null);
		setLoading(true);

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
				setBookingDetails(null); // Clear booking details after successful cancellation
			} else {
				setStatus('error');
				setMessage(`Error: ${data.error}`);
			}
		} catch (error) {
			setStatus('error');
			setMessage(`An unexpected error occurred: ${error.message}`);
		} finally {
			setLoading(false);
		}
	}

	const fetchBookingDetails = async () => {
		if (!bookingId || !userId) return;

		setFetchingDetails(true);
		try {
			// This is a mock API call - replace with actual endpoint when available
			const res = await fetch(
				`/api/bookings/details?bookingId=${bookingId}&userId=${userId}`
			);
			if (res.ok) {
				const data = await res.json();
				setBookingDetails(data);
			} else {
				setStatus('error');
				setMessage(
					'Could not fetch booking details. Please check your booking ID and user ID.'
				);
			}
		} catch (error) {
			setStatus('error');
			setMessage('Failed to load booking details');
		} finally {
			setFetchingDetails(false);
		}
	};

	return (
		<div className='container mx-auto py-10 max-w-md'>
			<Card className='border-slate-200 shadow-sm'>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<TicketX className='h-5 w-5 text-destructive' />
						<CardTitle className='text-2xl font-bold'>Cancel Booking</CardTitle>
					</div>
					<CardDescription>
						Enter your booking details to cancel a reservation
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							fetchBookingDetails();
						}}
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

						<Button
							type='submit'
							variant='outline'
							className='w-full'
							disabled={!bookingId || !userId || fetchingDetails}>
							{fetchingDetails ? 'Fetching Details...' : 'Verify Booking'}
						</Button>

						{bookingDetails && (
							<div className='mt-4 border rounded-md p-4'>
								<h3 className='font-medium mb-2'>Booking Details</h3>
								<div className='space-y-2 text-sm'>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Route:</span>
										<span className='font-medium'>
											{bookingDetails.fromStop} → {bookingDetails.toStop}
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Shuttle:</span>
										<span>{bookingDetails.shuttleId}</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Fare:</span>
										<span>{bookingDetails.fare} points</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Status:</span>
										<span
											className={`px-2 py-0.5 rounded-full text-xs ${
												bookingDetails.bookingStatus === 'confirmed'
													? 'bg-green-100 text-green-800'
													: 'bg-yellow-100 text-yellow-800'
											}`}>
											{bookingDetails.bookingStatus}
										</span>
									</div>
								</div>

								{isLoaded &&
									stopLocations[bookingDetails.fromStop] &&
									stopLocations[bookingDetails.toStop] && (
										<div className='mt-4'>
											<Label className='mb-2 block'>Route Map</Label>
											<GoogleMap
												mapContainerStyle={mapContainerStyle}
												center={stopLocations[bookingDetails.fromStop]}
												zoom={13}>
												<Marker
													position={stopLocations[bookingDetails.fromStop]}
													icon='https://maps.google.com/mapfiles/ms/icons/green-dot.png'
												/>
												<Marker
													position={stopLocations[bookingDetails.toStop]}
													icon='https://maps.google.com/mapfiles/ms/icons/red-dot.png'
												/>
											</GoogleMap>
											<div className='flex justify-between text-xs text-muted-foreground mt-2'>
												<div className='flex items-center'>
													<div className='w-3 h-3 rounded-full bg-green-500 mr-1'></div>
													From: {bookingDetails.fromStop}
												</div>
												<div className='flex items-center'>
													<div className='w-3 h-3 rounded-full bg-red-500 mr-1'></div>
													To: {bookingDetails.toStop}
												</div>
											</div>
										</div>
									)}
							</div>
						)}

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
						disabled={
							!bookingId ||
							!userId ||
							loading ||
							!bookingDetails ||
							bookingDetails?.bookingStatus !== 'confirmed'
						}>
						{loading ? 'Processing...' : 'Cancel Booking'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
