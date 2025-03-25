'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import './map.css';

const MapComponent = ({ position, setMap }) => {
	const [isClient, setIsClient] = useState(false);
	const mapRef = useRef(null);
	const markerRef = useRef(null);

	// Initialize client-side rendering
	useEffect(() => {
		setIsClient(true);
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
			}
		};
	}, []);

	// Initialize the map
	useEffect(() => {
		if (!isClient) return;

		const initMap = () => {
			// Check if map container exists
			const container = document.getElementById('map-container');
			if (!container) return;

			try {
				// Fix icon paths
				delete L.Icon.Default.prototype._getIconUrl;
				L.Icon.Default.mergeOptions({
					iconRetinaUrl:
						'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
					iconUrl:
						'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
					shadowUrl:
						'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
				});

				// Create map if it doesn't exist
				if (!mapRef.current) {
					const map = L.map('map-container').setView(position, 13);

					// Add tile layer
					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						attribution:
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
						maxZoom: 19
					}).addTo(map);

					// Add marker
					markerRef.current = L.marker(position).addTo(map);
					markerRef.current.bindPopup('Selected Location').openPopup();

					// Store map reference
					mapRef.current = map;
					if (setMap) setMap(map);

					// Force resize
					setTimeout(() => {
						map.invalidateSize(true);
					}, 250);
				}
			} catch (error) {
				console.error('Error initializing map:', error);
			}
		};

		initMap();
	}, [isClient, setMap]); // Remove position from dependencies to prevent recreation

	// Update map when position changes
	useEffect(() => {
		if (!mapRef.current || !markerRef.current) return;

		try {
			// Update map view
			mapRef.current.setView(position, 13);

			// Update marker position
			markerRef.current.setLatLng(position);
			markerRef.current.bindPopup('Selected Location').openPopup();
		} catch (error) {
			console.error('Error updating map:', error);
		}
	}, [position]);

	return (
		<div
			id='map-container'
			style={{
				height: '100%',
				width: '100%',
				position: 'relative',
				zIndex: 0
			}}
		/>
	);
};

export default MapComponent;
