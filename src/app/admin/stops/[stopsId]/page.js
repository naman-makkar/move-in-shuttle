// src/app/admin/stops/[stopId]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
import { AlertCircle, MapPinIcon, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
	width: '100%',
	height: '300px',
	borderRadius: '0.5rem',
	marginTop: '1rem',
	marginBottom: '1rem'
};

const center = {
	lat: 28.4595, // Greater Noida approximate center
	lng: 77.5021
};

export default function EditStopPage() {
	const router = useRouter();
	const path = usePathname();
	const stopId = path.split('/').pop();

	const [stopName, setStopName] = useState('');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [isActive, setIsActive] = useState(true);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [mapCenter, setMapCenter] = useState(center);
	const [markerPosition, setMarkerPosition] = useState(null);

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
	});

	useEffect(() => {
		async function fetchStop() {
			try {
				setLoading(true);
				const res = await fetch(`/api/admin/stops/${stopId}`);
				if (!res.ok) {
					setError('Failed to load stop');
					return;
				}
				const data = await res.json();
				setStopName(data.stopName);
				const lat = data.location?.latitude || 0;
				const lng = data.location?.longitude || 0;
				setLatitude(lat);
				setLongitude(lng);
				setIsActive(data.isActive);

				// Set map center and marker if coordinates are valid
				if (lat && lng) {
					const position = { lat: Number(lat), lng: Number(lng) };
					setMapCenter(position);
					setMarkerPosition(position);
				}
			} catch (err) {
				setError('Error fetching stop');
			} finally {
				setLoading(false);
			}
		}
		fetchStop();
	}, [stopId]);

	useEffect(() => {
		// Update marker position when latitude or longitude changes
		if (latitude && longitude) {
			const newPosition = {
				lat: Number(latitude),
				lng: Number(longitude)
			};
			setMarkerPosition(newPosition);
			setMapCenter(newPosition);
		}
	}, [latitude, longitude]);

	async function handleUpdate(e) {
		e.preventDefault();
		setError('');
		setSubmitting(true);

		try {
			const res = await fetch(`/api/admin/stops/${stopId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					stopName,
					latitude: Number(latitude),
					longitude: Number(longitude),
					isActive
				})
			});

			if (res.ok) {
				router.push('/admin/stops');
			} else {
				const data = await res.json();
				setError(data.error || 'Error updating stop');
			}
		} catch (err) {
			setError('An unexpected error occurred');
		} finally {
			setSubmitting(false);
		}
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this stop?')) return;

		setSubmitting(true);
		try {
			const res = await fetch(`/api/admin/stops/${stopId}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				router.push('/admin/stops');
			} else {
				const data = await res.json();
				setError(data.error || 'Error deleting stop');
			}
		} catch (err) {
			setError('An unexpected error occurred during deletion');
		} finally {
			setSubmitting(false);
		}
	}

	const handleMapClick = (e) => {
		const clickedLat = e.latLng.lat();
		const clickedLng = e.latLng.lng();
		setLatitude(clickedLat);
		setLongitude(clickedLng);
		setMarkerPosition({ lat: clickedLat, lng: clickedLng });
	};

	return (
		<div className='container mx-auto py-10 max-w-md'>
			<Card className='border-slate-200 shadow-sm'>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<MapPinIcon className='h-5 w-5 text-slate-600' />
						<CardTitle className='text-2xl font-bold'>Edit Stop</CardTitle>
					</div>
					<CardDescription>
						Update or delete a shuttle stop location
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className='flex justify-center py-8'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800'></div>
						</div>
					) : (
						<form className='space-y-4'>
							<div className='grid gap-2'>
								<Label htmlFor='stopName'>Stop Name</Label>
								<Input
									id='stopName'
									type='text'
									value={stopName}
									onChange={(e) => setStopName(e.target.value)}
									placeholder='Enter stop name'
									required
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='grid gap-2'>
									<Label htmlFor='latitude'>Latitude</Label>
									<Input
										id='latitude'
										type='number'
										step='any'
										value={latitude}
										onChange={(e) => setLatitude(e.target.value)}
										placeholder='e.g. 28.4595'
										required
									/>
								</div>

								<div className='grid gap-2'>
									<Label htmlFor='longitude'>Longitude</Label>
									<Input
										id='longitude'
										type='number'
										step='any'
										value={longitude}
										onChange={(e) => setLongitude(e.target.value)}
										placeholder='e.g. 77.5021'
										required
									/>
								</div>
							</div>

							{isLoaded ? (
								<div className='mt-4'>
									<Label className='mb-2 block'>
										Location on Map (Click to update)
									</Label>
									<div className='border rounded-md overflow-hidden'>
										<GoogleMap
											mapContainerStyle={mapContainerStyle}
											center={mapCenter}
											zoom={14}
											onClick={handleMapClick}>
											{markerPosition && <Marker position={markerPosition} />}
										</GoogleMap>
									</div>
									<p className='text-xs text-muted-foreground mt-1'>
										Click on the map to update the coordinates
									</p>
								</div>
							) : (
								<div className='p-4 bg-slate-100 rounded-md text-center'>
									Loading map...
								</div>
							)}

							<div className='flex items-center space-x-2'>
								<Checkbox
									id='isActive'
									checked={isActive}
									onCheckedChange={setIsActive}
								/>
								<Label
									htmlFor='isActive'
									className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
									Active
								</Label>
							</div>

							{error && (
								<Alert variant='destructive'>
									<AlertCircle className='h-4 w-4' />
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
						</form>
					)}
				</CardContent>
				<CardFooter className='flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0'>
					<Button
						onClick={handleUpdate}
						className='w-full'
						disabled={
							loading || submitting || !stopName || !latitude || !longitude
						}>
						{submitting ? 'Updating...' : 'Update Stop'}
					</Button>
					<Button
						onClick={handleDelete}
						variant='destructive'
						className='w-full'
						disabled={loading || submitting}>
						<Trash2 className='h-4 w-4 mr-2' />
						Delete Stop
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
