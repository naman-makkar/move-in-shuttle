'use client';
import { useState, useEffect } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MapPin, Navigation, Bus } from 'lucide-react';
import {
	GoogleMap,
	useJsApiLoader,
	Marker,
	InfoWindow,
	DirectionsRenderer
} from '@react-google-maps/api';

const mapContainerStyle = {
	width: '100%',
	height: '500px',
	borderRadius: '0.5rem'
};

// Center at Greater Noida
const center = {
	lat: 28.4595,
	lng: 77.5021
};

export default function RoutesPage() {
	const [routes, setRoutes] = useState([]);
	const [stops, setStops] = useState({});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [selectedRoute, setSelectedRoute] = useState(null);
	const [directions, setDirections] = useState(null);
	const [mapKey, setMapKey] = useState(Date.now()); // For map rerender when needed

	const { isLoaded, loadError } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
	});

	// Fetch routes from API
	useEffect(() => {
		const fetchRoutes = async () => {
			try {
				setLoading(true);
				const res = await fetch('/api/routes');

				if (!res.ok) {
					throw new Error('Failed to fetch routes');
				}

				const data = await res.json();
				setRoutes(data.routes);

				// Convert stops array to an object for easier access
				const stopsObj = {};
				data.stops.forEach((stop) => {
					stopsObj[stop.name] = stop.coordinates;
				});
				setStops(stopsObj);

				setLoading(false);
			} catch (error) {
				console.error('Error fetching routes:', error);
				setError('Failed to load routes. Please try again later.');
				setLoading(false);
			}
		};

		fetchRoutes();
	}, []);

	const showRoute = (route) => {
		if (!window.google || !isLoaded) return;

		setSelectedRoute(route);

		// Clear previous directions
		setDirections(null);

		const directionsService = new window.google.maps.DirectionsService();

		directionsService.route(
			{
				origin: route.fromCoordinates,
				destination: route.toCoordinates,
				travelMode: window.google.maps.TravelMode.DRIVING
			},
			(result, status) => {
				if (status === window.google.maps.DirectionsStatus.OK) {
					setDirections(result);
				} else {
					setError(`Could not display directions: ${status}`);
				}
			}
		);
	};

	const handleRouteCardClick = (route) => {
		showRoute(route);
		// Force map rerender to ensure directions display properly
		setMapKey(Date.now());
	};

	const RouteCard = ({ route }) => (
		<div
			className={`border rounded-md p-4 cursor-pointer transition-all ${
				selectedRoute?.id === route.id
					? 'border-primary ring-2 ring-primary/20'
					: 'border-gray-200 hover:border-gray-300'
			}`}
			onClick={() => handleRouteCardClick(route)}>
			<div className='flex items-center space-x-2 mb-2'>
				<Bus className='h-4 w-4 text-primary' />
				<h3 className='font-medium'>{route.name}</h3>
			</div>

			<div className='space-y-2 text-sm'>
				<div className='flex items-center gap-2'>
					<MapPin className='h-3 w-3 text-green-600' />
					<span className='text-muted-foreground'>From:</span>
					<span className='font-medium'>{route.from}</span>
				</div>

				<div className='flex items-center gap-2'>
					<MapPin className='h-3 w-3 text-red-600' />
					<span className='text-muted-foreground'>To:</span>
					<span className='font-medium'>{route.to}</span>
				</div>

				<div className='grid grid-cols-3 gap-2 text-xs mt-2'>
					<div className='bg-gray-50 p-1 rounded text-center'>
						<span className='block text-muted-foreground'>Price</span>
						<span className='font-medium'>{route.price} pts</span>
					</div>

					<div className='bg-gray-50 p-1 rounded text-center'>
						<span className='block text-muted-foreground'>Duration</span>
						<span className='font-medium'>{route.duration}</span>
					</div>

					<div className='bg-gray-50 p-1 rounded text-center'>
						<span className='block text-muted-foreground'>Distance</span>
						<span className='font-medium'>{route.distance}</span>
					</div>
				</div>
			</div>
		</div>
	);

	if (loadError) {
		return (
			<div className='container mx-auto py-10'>
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>Failed to load Google Maps API</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='container mx-auto py-10'>
			<Card className='border-slate-200 shadow-sm'>
				<CardHeader className='pb-4'>
					<div className='flex items-center gap-2'>
						<Navigation className='h-5 w-5 text-primary' />
						<CardTitle className='text-2xl font-bold'>Shuttle Routes</CardTitle>
					</div>
					<CardDescription>
						View available shuttle routes in Greater Noida
					</CardDescription>
				</CardHeader>

				<CardContent>
					{loading ? (
						<div className='flex justify-center items-center h-40'>
							<p className='text-muted-foreground'>Loading routes...</p>
						</div>
					) : error ? (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					) : (
						<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
							<div className='lg:col-span-1 space-y-4'>
								<h3 className='font-medium text-sm text-muted-foreground mb-2'>
									Select a route to view
								</h3>
								{routes.length > 0 ? (
									routes.map((route) => (
										<RouteCard
											key={route.id}
											route={route}
										/>
									))
								) : (
									<p className='text-muted-foreground'>No routes available</p>
								)}

								<div className='mt-4'>
									<Button
										variant='outline'
										onClick={() => {
											setSelectedRoute(null);
											setDirections(null);
										}}
										disabled={!selectedRoute}
										className='w-full'>
										Clear Route
									</Button>
								</div>
							</div>

							<div className='lg:col-span-3'>
								{isLoaded ? (
									<div className='w-full h-full'>
										<GoogleMap
											key={mapKey}
											mapContainerStyle={mapContainerStyle}
											center={center}
											zoom={12}>
											{/* Display all stops */}
											{Object.entries(stops).map(([name, location]) => (
												<Marker
													key={name}
													position={location}
													title={name}
													icon={{
														url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
														scaledSize: new window.google.maps.Size(32, 32)
													}}
												/>
											))}

											{/* Show directions for selected route */}
											{directions && (
												<DirectionsRenderer directions={directions} />
											)}

											{selectedRoute && !directions && (
												<>
													<Marker
														position={selectedRoute.fromCoordinates}
														icon={{
															url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
															scaledSize: new window.google.maps.Size(32, 32)
														}}
													/>
													<Marker
														position={selectedRoute.toCoordinates}
														icon={{
															url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
															scaledSize: new window.google.maps.Size(32, 32)
														}}
													/>
												</>
											)}
										</GoogleMap>

										{selectedRoute && (
											<div className='mt-4 p-4 border rounded-md'>
												<h3 className='font-medium'>
													{selectedRoute.name} Route Details
												</h3>
												<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-2'>
													<div>
														<p className='text-xs text-muted-foreground'>
															From
														</p>
														<p className='font-medium'>{selectedRoute.from}</p>
													</div>
													<div>
														<p className='text-xs text-muted-foreground'>To</p>
														<p className='font-medium'>{selectedRoute.to}</p>
													</div>
													<div>
														<p className='text-xs text-muted-foreground'>
															Distance
														</p>
														<p className='font-medium'>
															{selectedRoute.distance}
														</p>
													</div>
													<div>
														<p className='text-xs text-muted-foreground'>
															Duration
														</p>
														<p className='font-medium'>
															{selectedRoute.duration}
														</p>
													</div>
												</div>

												{selectedRoute.schedule &&
													selectedRoute.schedule.length > 0 && (
														<div className='mt-4'>
															<p className='text-xs text-muted-foreground'>
																Today&apos;s Schedule
															</p>
															<div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1'>
																{selectedRoute.schedule.map((time, index) => (
																	<div
																		key={index}
																		className='border rounded p-2 text-center text-sm'>
																		<span className='font-medium'>
																			{time.departure}
																		</span>
																		<span className='text-muted-foreground mx-1'>
																			→
																		</span>
																		<span className='font-medium'>
																			{time.arrival}
																		</span>
																	</div>
																))}
															</div>
														</div>
													)}

												<div className='mt-4'>
													<p className='text-xs text-muted-foreground'>
														Available Shuttles
													</p>
													<div className='flex gap-2 mt-1'>
														{selectedRoute.shuttles.map((shuttle) => (
															<Button
																key={shuttle}
																variant='outline'
																size='sm'
																className='h-7'>
																{shuttle}
															</Button>
														))}
													</div>
												</div>

												<div className='mt-4'>
													<Button
														variant='default'
														className='w-full'
														asChild>
														<a href='/bookings'>Book This Route</a>
													</Button>
												</div>
											</div>
										)}
									</div>
								) : (
									<div className='flex justify-center items-center h-[500px] border rounded-md'>
										<p className='text-muted-foreground'>Loading map...</p>
									</div>
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
