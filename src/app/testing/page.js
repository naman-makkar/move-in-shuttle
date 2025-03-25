'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, X, Search, ChevronRight, CornerDownRight, CircleDot, Clock, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './map.css';

// Dynamically import the map component with no SSR
const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
	ssr: false,
	loading: () => (
		<div className='h-full w-full bg-gray-100 flex items-center justify-center rounded-lg'>
			<div className="loading-spinner"></div>
			<span className="ml-3 text-gray-600">Loading Map...</span>
		</div>
	)
});

// Predefined stops for the Bennett University area
const predefinedStops = [
	{ name: "A block", latitude: 28.450184, longitude: 77.584425, address: "A block" },
	{ name: "B block", latitude: 28.450151, longitude: 77.584286, address: "B block" },
	{ name: "Sports Complex", latitude: 28.45018041097755, longitude: 77.5871834486546, address: "Sports Complex" },
	{ name: "N block", latitude: 28.448933, longitude: 77.583559, address: "N block" },
	{ name: "P block", latitude: 28.449785, longitude: 77.582806, address: "P block" },
	{ name: "Cafeteria", latitude: 28.450490, longitude: 77.586394, address: "Cafeteria" }
];

// Main page component
export default function BookingPage() {
	// State for form data
	const [formData, setFormData] = useState({
		pickup: null,
		dropoff: null,
		stops: []
	});
	
	// UI state
	const [fare, setFare] = useState(0);
	const [balance, setBalance] = useState(() => {
		if (typeof window !== 'undefined') {
			const savedBalance = localStorage.getItem('walletBalance');
			return savedBalance ? parseFloat(savedBalance) : 250.00;
		}
		return 250.00;
	});
	
	// Store the pickup/dropoff mode in a ref to ensure it's always up-to-date
	const [isSettingPickup, setIsSettingPickup] = useState(true);
	const isSettingPickupRef = useRef(true);
	
	// Update the ref whenever the state changes
	useEffect(() => {
		isSettingPickupRef.current = isSettingPickup;
	}, [isSettingPickup]);
	
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	
	// Map references
	const mapRef = useRef(null);

	// Calculate fare when pickup and dropoff change
	useEffect(() => {
		if (formData.pickup && formData.dropoff) {
			const R = 6371; // Radius of Earth in km
			let totalDistance = 0;

			// Haversine formula to calculate distance between two points
			const calculateDistance = (from, to) => {
				const lat1 = from.latitude * Math.PI / 180;
				const lat2 = to.latitude * Math.PI / 180;
				const dLat = (to.latitude - from.latitude) * Math.PI / 180;
				const dLon = (to.longitude - from.longitude) * Math.PI / 180;
				
				const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
						  Math.cos(lat1) * Math.cos(lat2) *
						  Math.sin(dLon / 2) * Math.sin(dLon / 2);
				
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				return R * c;
			};

			// Create array of all points in the route (pickup, stops, dropoff)
			const points = [
				formData.pickup,
				...(formData.stops || []),
				formData.dropoff
			].filter(Boolean);

			// Calculate total distance by summing distances between consecutive points
			for (let i = 0; i < points.length - 1; i++) {
				totalDistance += calculateDistance(points[i], points[i + 1]);
			}

			// Calculate fare based on distance (fixed rate of ₹15 per km)
			const calculatedFare = totalDistance * 15;
			setFare(Math.round(calculatedFare));
		}
	}, [formData.pickup, formData.dropoff, formData.stops]);

	// Handle map click to set pickup or dropoff location
	const handleMapClick = async (coordinates) => {
		const [lat, lng] = coordinates;
		
		// Use the ref value instead of the state directly to ensure it's current
		const currentIsSettingPickup = isSettingPickupRef.current;
		
		try {
			// Reverse geocoding to get address from coordinates
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
			);
			const data = await response.json();
			
			const location = {
				latitude: lat,
				longitude: lng,
				address: data.display_name,
				type: currentIsSettingPickup ? 'pickup' : 'dropoff'
			};

			// Update pickup or dropoff based on current mode
			setFormData(prev => ({
				...prev,
				[currentIsSettingPickup ? 'pickup' : 'dropoff']: location
			}));

			// Center the map on the selected location
			if (mapRef.current) {
				mapRef.current.flyTo([lat, lng], 15);
			}
		} catch (error) {
			console.error('Error getting address:', error);
			// Add fallback in case geocoding fails
			const location = {
				latitude: lat,
				longitude: lng,
				address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
				type: currentIsSettingPickup ? 'pickup' : 'dropoff'
			};
			
			setFormData(prev => ({
				...prev,
				[currentIsSettingPickup ? 'pickup' : 'dropoff']: location
			}));
		}
	};

	// Handle search for locations
	const handleSearch = async () => {
		if (!searchQuery.trim()) return;
		
		setIsLoading(true);
		try {
			const params = new URLSearchParams({
				format: 'json',
				q: searchQuery,
				limit: 5
			});
			
			const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
			const data = await response.json();
			
			const results = data.map(item => ({
				latitude: parseFloat(item.lat),
				longitude: parseFloat(item.lon),
				address: item.display_name
			}));
			
			setSearchResults(results);
		} catch (error) {
			console.error('Error searching for locations:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle selection of search result
	const handleSelectSearchResult = (result) => {
		// Use the ref value for consistency
		const currentIsSettingPickup = isSettingPickupRef.current;
		
		const resultWithType = {
			...result,
			type: currentIsSettingPickup ? 'pickup' : 'dropoff'
		};
		
		setFormData(prev => ({
			...prev,
			[currentIsSettingPickup ? 'pickup' : 'dropoff']: resultWithType
		}));
		
		setSearchResults([]);
		setSearchQuery('');
		
		// Center the map on the selected location
		if (mapRef.current) {
			mapRef.current.flyTo([result.latitude, result.longitude], 15);
		}
	};

	// Handle booking confirmation
	const handleBookRide = () => {
		// Check if user has enough balance
		if (balance < fare) {
			alert('Insufficient balance. Please add funds to your wallet.');
			return;
		}
		
		// Set confirmation state to show confirmation screen
		setShowConfirmation(true);
		
		// In a real app, you would send the booking details to your backend here
	};

	const confirmRide = () => {
		// Update user's balance
		const newBalance = balance - fare;
		setBalance(newBalance);
		
		// Save to localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem('walletBalance', newBalance.toString());
		}
		
		// Show success message
		alert('Ride booked successfully! Your driver is on the way.');
		
		// Reset form
		setFormData({
			pickup: null,
			dropoff: null,
			stops: []
		});
		
		// Close confirmation
		setShowConfirmation(false);
	};

	// Clear pickup or dropoff location
	const clearLocation = (type) => {
		setFormData(prev => ({
			...prev,
			[type]: null
		}));
	};

	// Check if booking is possible
	const canBook = formData.pickup && formData.dropoff;

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Left column - Map */}
					<div className="w-full lg:w-7/12 h-[70vh] lg:h-[80vh]">
						<div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
							<MapWithNoSSR
								position={[28.4501, 77.5848]} // Center of Bennett University
								pickup={formData.pickup}
								dropoff={formData.dropoff}
								stops={formData.stops || []}
								setMap={(map) => {
									mapRef.current = map;
								}}
								onLocationSelect={handleMapClick}
								routeStops={[
									...(formData.pickup ? [
										{
											type: 'pickup',
											label: formData.pickup?.address || 'Pickup',
											coords: {
												lat: formData.pickup?.latitude,
												lng: formData.pickup?.longitude
											}
										}
									] : []),
									...(formData.stops || []).map(stop => ({
										type: 'stop',
										label: stop.address || 'Stop',
										coords: {
											lat: stop.latitude,
											lng: stop.longitude
										}
									})),
									...(formData.dropoff ? [
										{
											type: 'dropoff',
											label: formData.dropoff?.address || 'Dropoff',
											coords: {
												lat: formData.dropoff?.latitude,
												lng: formData.dropoff?.longitude
											}
										}
									] : [])
								]}
								key={`map-${formData.pickup?.latitude}-${formData.pickup?.longitude}-${formData.dropoff?.latitude}-${formData.dropoff?.longitude}`}
							/>
						</div>
					</div>

					{/* Right column - Booking form */}
					<div className="w-full lg:w-5/12">
						<div className="card-container">
							<h1 className="text-2xl font-bold mb-6">Book Your Ride</h1>
							
							{/* Toggle buttons */}
							<div className="mb-6">
								<div className="flex bg-gray-100 p-1 rounded-lg">
									<button
										className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
											isSettingPickup
												? 'bg-white text-black shadow-md'
												: 'bg-transparent text-gray-500 hover:bg-gray-200'
										}`}
										onClick={() => {
											setIsSettingPickup(true);
											isSettingPickupRef.current = true;
										}}
									>
										<div className="flex items-center justify-center">
											<div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
											Set Pickup
										</div>
									</button>
									<button
										className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
											!isSettingPickup
												? 'bg-white text-black shadow-md'
												: 'bg-transparent text-gray-500 hover:bg-gray-200'
										}`}
										onClick={() => {
											setIsSettingPickup(false);
											isSettingPickupRef.current = false;
										}}
									>
										<div className="flex items-center justify-center">
											<div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
											Set Dropoff
										</div>
									</button>
								</div>
							</div>
							
							{/* Search bar */}
							<div className="relative mb-6">
								<div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
									<input
										type="text"
										className="flex-grow px-4 py-3 outline-none"
										placeholder={isSettingPickup ? "Search for pickup location" : "Search for dropoff location"}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
									/>
									<button 
										className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
										onClick={handleSearch}
									>
										{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
									</button>
								</div>
								
								{/* Search results */}
								{searchResults.length > 0 && (
									<div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
										{searchResults.map((result, index) => (
											<div
												key={index}
												className="p-3 hover:bg-gray-50 cursor-pointer flex items-start border-b last:border-b-0"
												onClick={() => handleSelectSearchResult(result)}
											>
												<div className="flex-shrink-0 mr-3">
													<MapPin className="w-5 h-5 text-gray-500" />
												</div>
												<div className="overflow-hidden">
													<div className="text-sm text-gray-900 truncate">{result.address}</div>
													<div className="text-xs text-gray-500">
														{result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
							
							{/* Location cards */}
							<div className="space-y-4">
								{/* Pickup location */}
								<div className={`border rounded-lg p-4 relative ${formData.pickup ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
									<div className="flex items-start">
										<div className="location-icon pickup mr-3 flex-shrink-0">
											<CircleDot className="w-5 h-5" />
										</div>
										<div className="flex-grow">
											<div className="text-sm font-medium text-gray-900 mb-1">Pickup Location</div>
											{formData.pickup ? (
												<div className="text-sm text-gray-700 pr-7">{formData.pickup.address}</div>
											) : (
												<div className="text-sm text-gray-500 italic">Click on map or search to set pickup</div>
											)}
										</div>
										{formData.pickup && (
											<button 
												className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
												onClick={() => clearLocation('pickup')}
											>
												<X className="w-5 h-5" />
											</button>
										)}
									</div>
								</div>
								
								{/* Connection line */}
								<div className="flex justify-center">
									<div className="h-6 border-l-2 border-dashed border-gray-300"></div>
								</div>
								
								{/* Dropoff location */}
								<div className={`border rounded-lg p-4 relative ${formData.dropoff ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
									<div className="flex items-start">
										<div className="location-icon dropoff mr-3 flex-shrink-0">
											<Navigation className="w-5 h-5" />
										</div>
										<div className="flex-grow">
											<div className="text-sm font-medium text-gray-900 mb-1">Dropoff Location</div>
											{formData.dropoff ? (
												<div className="text-sm text-gray-700 pr-7">{formData.dropoff.address}</div>
											) : (
												<div className="text-sm text-gray-500 italic">Click on map or search to set dropoff</div>
											)}
										</div>
										{formData.dropoff && (
											<button 
												className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
												onClick={() => clearLocation('dropoff')}
											>
												<X className="w-5 h-5" />
											</button>
										)}
									</div>
								</div>
							</div>
							
							{/* Common destinations */}
							{(!formData.pickup || !formData.dropoff) && (
								<div className="mt-6">
									<h3 className="text-sm font-medium text-gray-700 mb-3">Bennett University Locations</h3>
									<div className="grid grid-cols-2 gap-3">
										{predefinedStops.slice(0, 4).map((stop, index) => (
											<div
												key={index}
												className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50"
												onClick={() => {
													// Set location based on current mode
													const location = {
														...stop,
														type: isSettingPickupRef.current ? 'pickup' : 'dropoff'
													};
													
													setFormData(prev => ({
														...prev,
														[isSettingPickupRef.current ? 'pickup' : 'dropoff']: location
													}));
												}}
											>
												<div className="text-sm font-medium text-gray-900">{stop.name}</div>
												<div className="text-xs text-gray-500 truncate">{stop.address}</div>
											</div>
										))}
									</div>
								</div>
							)}
							
							{/* Ride summary */}
							{formData.pickup && formData.dropoff && (
								<div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<h3 className="text-sm font-medium text-gray-700 mb-3">Ride Summary</h3>
									
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Distance</span>
											<span className="font-semibold">{(fare/15).toFixed(1)} km</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Estimated time</span>
											<span className="font-semibold">{Math.max(5, Math.round((fare/15) * 3))} mins</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Fare</span>
											<span className="font-semibold">₹{fare.toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Wallet balance</span>
											<span className={`font-semibold ${balance < fare ? 'text-red-500' : 'text-green-500'}`}>
												₹{balance.toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							)}
							
							{/* Book button */}
							<button
								className={`w-full mt-6 py-4 rounded-lg font-medium transition-all ${
									canBook 
										? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg' 
										: 'bg-gray-200 text-gray-500 cursor-not-allowed'
								}`}
								disabled={!canBook}
								onClick={handleBookRide}
							>
								{canBook ? 'Book Ride' : 'Set pickup & dropoff to book'}
							</button>
							
							{balance < fare && canBook && (
								<div className="mt-2 text-center text-red-500 text-sm">
									Insufficient balance. Please add funds to your wallet.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			
			{/* Booking confirmation modal */}
			{showConfirmation && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-md w-full overflow-hidden">
						<div className="p-6">
							<h2 className="text-xl font-bold mb-4">Confirm Your Ride</h2>
							
							<div className="space-y-4 mb-6">
								<div className="flex items-start">
									<div className="location-icon pickup mr-3 flex-shrink-0">
										<CircleDot className="w-5 h-5" />
									</div>
									<div>
										<div className="text-sm font-medium text-gray-900">From</div>
										<div className="text-sm text-gray-700">{formData.pickup?.address}</div>
									</div>
								</div>
								
								<div className="flex items-start">
									<div className="location-icon dropoff mr-3 flex-shrink-0">
										<Navigation className="w-5 h-5" />
									</div>
									<div>
										<div className="text-sm font-medium text-gray-900">To</div>
										<div className="text-sm text-gray-700">{formData.dropoff?.address}</div>
									</div>
								</div>
								
								<div className="border-t border-gray-200 pt-4">
									<div className="flex justify-between text-sm mb-2">
										<span className="text-gray-600">Distance</span>
										<span className="font-semibold">{(fare/15).toFixed(1)} km</span>
									</div>
									<div className="flex justify-between text-sm mb-2">
										<span className="text-gray-600">Estimated time</span>
										<span className="font-semibold">{Math.max(5, Math.round((fare/15) * 3))} mins</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Total fare</span>
										<span className="font-semibold text-lg">₹{fare.toFixed(2)}</span>
									</div>
								</div>
							</div>
							
							<div className="flex space-x-3">
								<button
									className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
									onClick={() => setShowConfirmation(false)}
								>
									Cancel
								</button>
								<button
									className="flex-1 py-3 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
									onClick={confirmRide}
								>
									Confirm Ride
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
