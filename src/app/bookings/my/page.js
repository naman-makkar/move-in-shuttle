//src/app/bookings/my/page.js
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	AlertCircle,
	CalendarIcon,
	Clock,
	MapPinIcon,
	Map as MapIcon,
	UserIcon,
	RefreshCwIcon
} from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
	GoogleMap,
	useJsApiLoader,
	Marker,
	InfoWindow,
	DirectionsRenderer
} from '@react-google-maps/api';

const mapContainerStyle = {
	width: '100%',
	height: '300px',
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

export default function MyBookingsPage() {
	const { data: session, status } = useSession();
	const [bookings, setBookings] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [directionsResponse, setDirectionsResponse] = useState(null);
	const [showingMap, setShowingMap] = useState(false);

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
		libraries: ["maps", "directions"]
	});

	// Fetch bookings when session is loaded
	useEffect(() => {
		if (status === 'authenticated' && session?.user?.userId) {
			fetchBookings();
		}
	}, [status, session]);

	async function fetchBookings() {
		if (status !== 'authenticated' || !session?.user?.userId) {
			setError('Please sign in to view your bookings');
			return;
		}

		try {
			setLoading(true);
			const userIdEncoded = encodeURIComponent(session.user.userId);
			const res = await fetch(`/api/bookings/my/${userIdEncoded}`);

			if (res.ok) {
				const data = await res.json();
				setBookings(data);
				if (data.length === 0) {
					setError('No bookings found for your account');
				} else {
					setError('');
				}
			} else {
				setError('Failed to fetch bookings');
			}
		} catch (err) {
			setError('Error fetching bookings');
		} finally {
			setLoading(false);
		}
	}

	// Define the handleCancelBooking function
	async function handleCancelBooking(bookingId) {
		if (!confirm('Are you sure you want to cancel this booking?')) return;

		try {
			setLoading(true);
			const res = await fetch('/api/bookings/cancel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ bookingId, userId: session.user.userId })
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
		} finally {
			setLoading(false);
		}
	}

	// Function to show route on map
	const showRoute = async (booking) => {
		if (!isLoaded) return;

		setSelectedBooking(booking);
		setShowingMap(true);

		// Get from and to coordinates from the stopLocations
		const fromCoords = stopLocations[booking.fromStop];
		const toCoords = stopLocations[booking.toStop];

		if (fromCoords && toCoords) {
			const directionsService = new google.maps.DirectionsService();

			const results = await directionsService.route({
				origin: fromCoords,
				destination: toCoords,
				travelMode: google.maps.TravelMode.DRIVING
			});

			setDirectionsResponse(results);
		}
	};

	// Show loading state while session is loading
	if (status === 'loading') {
		return (
			<div className='container mx-auto py-10 max-w-4xl text-center'>
				<p>Loading booking information...</p>
			</div>
		);
	}

	return (
		<div className='container mx-auto py-10 max-w-4xl'>
			<Card className='border-slate-200 shadow-sm'>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>My Bookings</CardTitle>
					<CardDescription>
						View and manage your shuttle bookings
					</CardDescription>
				</CardHeader>
				<CardContent>
					{status === 'unauthenticated' ? (
						<Alert
							variant='destructive'
							className='mb-6'>
							<AlertDescription>
								Please sign in to view your bookings
							</AlertDescription>
						</Alert>
					) : (
						<div className='flex justify-between items-center mb-6'>
							<div className='flex items-center gap-3'>
								<UserIcon className='h-5 w-5 text-slate-700' />
								<div>
									<div className='font-medium'>
										{session.user.name || 'Student'}
									</div>
									<div className='text-sm text-slate-500'>
										ID: {session.user.userId}
									</div>
								</div>
							</div>
							<Button
								variant='outline'
								size='sm'
								onClick={fetchBookings}
								disabled={loading}>
								<RefreshCwIcon className='h-4 w-4 mr-1' />
								Refresh
							</Button>
						</div>
					)}

					{error && (
						<Alert
							variant='destructive'
							className='mb-6'>
							<AlertCircle className='h-4 w-4' />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{showingMap && selectedBooking && isLoaded && (
						<div className='mb-6'>
							<div className='flex justify-between items-center mb-2'>
								<h3 className='font-medium'>
									Route Map: {selectedBooking.fromStop} to{' '}
									{selectedBooking.toStop}
								</h3>
								<Button
									variant='outline'
									size='sm'
									onClick={() => setShowingMap(false)}>
									Hide Map
								</Button>
							</div>
							<div className='border rounded-md overflow-hidden'>
								<GoogleMap
									mapContainerStyle={mapContainerStyle}
									center={center}
									zoom={12}>
									{directionsResponse && (
										<DirectionsRenderer directions={directionsResponse} />
									)}

									{!directionsResponse && (
										<>
											{selectedBooking.fromStop &&
												stopLocations[selectedBooking.fromStop] && (
													<Marker
														position={stopLocations[selectedBooking.fromStop]}
														icon='https://maps.google.com/mapfiles/ms/icons/green-dot.png'>
														<InfoWindow>
															<div>
																<p className='font-medium text-sm'>
																	From: {selectedBooking.fromStop}
																</p>
															</div>
														</InfoWindow>
													</Marker>
												)}

											{selectedBooking.toStop &&
												stopLocations[selectedBooking.toStop] && (
													<Marker
														position={stopLocations[selectedBooking.toStop]}
														icon='https://maps.google.com/mapfiles/ms/icons/red-dot.png'>
														<InfoWindow>
															<div>
																<p className='font-medium text-sm'>
																	To: {selectedBooking.toStop}
																</p>
															</div>
														</InfoWindow>
													</Marker>
												)}
										</>
									)}
								</GoogleMap>
							</div>
						</div>
					)}

					{loading ? (
						<div className='flex justify-center py-8'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800'></div>
						</div>
					) : bookings.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Booking Details</TableHead>
									<TableHead>Route</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{bookings.map((b) => (
									<TableRow key={b.bookingId}>
										<TableCell>
											<div className='font-medium'>{b.shuttleId}</div>
											<div className='text-sm text-muted-foreground'>
												ID: {b.bookingId}
											</div>
											<div className='flex items-center gap-1 text-sm text-muted-foreground'>
												<Clock className='h-3 w-3' />
												Fare: {b.fare} points
											</div>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-1'>
												<MapPinIcon className='h-3 w-3 text-slate-500' />
												From: {b.fromStop}
											</div>
											<div className='flex items-center gap-1 mt-1'>
												<MapPinIcon className='h-3 w-3 text-slate-500' />
												To: {b.toStop}
											</div>
											<Button
												variant='link'
												size='sm'
												className='p-0 h-6 mt-1'
												onClick={() => showRoute(b)}>
												<MapIcon className='h-3 w-3 mr-1' />
												View on map
											</Button>
										</TableCell>
										<TableCell>
											<Badge
												className={
													b.bookingStatus === 'confirmed'
														? 'bg-green-100 text-green-800 hover:bg-green-100'
														: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
												}>
												{b.bookingStatus}
											</Badge>
										</TableCell>
										<TableCell className='text-right'>
											{b.bookingStatus === 'confirmed' && (
												<Button
													variant='destructive'
													size='sm'
													onClick={() => handleCancelBooking(b.bookingId)}>
													Cancel
												</Button>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : status === 'authenticated' ? (
						<div className='text-center py-10 text-muted-foreground'>
							No bookings found for your account
						</div>
					) : (
						<div className='text-center py-10 text-muted-foreground'>
							Sign in to view your bookings
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
