// src/app/admin/stops/new/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { AlertCircle, MapPinIcon, PlusCircle } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
	width: '100%',
	height: '300px',
	borderRadius: '0.5rem',
	marginTop: '1rem',
	marginBottom: '1rem'
};

// Center at Greater Noida
const center = {
	lat: 28.4595,
	lng: 77.5021
};

// Pre-defined locations for the stops in Greater Noida
const predefinedLocations = {
	pariChowk: { name: 'Pari Chowk', location: { lat: 28.4651, lng: 77.503 } },
	depot: { name: 'Depot', location: { lat: 28.4757, lng: 77.5047 } },
	bennettUniversity: {
		name: 'Bennett University',
		location: { lat: 28.4496, lng: 77.5858 }
	},
	delta1: { name: 'Delta 1', location: { lat: 28.4755, lng: 77.5044 } }
};

export default function NewStopPage() {
	const router = useRouter();
	const [stopName, setStopName] = useState('');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [markerPosition, setMarkerPosition] = useState(null);
	const [mapCenter, setMapCenter] = useState(center);

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
		libraries: ['maps', 'directions']
	});

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setSubmitting(true);

		try {
			const res = await fetch('/api/admin/stops', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					stopName,
					latitude: Number(latitude),
					longitude: Number(longitude)
				})
			});

			if (res.ok) {
				router.push('/admin/stops');
			} else {
				const data = await res.json();
				setError(data.error || 'Error creating stop');
			}
		} catch (err) {
			setError('An unexpected error occurred');
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

	const handlePredefinedLocation = (locationKey) => {
		const location = predefinedLocations[locationKey];
		if (location) {
			setStopName(location.name);
			setLatitude(location.location.lat);
			setLongitude(location.location.lng);
			setMarkerPosition(location.location);
			setMapCenter(location.location);
		}
	};

	return (
		<div className='container mx-auto py-10 max-w-md'>
			<Card className='border-slate-200 shadow-sm'>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<PlusCircle className='h-5 w-5 text-slate-600' />
						<CardTitle className='text-2xl font-bold'>
							Create New Stop
						</CardTitle>
					</div>
					<CardDescription>Add a new shuttle stop location</CardDescription>
				</CardHeader>
				<CardContent>
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

						<div className='space-y-2'>
							<Label>Quick Select Location</Label>
							<div className='grid grid-cols-2 gap-2'>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => handlePredefinedLocation('pariChowk')}>
									<MapPinIcon className='h-4 w-4 mr-1' />
									Pari Chowk
								</Button>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => handlePredefinedLocation('depot')}>
									<MapPinIcon className='h-4 w-4 mr-1' />
									Depot
								</Button>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => handlePredefinedLocation('bennettUniversity')}>
									<MapPinIcon className='h-4 w-4 mr-1' />
									Bennett University
								</Button>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => handlePredefinedLocation('delta1')}>
									<MapPinIcon className='h-4 w-4 mr-1' />
									Delta 1
								</Button>
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
										zoom={12}
										onClick={handleMapClick}>
										{markerPosition && <Marker position={markerPosition} />}
									</GoogleMap>
								</div>
								<p className='text-xs text-muted-foreground mt-1'>
									Click on the map to set the coordinates
								</p>
							</div>
						) : (
							<div className='p-4 bg-slate-100 rounded-md text-center'>
								Loading map...
							</div>
						)}

						{error && (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
					</form>
				</CardContent>
				<CardFooter>
					<Button
						onClick={handleSubmit}
						className='w-full'
						disabled={submitting || !stopName || !latitude || !longitude}>
						{submitting ? 'Creating...' : 'Create Stop'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
