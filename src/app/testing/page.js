'use client';

import { useState } from 'react';
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

// Add default styling for Leaflet
const leafletStyles = `
	.leaflet-container {
		height: 100%;
		width: 100%;
	}
`;

export default function TestingPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [position, setPosition] = useState([51.505, -0.09]); // Default to London
	const [map, setMap] = useState(null);

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		try {
			// Show loading state
			const button = e.target.querySelector('button');
			const originalText = button.innerText;
			button.innerText = 'Searching...';
			button.disabled = true;

			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					searchQuery
				)}`
			);
			const data = await response.json();

			if (data.length > 0) {
				const { lat, lon } = data[0];
				const newPosition = [parseFloat(lat), parseFloat(lon)];
				setPosition(newPosition);

				// If we have a map reference, fly to the location
				if (map) {
					map.flyTo(newPosition, 13, {
						duration: 1.5
					});
				}
			} else {
				alert('Location not found. Please try a different search term.');
			}

			// Reset button state
			button.innerText = originalText;
			button.disabled = false;
		} catch (error) {
			console.error('Error searching location:', error);
			alert('Error searching for location. Please try again.');
		}
	};

	return (
		<div className='p-4'>
			{/* Add global styles for Leaflet */}
			<style
				jsx
				global>
				{leafletStyles}
			</style>

			<div className='mb-4'>
				<form
					onSubmit={handleSearch}
					className='flex gap-2'>
					<input
						type='text'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder='Search for a location...'
						className='flex-1 p-2 border border-gray-300 rounded'
					/>
					<button
						type='submit'
						className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'>
						Search
					</button>
				</form>
			</div>

			{/* Map container with fixed dimensions */}
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
				/>
			</div>
		</div>
	);
}
