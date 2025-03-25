'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map component with no SSR
const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
	ssr: false,
	loading: () => (
		<div className='h-[500px] w-full bg-gray-100 flex items-center justify-center'>
			Loading Map...
		</div>
	)
});

// Extended NCR and nearby major cities boundaries
const REGION_BOUNDS = {
	// Format: [min_lon, min_lat, max_lon, max_lat]
	// Extended boundaries to include Greater Noida, Gurgaon, Chandigarh region
	viewbox: '76.2424,28.2089,77.9885,30.8894',
	center: [28.4506465, 77.5841978],
	regions: {
		delhi_ncr: {
			name: 'Delhi-NCR',
			bounds: '76.8424,28.4089,77.5885,28.8894'
		},
		greater_noida: {
			name: 'Greater Noida',
			bounds: '77.3500,28.4500,77.6200,28.6200'
		},
		gurgaon: {
			name: 'Gurgaon',
			bounds: '76.9200,28.3800,77.1500,28.5500'
		},
		chandigarh: {
			name: 'Chandigarh Region',
			bounds: '76.7000,30.6500,76.8500,30.8000'
		}
	}
};

// Enhanced search types for better local results
const SEARCH_TYPES = [
	'residential',
	'apartments',
	'suburb',
	'neighbourhood',
	'housing',
	'building',
	'place',
	'city',
	'town',
	'village',
	'commercial',
	'industrial'
];

// Common localities and areas for better search
const COMMON_AREAS = [
	'Sector',
	'Block',
	'Phase',
	'Extension',
	'Enclave',
	'Colony',
	'Society',
	'Apartment',
	'Complex',
	'Township',
	'Garden',
	'Vihar',
	'Nagar',
	'Puram'
];

// Add default styling for Leaflet
const leafletStyles = `
	.leaflet-container {
		height: 100%;
		width: 100%;
	}
`;

