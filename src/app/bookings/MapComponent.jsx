"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

// Leaflet routing machine is required for route functionality
const MapComponent = ({
  position,
  pickup,
  dropoff,
  stops = [],
  setMap,
  onLocationSelect,
  routeStops = [],
}) => {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const routingControlRef = useRef(null);
  const [shortestRoute, setShortestRoute] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (!markersRef.current) {
      markersRef.current = {};
    }

    if (typeof window !== "undefined") {
      import("leaflet-routing-machine").catch((err) =>
        console.error("Failed to load leaflet-routing-machine:", err)
      );
    }

    return () => {
      if (mapRef.current) {
        if (routingControlRef.current) {
          try {
            mapRef.current.removeControl(routingControlRef.current);
          } catch (e) {
            console.error("Error removing routing control:", e);
          }
        }
        mapRef.current.remove();
      }
    };
  }, []);

  const normalizeLocation = (location, type = "location") => {
    if (!location) return null;

    if (location.coords && location.coords.lat && location.coords.lng) {
      return {
        ...location,
        type: location.type || type,
      };
    }

    const locationType = location.type || type;
    let coords = {};

    if (location.latitude !== undefined && location.longitude !== undefined) {
      coords = {
        lat: location.latitude,
        lng: location.longitude,
      };
    } else if (
      location.lat !== undefined &&
      (location.lng !== undefined || location.lon !== undefined)
    ) {
      coords = {
        lat: location.lat,
        lng: location.lng || location.lon,
      };
    } else if (Array.isArray(location) && location.length >= 2) {
      coords = {
        lat: location[0],
        lng: location[1],
      };
    }

    if (coords.lat === undefined || coords.lng === undefined) {
      return null;
    }

    return {
      type: locationType,
      label:
        location.address ||
        location.name ||
        `${locationType.charAt(0).toUpperCase() + locationType.slice(1)}`,
      coords: coords,
    };
  };

  const createCustomMarkerIcon = (type) => {
    // Enhanced marker styling for better visibility
    const markerHtml =
      type === "pickup"
        ? '<div style="position:relative;"><div style="background: #10b981; width: 12px; height: 12px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; box-shadow: 0 0 0 2px white;"></div><div style="background: rgba(16, 185, 129, 0.2); width: 28px; height: 28px; border-radius: 50%; border: 2px solid #10b981; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: pulse-green 2s infinite;"></div></div>'
        : type === "dropoff"
        ? '<div style="position:relative;"><div style="background: #ef4444; width: 12px; height: 12px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; box-shadow: 0 0 0 2px white;"></div><div style="background: rgba(239, 68, 68, 0.2); width: 28px; height: 28px; border-radius: 50%; border: 2px solid #ef4444; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: pulse-red 2s infinite;"></div></div>'
        : '<div style="position:relative;"><div style="background: #3B82F6; width: 8px; height: 8px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; box-shadow: 0 0 0 2px white;"></div><div style="background: rgba(59, 130, 246, 0.2); width: 24px; height: 24px; border-radius: 50%; border: 2px solid #3B82F6; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div></div>';

    return L.divIcon({
      html: markerHtml,
      className: "",
      iconSize: type === "stop" ? [24, 24] : [32, 32],
      iconAnchor: type === "stop" ? [12, 12] : [16, 16],
    });
  };

  // Update markers and route line
  const updateMarkers = (stopsToDisplay) => {
    if (!mapRef.current || !stopsToDisplay || stopsToDisplay.length === 0)
      return;

    // Keep track of markers by their specific type
    const pickupMarker = markersRef.current.pickup;
    const dropoffMarker = markersRef.current.dropoff;

    // Find our locations from the stops array
    const pickupLocation = stopsToDisplay.find(
      (stop) => stop.type === "pickup"
    );
    const dropoffLocation = stopsToDisplay.find(
      (stop) => stop.type === "dropoff"
    );
    const otherStops = stopsToDisplay.filter(
      (stop) => stop.type !== "pickup" && stop.type !== "dropoff"
    );

    // Handle pickup marker
    if (pickupLocation && pickupLocation.coords) {
      const latlng = [pickupLocation.coords.lat, pickupLocation.coords.lng];

      // If we already have a pickup marker, update its position
      if (pickupMarker) {
        pickupMarker.setLatLng(latlng);
      }
      // Otherwise create a new one
      else {
        markersRef.current.pickup = L.marker(latlng, {
          icon: createCustomMarkerIcon("pickup"),
          zIndexOffset: 1000, // Ensure pickup marker is on top
        })
          .addTo(mapRef.current)
          .bindPopup(
            `<div class="popup-content"><strong>${
              pickupLocation.label || "Pickup"
            }</strong><br><small>${latlng[0].toFixed(6)}, ${latlng[1].toFixed(
              6
            )}</small></div>`,
            { className: "custom-popup" }
          );
      }
    }
    // If no pickup location but we have a marker, remove it
    else if (pickupMarker) {
      pickupMarker.remove();
      delete markersRef.current.pickup;
    }

    // Handle dropoff marker
    if (dropoffLocation && dropoffLocation.coords) {
      const latlng = [dropoffLocation.coords.lat, dropoffLocation.coords.lng];

      // If we already have a dropoff marker, update its position
      if (dropoffMarker) {
        dropoffMarker.setLatLng(latlng);
      }
      // Otherwise create a new one
      else {
        markersRef.current.dropoff = L.marker(latlng, {
          icon: createCustomMarkerIcon("dropoff"),
          zIndexOffset: 900, // Slightly lower than pickup but still high
        })
          .addTo(mapRef.current)
          .bindPopup(
            `<div class="popup-content"><strong>${
              dropoffLocation.label || "Dropoff"
            }</strong><br><small>${latlng[0].toFixed(6)}, ${latlng[1].toFixed(
              6
            )}</small></div>`,
            { className: "custom-popup" }
          );
      }
    }
    // If no dropoff location but we have a marker, remove it
    else if (dropoffMarker) {
      dropoffMarker.remove();
      delete markersRef.current.dropoff;
    }

    // Remove all stop markers
    Object.entries(markersRef.current)
      .filter(([key]) => !["pickup", "dropoff"].includes(key))
      .forEach(([key, marker]) => {
        marker.remove();
        delete markersRef.current[key];
      });

    // Add the other stops back
    otherStops.forEach((stop, index) => {
      if (stop.coords) {
        const latlng = [stop.coords.lat, stop.coords.lng];
        const key = `stop-${index}`;
        markersRef.current[key] = L.marker(latlng, {
          icon: createCustomMarkerIcon("stop"),
          zIndexOffset: 500, // Lower than pickup/dropoff
        })
          .addTo(mapRef.current)
          .bindPopup(
            `<div class="popup-content"><strong>${
              stop.label || "Stop"
            }</strong><br><small>${latlng[0].toFixed(6)}, ${latlng[1].toFixed(
              6
            )}</small></div>`,
            { className: "custom-popup" }
          );
      }
    });

    // If we have both pickup and dropoff, create a routing path
    if (pickupLocation?.coords && dropoffLocation?.coords) {
      setupRouting([pickupLocation, ...otherStops, dropoffLocation]);
    }
  };

  const setupRouting = (stops) => {
    if (!mapRef.current || !stops || stops.length < 2) return;

    // First, remove any existing route
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    // Extract waypoints from stops
    const waypoints = stops
      .filter((stop) => stop && stop.coords)
      .map((stop) => L.latLng(stop.coords.lat, stop.coords.lng));

    if (waypoints.length < 2) return;

    try {
      // Create the new routing control with enhanced styling
      routingControlRef.current = L.Routing.control({
        waypoints,
        routeWhileDragging: false,
        addWaypoints: false, // Disable adding waypoints by clicking on the map
        draggableWaypoints: false, // Disable dragging of waypoints
        lineOptions: {
          styles: [
            {
              color: "#3B82F6",
              opacity: 0.8,
              weight: 6,
              lineCap: "round",
              lineJoin: "round",
            },
            {
              color: "white",
              opacity: 0.3,
              weight: 10,
              lineCap: "round",
              lineJoin: "round",
            },
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
        createMarker: () => null, // Don't create route markers (we create our own)
        show: false, // Don't show the itinerary panel
        fitSelectedRoutes: false, // We'll handle fitting bounds ourselves
      }).addTo(mapRef.current);

      // Fit the map bounds to show all waypoints with nice padding
      if (waypoints.length > 0) {
        const bounds = L.latLngBounds(waypoints);
        mapRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 17, // Don't zoom in too far
          animate: true,
        });
      }
    } catch (error) {
      console.error("Error setting up routing:", error);
    }
  };

  const updateMapWithStops = (mappedStops) => {
    if (!mapRef.current || !mappedStops) return;

    // Add the markers for each stop
    updateMarkers(mappedStops);

    // Focus on the markers by fitting bounds around them
    const validStops = mappedStops.filter((s) => s && s.coords);
    if (validStops.length > 0) {
      const bounds = L.latLngBounds(
        validStops.map((s) => [s.coords.lat, s.coords.lng])
      );

      // Only fit bounds if we have multiple stops or if map isn't ready yet
      if (validStops.length > 1 || !isMapReady) {
        mapRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 17,
          animate: true,
        });
        setIsMapReady(true);
      }
    }
  };

  useEffect(() => {
    if (isClient && !mapRef.current) {
      // Initialize the map
      initMap();
    }
  }, [isClient]);

  useEffect(() => {
    // This effect will run if stops, pickup, or dropoff change
    if (mapRef.current) {
      // Map all stops to our format
      const mappedStops = [];

      // Add pickup if it exists
      if (pickup) {
        const normalizedPickup = normalizeLocation(pickup, "pickup");
        if (normalizedPickup) mappedStops.push(normalizedPickup);
      }

      // Add dropoff if it exists
      if (dropoff) {
        const normalizedDropoff = normalizeLocation(dropoff, "dropoff");
        if (normalizedDropoff) mappedStops.push(normalizedDropoff);
      }

      // Add other stops if they exist
      if (stops && stops.length > 0) {
        stops.forEach((stop) => {
          if (stop) {
            const normalizedStop = normalizeLocation(stop, "stop");
            if (normalizedStop) mappedStops.push(normalizedStop);
          }
        });
      }

      // Add route stops if they exist
      if (routeStops && routeStops.length > 0) {
        routeStops.forEach((stop) => {
          if (stop) {
            const normalizedStop = normalizeLocation(stop, "route");
            if (normalizedStop) mappedStops.push(normalizedStop);
          }
        });
      }

      // Update map with the normalized stops
      updateMapWithStops(mappedStops);
    }
  }, [pickup, dropoff, stops, routeStops, isClient]);

  const initMap = () => {
    if (typeof window === "undefined" || mapRef.current) return;

    const defaultPosition = position || [28.470126, 77.589577]; // Bennett University coordinates
    const defaultZoom = 15;

    // Create a map instance with enhanced options
    const map = L.map("map-container", {
      center: defaultPosition,
      zoom: defaultZoom,
      zoomControl: true,
      attributionControl: true,
      maxZoom: 19,
      minZoom: 4,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
    });

    // Add better looking tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Add a scale control
    L.control
      .scale({
        imperial: false,
        position: "bottomright",
      })
      .addTo(map);

    // Add a click handler to the map
    map.on("click", (e) => {
      if (onLocationSelect) {
        // Create a small animation effect on click
        const clickMarker = L.circleMarker([e.latlng.lat, e.latlng.lng], {
          radius: 5,
          color: "#3B82F6",
          fillColor: "#3B82F6",
          fillOpacity: 0.7,
          weight: 2,
        }).addTo(map);

        // Animate the marker
        setTimeout(() => {
          clickMarker.setStyle({ radius: 20, fillOpacity: 0 });
          setTimeout(() => {
            map.removeLayer(clickMarker);
          }, 300);
        }, 10);

        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      }
    });

    // Store the map instance
    mapRef.current = map;

    // If setMap callback is provided, call it with the map instance
    if (setMap) {
      setMap(map);
    }

    return map;
  };

  // Render the map container
  return (
    <>
      {isClient ? (
        <div id="map-container" className="h-full w-full rounded-lg" />
      ) : (
        <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="loading-spinner"></div>
          <span className="ml-3 text-gray-600">Loading Map...</span>
        </div>
      )}
    </>
  );
};

export default MapComponent;
