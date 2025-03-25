import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';

const MapComponent = ({
	position,
	setMap,
	onLocationSelect,
	routeStops,
	routeData
}) => {
	const [isClient, setIsClient] = useState(false);
	const mapRef = useRef(null);
	const markersRef = useRef({});
	const polylineRef = useRef(null);
	const routeLayerRef = useRef(null);

	// ... existing marker icon code ...

	// Update route display
	const updateRouteDisplay = () => {
		if (!mapRef.current) return;

		// Clear existing route layer
		if (routeLayerRef.current) {
			routeLayerRef.current.remove();
			routeLayerRef.current = null;
		}

		// Clear existing polyline
		if (polylineRef.current) {
			polylineRef.current.remove();
			polylineRef.current = null;
		}

		// Draw route if available
		if (routeData && routeData.geometry) {
			routeLayerRef.current = L.geoJSON(routeData.geometry, {
				style: {
					color: '#3B82F6',
					weight: 4,
					opacity: 0.8
				}
			}).addTo(mapRef.current);

			// Fit map bounds to show the entire route
			const bounds = L.geoJSON(routeData.geometry).getBounds();
			mapRef.current.fitBounds(bounds, { padding: [50, 50] });
		} else {
			// If no route, just connect dots with a dashed line
			const validStops = routeStops.filter((stop) => stop.coords);
			if (validStops.length >= 2) {
				const coordinates = validStops.map((stop) => [
					stop.coords.lat,
					stop.coords.lng
				]);
				polylineRef.current = L.polyline(coordinates, {
					color: '#3B82F6',
					weight: 4,
					opacity: 0.7,
					dashArray: '10, 10'
				}).addTo(mapRef.current);
			}
		}

		// Update markers
		routeStops.forEach((stop, index) => {
			// Remove existing marker
			if (markersRef.current[index]) {
				markersRef.current[index].remove();
				delete markersRef.current[index];
			}

			// Add new marker if coordinates exist
			if (stop.coords) {
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
	};

	// Initialize the map
	useEffect(() => {
		if (!isClient) return;

		const initMap = () => {
			// ... existing map initialization code ...
		};

		initMap();
	}, [isClient, setMap, onLocationSelect]);

	// Update route display when stops or route data change
	useEffect(() => {
		updateRouteDisplay();
	}, [routeStops, routeData]);

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
