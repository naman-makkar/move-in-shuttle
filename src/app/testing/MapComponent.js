'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import './map.css';

const MapComponent = ({ position, setMap, onLocationSelect, routeStops = [] }) => {
	const [isClient, setIsClient] = useState(false);
	const mapRef = useRef(null);
	const markersRef = useRef({});
	const polylineRef = useRef(null);

	// Initialize client-side rendering
	useEffect(() => {
		setIsClient(true);
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
			}
		};
	}, []);

	// Function to create custom marker icons
	const createMarkerIcon = (type) => {
		const iconUrl =
			type === 'pickup'
				? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
				: type === 'dropoff'
				? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
				: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';

		return L.icon({
			iconUrl,
			shadowUrl:
				'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});
	};

	// Update markers and route line
	const updateRouteDisplay = () => {
		if (!mapRef.current) return;

		// Clear existing polyline
		if (polylineRef.current) {
			polylineRef.current.remove();
			polylineRef.current = null;
		}

		// Ensure routeStops is an array before filtering
		const validStops = Array.isArray(routeStops) 
			? routeStops.filter((stop) => stop && stop.coords)
			: [];
			
		const coordinates = validStops.map((stop) => [
			stop.coords.lat,
			stop.coords.lng
		]);

		// Draw polyline if we have at least 2 points
		if (coordinates.length >= 2) {
			polylineRef.current = L.polyline(coordinates, {
				color: '#3B82F6',
				weight: 4,
				opacity: 0.7,
				dashArray: '10, 10'
			}).addTo(mapRef.current);
		}

		// Update markers
		if (Array.isArray(routeStops)) {
			routeStops.forEach((stop, index) => {
				// Remove existing marker
				if (markersRef.current[index]) {
					markersRef.current[index].remove();
					delete markersRef.current[index];
				}

				// Add new marker if coordinates exist
				if (stop && stop.coords) {
					const marker = L.marker([stop.coords.lat, stop.coords.lng], {
						icon: createMarkerIcon(stop.type)
					}).addTo(mapRef.current);

					marker.bindPopup(
						`${stop.label}<br>${stop.coords.lat.toFixed(
							6
						)}, ${stop.coords.lng.toFixed(6)}`
					);
					markersRef.current[index] = marker;
				}
			});
		}
	};

	// Initialize the map
	useEffect(() => {
		if (!isClient) return;

		const initMap = () => {
			// Check if map container exists
			const container = document.getElementById('map-container');
			if (!container) return;

			try {
				// Create map if it doesn't exist
				if (!mapRef.current) {
					const map = L.map('map-container').setView(position, 13);

					// Add tile layer
					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						attribution:
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
						maxZoom: 19
					}).addTo(map);

					// Add click handler
					map.on('click', (e) => {
						const { lat, lng } = e.latlng;
						if (onLocationSelect) {
							onLocationSelect([lat, lng]);
						}
					});

					// Store map reference
					mapRef.current = map;
					if (setMap) setMap(map);

					// Force resize
					setTimeout(() => {
						map.invalidateSize(true);
					}, 250);
				}

				// Initial route display
				updateRouteDisplay();
			} catch (error) {
				console.error('Error initializing map:', error);
			}
		};

		initMap();
	}, [isClient, setMap, onLocationSelect]);

	// Update route display when stops change
	useEffect(() => {
		updateRouteDisplay();
	}, [routeStops]);

	// Update map when position changes
	useEffect(() => {
		if (!mapRef.current) return;
		mapRef.current.setView(position, 13);
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