export default function TestingPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [position, setPosition] = useState(REGION_BOUNDS.center);
	const [map, setMap] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedRegion, setSelectedRegion] = useState('all');
	const searchTimeout = useRef(null);
	const [routeStops, setRouteStops] = useState([
		{ type: 'pickup', label: 'Pickup Location', coords: null },
		{ type: 'dropoff', label: 'Final Destination', coords: null }
	]);
	const [activeStopIndex, setActiveStopIndex] = useState(0);
	const [routeData, setRouteData] = useState(null);

	// Handle location selection from map click
	const handleLocationSelect = (coordinates) => {
		const [lat, lng] = coordinates;
		console.log('Selected coordinates:', { lat, lng });

		// Update the active stop with the selected coordinates
		setRouteStops((stops) =>
			stops.map((stop, index) =>
				index === activeStopIndex ? { ...stop, coords: { lat, lng } } : stop
			)
		);
	};

	// Function to remove a stop
	const removeStop = (index) => {
		if (index === 0 || index === routeStops.length - 1) return; // Don't remove pickup or final destination
		setRouteStops((stops) => stops.filter((_, i) => i !== index));
	};

	// Function to get stop status
	const getStopStatus = (stop) => {
		if (!stop.coords) return 'Not set';
		return (
			stop.address ||
			`${stop.coords.lat.toFixed(6)}, ${stop.coords.lng.toFixed(6)}`
		);
	};

	// Enhanced search function with better local context
	const enhanceSearchQuery = (query) => {
		// Check if query already contains common area terms
		const hasCommonTerm = COMMON_AREAS.some((term) =>
			query.toLowerCase().includes(term.toLowerCase())
		);

		// If no common term is found and query doesn't contain numbers (to avoid modifying sector numbers etc.)
		if (!hasCommonTerm && !/\d/.test(query)) {
			// Try to match with common areas
			const enhancedQueries = COMMON_AREAS.map((term) => `${query} ${term}`);
			return [query, ...enhancedQueries];
		}

		return [query];
	};

	// Fetch suggestions when search query changes
	useEffect(() => {
		const fetchSuggestions = async () => {
			if (!searchQuery.trim() || searchQuery.length < 2) {
				setSuggestions([]);
				return;
			}

			setIsLoading(true);
			try {
				const enhancedQueries = enhanceSearchQuery(searchQuery);
				let allResults = [];

				// Get the appropriate viewbox based on selected region
				const viewbox =
					selectedRegion === 'all'
						? REGION_BOUNDS.viewbox
						: REGION_BOUNDS.regions[selectedRegion]?.bounds ||
						  REGION_BOUNDS.viewbox;

				// Fetch results for each enhanced query
				for (const query of enhancedQueries) {
					const searchParams = new URLSearchParams({
						format: 'json',
						q: query,
						viewbox: viewbox,
						bounded: 1,
						limit: 5,
						countrycodes: 'in',
						addressdetails: 1,
						featuretype: SEARCH_TYPES.join(',')
					});

					const response = await fetch(
						`https://nominatim.openstreetmap.org/search?${searchParams.toString()}`
					);
					const data = await response.json();
					allResults = [...allResults, ...data];
				}

				// Remove duplicates and format results
				const uniqueResults = Array.from(
					new Set(allResults.map((r) => r.place_id))
				).map((id) => allResults.find((r) => r.place_id === id));

				// Process and format the suggestions
				const formattedSuggestions = uniqueResults.map((item) => {
					let displayName = item.display_name;
					let detailsText = '';

					if (item.address) {
						const parts = [];
						const details = [];

						// Primary location name
						if (item.address.residential) parts.push(item.address.residential);
						if (item.address.suburb) parts.push(item.address.suburb);
						if (item.address.neighbourhood)
							parts.push(item.address.neighbourhood);

						// Location details
						if (item.address.suburb) details.push(item.address.suburb);
						if (item.address.city || item.address.town) {
							details.push(item.address.city || item.address.town);
						}
						if (item.address.state) details.push(item.address.state);

						// Format display name and details
						if (parts.length > 0) {
							displayName = parts.join(', ');
						}
						detailsText = details.join(', ');
					}

					return {
						...item,
						display_name: displayName,
						details: detailsText
					};
				});

				setSuggestions(formattedSuggestions.slice(0, 7));
			} catch (error) {
				console.error('Error fetching suggestions:', error);
			} finally {
				setIsLoading(false);
			}
		};

		if (searchTimeout.current) {
			clearTimeout(searchTimeout.current);
		}

		searchTimeout.current = setTimeout(fetchSuggestions, 300);

		return () => {
			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current);
			}
		};
	}, [searchQuery, selectedRegion]);

	const handleSuggestionClick = (suggestion) => {
		const newPosition = [
			parseFloat(suggestion.lat),
			parseFloat(suggestion.lon)
		];
		setPosition(newPosition);
		setSearchQuery(suggestion.display_name);
		setSuggestions([]);

		// Update the active stop with the selected coordinates
		setRouteStops((stops) =>
			stops.map((stop, index) =>
				index === activeStopIndex
					? {
							...stop,
							coords: {
								lat: parseFloat(suggestion.lat),
								lng: parseFloat(suggestion.lon)
							},
							address: suggestion.display_name
					  }
					: stop
			)
		);

		if (map) {
			map.flyTo(newPosition, 16, {
				duration: 1.5
			});
		}
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		setIsLoading(true);
		try {
			const searchParams = new URLSearchParams({
				format: 'json',
				q: searchQuery,
				viewbox:
					selectedRegion === 'all'
						? REGION_BOUNDS.viewbox
						: REGION_BOUNDS.regions[selectedRegion]?.bounds ||
						  REGION_BOUNDS.viewbox,
				bounded: 1,
				limit: 1,
				countrycodes: 'in',
				addressdetails: 1
			});

			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?${searchParams.toString()}`
			);
			const data = await response.json();

			if (data.length > 0) {
				const { lat, lon, display_name } = data[0];
				const newPosition = [parseFloat(lat), parseFloat(lon)];
				setPosition(newPosition);
				setSuggestions([]);

				// Update the active stop with the selected coordinates
				setRouteStops((stops) =>
					stops.map((stop, index) =>
						index === activeStopIndex
							? {
									...stop,
									coords: { lat: parseFloat(lat), lng: parseFloat(lon) },
									address: display_name
							  }
							: stop
					)
				);

				if (map) {
					map.flyTo(newPosition, 16, {
						duration: 1.5
					});
				}
			} else {
				alert('Location not found. Please try a different search term.');
			}
		} catch (error) {
			console.error('Error searching location:', error);
			alert('Error searching for location. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	// Function to add a new stop
	const addStop = () => {
		if (routeStops.length >= 5) return; // Maximum 3 stops between pickup and dropoff
		const newStop = {
			type: 'stop',
			label: `Stop ${routeStops.length - 1}`,
			coords: null
		};
		setRouteStops((stops) => [
			...stops.slice(0, -1), // All except last
			newStop,
			...stops.slice(-1) // Last item (dropoff)
		]);
	};

	// Function to calculate route when stops change
	const calculateRoute = async (stops) => {
		const validStops = stops.filter((stop) => stop.coords);
		if (validStops.length < 2) return null; // Need at least pickup and dropoff

		try {
			// Prepare coordinates string for OSRM
			const coordinates = validStops
				.map((stop) => `${stop.coords.lng},${stop.coords.lat}`)
				.join(';');

			const response = await fetch(
				`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
			);
			const data = await response.json();

			if (data.code === 'Ok' && data.routes && data.routes[0]) {
				const route = data.routes[0];
				setRouteData({
					geometry: route.geometry,
					distance: route.distance,
					duration: route.duration
				});
				return route;
			}
		} catch (error) {
			console.error('Error calculating route:', error);
		}
		return null;
	};

	// Update route when stops change
	useEffect(() => {
		const validStops = routeStops.filter((stop) => stop.coords);
		if (validStops.length >= 2) {
			calculateRoute(validStops);
		} else {
			setRouteData(null);
		}
	}, [routeStops]);

	// Function to format duration
	const formatDuration = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
	};

	// Function to format distance
	const formatDistance = (meters) => {
		const km = (meters / 1000).toFixed(1);
		return `${km} km`;
	};

	return (
		<div className='p-4 flex'>
			{/* Route Selection Panel */}
			<div className='w-1/3 mr-4 bg-white rounded-lg shadow-lg p-4 z-10 h-[calc(500px+2rem)] overflow-auto'>
				<h2 className='text-xl font-bold mb-4'>Route Planner</h2>
				<div className='space-y-4'>
					{routeStops.map((stop, index) => (
						<div
							key={index}
							className={`p-4 rounded-lg border-2 cursor-pointer transition-all
								${activeStopIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
								${
									stop.type === 'pickup'
										? 'bg-green-50'
										: stop.type === 'dropoff'
										? 'bg-red-50'
										: 'bg-white'
								}`}
							onClick={() => {
								setActiveStopIndex(index);
								setSearchQuery('');
								setSuggestions([]);
							}}>
							<div className='flex justify-between items-center'>
								<div className='flex items-center'>
									{stop.type === 'pickup' && <span className='mr-2'>🚗</span>}
									{stop.type === 'stop' && <span className='mr-2'>🔵</span>}
									{stop.type === 'dropoff' && <span className='mr-2'>📍</span>}
									<span className='font-medium'>{stop.label}</span>
								</div>
								{stop.type === 'stop' && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											removeStop(index);
										}}
										className='text-red-500 hover:text-red-700'>
										✕
									</button>
								)}
							</div>
							<div className='mt-2 text-sm text-gray-500 break-words'>
								{getStopStatus(stop)}
							</div>
						</div>
					))}

					{routeStops.length < 5 && (
						<button
							onClick={addStop}
							className='w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors'>
							+ Add Stop
						</button>
					)}
				</div>

				{routeData && (
					<div className='mt-4 p-4 bg-gray-50 rounded-lg'>
						<h3 className='font-medium mb-2'>Route Summary</h3>
						<div className='space-y-2'>
							<div className='text-sm text-gray-600'>
								<span className='font-medium'>Distance:</span>{' '}
								{formatDistance(routeData.distance)}
							</div>
							<div className='text-sm text-gray-600'>
								<span className='font-medium'>Duration:</span>{' '}
								{formatDuration(routeData.duration)}
							</div>
							<div className='text-sm text-gray-600'>
								{routeStops.filter((stop) => stop.coords).length} locations
								selected
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Main Content */}
			<div className='flex-1'>
				<div className='mb-4 relative'>
					<form
						onSubmit={handleSearch}
						className='flex flex-col gap-2'>
						{/* Region selector */}
						<div className='flex gap-2 mb-2'>
							<select
								value={selectedRegion}
								onChange={(e) => setSelectedRegion(e.target.value)}
								className='p-2 border border-gray-300 rounded'>
								<option value='all'>All Regions</option>
								{Object.entries(REGION_BOUNDS.regions).map(([key, region]) => (
									<option
										key={key}
										value={key}>
										{region.name}
									</option>
								))}
							</select>
						</div>

						<div className='flex gap-2'>
							<div className='relative flex-1'>
								<input
									type='text'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder='Search for locations (e.g., sectors, societies, landmarks...)'
									className='w-full p-2 border border-gray-300 rounded'
								/>

								{/* Loading indicator */}
								{isLoading && (
									<div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
										<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
									</div>
								)}

								{/* Suggestions dropdown */}
								{suggestions.length > 0 && (
									<div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
										{suggestions.map((suggestion, index) => (
											<button
												key={index}
												type='button'
												onClick={() => handleSuggestionClick(suggestion)}
												className='w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none'>
												<div className='font-medium truncate'>
													{suggestion.display_name}
												</div>
												{suggestion.details && (
													<div className='text-sm text-gray-500 truncate'>
														{suggestion.details}
													</div>
												)}
											</button>
										))}
									</div>
								)}
							</div>

							<button
								type='submit'
								disabled={isLoading}
								className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'>
								Search
							</button>
						</div>
					</form>
				</div>

				{/* Map container */}
				<div
					style={{
						height: '500px',
						width: '100%',
						position: 'relative',
						border: '1px solid #ccc',
						borderRadius: '4px',
						overflow: 'hidden'
					}}>
					<MapWithNoSSR
						position={position}
						setMap={setMap}
						onLocationSelect={handleLocationSelect}
						routeStops={routeStops}
						routeData={routeData}
					/>
				</div>
			</div>
		</div>
	);
}
