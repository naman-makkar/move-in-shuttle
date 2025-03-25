"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

// Leaflet routing machine is required for route functionality
// Install with: npm install leaflet-routing-machine

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
    const markerHtml =
      type === "pickup"
        ? '<div style="background: #10b981; width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10;"></div><div style="background: rgba(16, 185, 129, 0.2); width: 24px; height: 24px; border-radius: 50%; border: 2px solid #10b981; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>'
        : type === "dropoff"
        ? '<div style="background: #ef4444; width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10;"></div><div style="background: rgba(239, 68, 68, 0.2); width: 24px; height: 24px; border-radius: 50%; border: 2px solid #ef4444; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>'
        : '<div style="background: #3B82F6; width: 8px; height: 8px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10;"></div><div style="background: rgba(59, 130, 246, 0.2); width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(59, 130, 246, 0.8); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>';

    return L.divIcon({
      html: markerHtml,
      className: "",
      iconSize: type === "stop" ? [20, 20] : [24, 24],
      iconAnchor: type === "stop" ? [10, 10] : [12, 12],
    });
  };

  // Update markers and route line
  const updateMarkers = (stopsToDisplay) => {
    if (!mapRef.current || !stopsToDisplay || stopsToDisplay.length === 0)
      return;

    // Debug logging
    console.log(
      "🔍 DEBUG - updateMarkers called with stops:",
      stopsToDisplay.map((stop) => ({
        type: stop.type,
        label: stop.label,
        coords: stop.coords ? [stop.coords.lat, stop.coords.lng] : null,
      }))
    );

    // Keep track of markers by their specific type
    const pickupMarker = markersRef.current.pickup;
    const dropoffMarker = markersRef.current.dropoff;

    console.log("🔍 DEBUG - Existing markers:", {
      pickup: pickupMarker ? "exists" : "none",
      dropoff: dropoffMarker ? "exists" : "none",
      otherCount: Object.keys(markersRef.current).filter(
        (k) => !["pickup", "dropoff"].includes(k)
      ).length,
    });

    const stopMarkers = Object.entries(markersRef.current)
      .filter(([key]) => !["pickup", "dropoff"].includes(key))
      .map(([_, marker]) => marker);

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

    console.log("🔍 DEBUG - Parsed locations:", {
      pickup: pickupLocation
        ? {
            type: pickupLocation.type,
            coords: pickupLocation.coords
              ? [pickupLocation.coords.lat, pickupLocation.coords.lng]
              : null,
          }
        : "none",
      dropoff: dropoffLocation
        ? {
            type: dropoffLocation.type,
            coords: dropoffLocation.coords
              ? [dropoffLocation.coords.lat, dropoffLocation.coords.lng]
              : null,
          }
        : "none",
      otherStops: otherStops.length,
    });

    // Handle pickup marker
    if (pickupLocation && pickupLocation.coords) {
      const latlng = [pickupLocation.coords.lat, pickupLocation.coords.lng];

      // If we already have a pickup marker, update its position
      if (pickupMarker) {
        pickupMarker.setLatLng(latlng);
        console.log(
          "🔍 DEBUG - Updated existing pickup marker position",
          latlng
        );
      }
      // Otherwise create a new one
      else {
        console.log("🔍 DEBUG - Creating new pickup marker at", latlng);
        markersRef.current.pickup = L.marker(latlng, {
          icon: createCustomMarkerIcon("pickup"),
        })
          .addTo(mapRef.current)
          .bindPopup(
            `${pickupLocation.label || "Pickup"}<br>${latlng[0].toFixed(
              6
            )}, ${latlng[1].toFixed(6)}`
          );
      }
    }
    // If no pickup location but we have a marker, remove it
    else if (pickupMarker) {
      pickupMarker.remove();
      delete markersRef.current.pickup;
      console.log("🔍 DEBUG - Removed pickup marker");
    }

    // Handle dropoff marker
    if (dropoffLocation && dropoffLocation.coords) {
      const latlng = [dropoffLocation.coords.lat, dropoffLocation.coords.lng];

      // If we already have a dropoff marker, update its position
      if (dropoffMarker) {
        dropoffMarker.setLatLng(latlng);
        console.log(
          "🔍 DEBUG - Updated existing dropoff marker position",
          latlng
        );
      }
      // Otherwise create a new one
      else {
        console.log("🔍 DEBUG - Creating new dropoff marker at", latlng);
        markersRef.current.dropoff = L.marker(latlng, {
          icon: createCustomMarkerIcon("dropoff"),
        })
          .addTo(mapRef.current)
          .bindPopup(
            `${dropoffLocation.label || "Dropoff"}<br>${latlng[0].toFixed(
              6
            )}, ${latlng[1].toFixed(6)}`
          );
      }
    }
    // If no dropoff location but we have a marker, remove it
    else if (dropoffMarker) {
      dropoffMarker.remove();
      delete markersRef.current.dropoff;
      console.log("🔍 DEBUG - Removed dropoff marker");
    }

    // Logging marker state after updates
    console.log("🔍 DEBUG - Markers after update:", {
      pickup: markersRef.current.pickup ? "exists" : "none",
      dropoff: markersRef.current.dropoff ? "exists" : "none",
    });

    // Remove all stop markers
    stopMarkers.forEach((marker) => marker.remove());

    // Clear any non-pickup, non-dropoff markers
    Object.keys(markersRef.current).forEach((key) => {
      if (!["pickup", "dropoff"].includes(key)) {
        delete markersRef.current[key];
      }
    });

    // Add markers for other stops
    otherStops.forEach((stop, index) => {
      if (stop.coords && stop.coords.lat && stop.coords.lng) {
        const marker = L.marker([stop.coords.lat, stop.coords.lng], {
          icon: createCustomMarkerIcon("stop"),
        }).addTo(mapRef.current);

        marker.bindPopup(
          `${stop.label || "Stop"}<br>${stop.coords.lat.toFixed(
            6
          )}, ${stop.coords.lng.toFixed(6)}`
        );

        // Use a unique key for each stop marker
        markersRef.current[`stop-${index}`] = marker;
      }
    });
  };

  // Setup routing between points
  const setupRouting = (stops) => {
    if (!mapRef.current || !stops || stops.length < 2) {
      console.log("Cannot setup routing: insufficient data", {
        mapExists: !!mapRef.current,
        stopsCount: stops?.length,
      });
      return;
    }

    // If we already have a routing control, remove it
    if (routingControlRef.current) {
      try {
        mapRef.current.removeControl(routingControlRef.current);
      } catch (err) {
        console.error("Error removing previous routing control:", err);
      }
      routingControlRef.current = null;
    }

    try {
      // Get all valid waypoints
      const waypoints = stops
        .filter(
          (stop) => stop && stop.coords && stop.coords.lat && stop.coords.lng
        )
        .map((stop) => L.latLng(stop.coords.lat, stop.coords.lng));

      console.log("Setting up routing with waypoints:", waypoints);

      if (waypoints.length < 2) {
        console.warn("Not enough valid waypoints for routing");
        return;
      }

      // If Leaflet Routing Machine isn't available yet, draw a simple polyline instead
      if (!L.Routing || !L.Routing.control) {
        console.log(
          "Leaflet Routing Machine not available, using polyline fallback"
        );
        // Draw a direct polyline between points as a fallback
        const polyline = L.polyline(waypoints, {
          color: "#3B82F6", // Blue color
          weight: 4,
          opacity: 0.8,
        }).addTo(mapRef.current);

        // Store a reference so we can remove it later
        routingControlRef.current = {
          _plan: { _waypoints: waypoints },
          _router: null,
          _routes: null,
          _removeAllWaypoints: () => {},
          remove: () => polyline.remove(),
        };
        return;
      }

      // Create proper routing with Leaflet Routing Machine if available
      routingControlRef.current = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        addWaypoints: false, // Disable adding waypoints by clicking on the route
        draggableWaypoints: false, // Disable dragging waypoints
        fitSelectedRoutes: false, // Don't zoom to fit the selected route
        showAlternatives: false,
        createMarker: () => null, // Don't create default markers, we have our own
        lineOptions: {
          styles: [
            { color: "#3B82F6", opacity: 0.8, weight: 4 }, // Main style - blue line
          ],
          missingRouteStyles: [
            { color: "#A3A3A3", opacity: 0.6, weight: 2, dashArray: "10,10" }, // Style for sections without route data
          ],
        },
      })
        .on("routeselected", function (e) {
          const route = e.route;
          console.log("Route found:", route);
          setShortestRoute(route);
        })
        .on("routingerror", function (e) {
          console.error("Routing error:", e.error);

          // If routing fails, fall back to a simple polyline
          const polyline = L.polyline(waypoints, {
            color: "#3B82F6",
            weight: 4,
            opacity: 0.8,
            dashArray: "10,10",
          }).addTo(mapRef.current);

          // Replace the routing control reference with our polyline
          mapRef.current.removeControl(routingControlRef.current);
          routingControlRef.current = {
            _plan: { _waypoints: waypoints },
            _router: null,
            _routes: null,
            _removeAllWaypoints: () => {},
            remove: () => polyline.remove(),
          };
        });

      // Add to map but hide the itinerary
      routingControlRef.current.addTo(mapRef.current);

      // Hide the routing control's itinerary and waypoint panels
      const container = routingControlRef.current.getContainer();
      if (container) {
        container.style.display = "none";
      }
    } catch (err) {
      console.error("Error setting up routing:", err);

      // Final fallback if all else fails - simple polyline
      try {
        const waypoints = stops
          .filter(
            (stop) => stop && stop.coords && stop.coords.lat && stop.coords.lng
          )
          .map((stop) => [stop.coords.lat, stop.coords.lng]);

        if (waypoints.length >= 2) {
          const polyline = L.polyline(waypoints, {
            color: "#3B82F6",
            weight: 4,
            opacity: 0.8,
          }).addTo(mapRef.current);

          routingControlRef.current = {
            remove: () => polyline.remove(),
          };
        }
      } catch (e) {
        console.error("Even fallback polyline failed:", e);
      }
    }
  };

  // Function to update map with stops
  const updateMapWithStops = (mappedStops) => {
    if (!mapRef.current || !mappedStops) return;

    console.log(
      "Updating map with stops:",
      mappedStops.map((stop) => ({
        type: stop.type,
        label: stop.label,
        lat: stop.coords?.lat,
        lng: stop.coords?.lng,
      }))
    );

    // Update markers first - this is where pickup/dropoff markers are created
    updateMarkers(mappedStops);

    // Try to set up routing if we have at least a pickup and dropoff (2 points)
    if (mappedStops.length >= 2) {
      setupRouting(mappedStops);
    } else {
      // Not enough points for routing
      console.log("Not enough points for routing", {
        count: mappedStops.length,
      });

      // Clear any existing routing
      if (routingControlRef.current) {
        try {
          routingControlRef.current.remove();
        } catch (e) {
          console.error("Error removing routing:", e);
        }
        routingControlRef.current = null;
      }
    }

    // Make sure map is centered and zoomed appropriately to show all points
    if (mappedStops.length > 0) {
      try {
        // Create a bounds object
        const bounds = L.latLngBounds(
          mappedStops
            .filter(
              (stop) =>
                stop && stop.coords && stop.coords.lat && stop.coords.lng
            )
            .map((stop) => [stop.coords.lat, stop.coords.lng])
        );

        // Only fit bounds if we have at least one valid point
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, {
            padding: [50, 50], // Add some padding around the bounds
            maxZoom: 15, // Don't zoom in too much
          });
        }
      } catch (e) {
        console.error("Error fitting bounds:", e);
      }
    }
  };

  // Handle location changes for pickup and dropoff
  useEffect(() => {
    // Skip if not client-side
    if (!isClient) return;

    console.log("Processing locations:", {
      pickup: pickup ? { ...pickup, type: pickup.type || "pickup" } : null,
      dropoff: dropoff ? { ...dropoff, type: dropoff.type || "dropoff" } : null,
      stops,
    });

    // Force pickup and dropoff to have correct types
    let typedPickup = pickup;
    if (pickup && !pickup.type) {
      typedPickup = { ...pickup, type: "pickup" };
    }

    let typedDropoff = dropoff;
    if (dropoff && !dropoff.type) {
      typedDropoff = { ...dropoff, type: "dropoff" };
    }

    // Normalize with explicit types
    const normalizedPickup = typedPickup
      ? normalizeLocation(typedPickup, "pickup")
      : null;
    const normalizedDropoff = typedDropoff
      ? normalizeLocation(typedDropoff, "dropoff")
      : null;

    console.log("Normalized locations with forced types:", {
      normalizedPickup,
      normalizedDropoff,
    });

    // Process intermediate stops
    const normalizedStops = Array.isArray(stops)
      ? stops.map((stop) => normalizeLocation(stop, "stop"))
      : [];

    // Filter out any nulls and combine all locations
    const mappedStops = [
      normalizedPickup,
      ...normalizedStops,
      normalizedDropoff,
    ].filter(Boolean);

    console.log("Combined locations for map:", mappedStops);

    // Update the map with the stops
    updateMapWithStops(mappedStops);

    // Also pass these to routeStops for backward compatibility
    // with components expecting that format
    if (Array.isArray(routeStops) && routeStops.length === 0) {
      // Only update if there's actual data and routeStops is empty
      if (mappedStops.length > 0) {
        // We're careful not to modify the original array
        const newRouteStops = [...mappedStops];
        // This is a hack but ensures the component recognizes the update
        routeStops.splice(0, routeStops.length, ...newRouteStops);
      }
    }
  }, [isClient, pickup, dropoff, stops]);

  // Initialize the map
  useEffect(() => {
    if (!isClient) return;

    const initMap = () => {
      // Check if map container exists
      const container = document.getElementById("map-container");
      if (!container) {
        console.error("Map container not found");
        return;
      }

      try {
        // Create map if it doesn't exist
        if (!mapRef.current) {
          // Normalize position input
          let validPosition = [28.450151, 77.584286]; // Default position (Bennett University)

          // Try to get position from props in various formats
          if (position) {
            const normalizedPosition = normalizeLocation(position);
            if (normalizedPosition) {
              validPosition = [
                normalizedPosition.coords.lat,
                normalizedPosition.coords.lng,
              ];
            }
          } else if (pickup) {
            const normalizedPickup = normalizeLocation(pickup);
            if (normalizedPickup) {
              validPosition = [
                normalizedPickup.coords.lat,
                normalizedPickup.coords.lng,
              ];
            }
          } else if (dropoff) {
            const normalizedDropoff = normalizeLocation(dropoff);
            if (normalizedDropoff) {
              validPosition = [
                normalizedDropoff.coords.lat,
                normalizedDropoff.coords.lng,
              ];
            }
          }

          console.log("Initializing map with position:", validPosition);

          const map = L.map("map-container").setView(validPosition, 15);

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Add click handler with logging
          map.on("click", (e) => {
            const { lat, lng } = e.latlng;
            console.log(`Map clicked at [${lat}, ${lng}]`);
            if (onLocationSelect) {
              console.log("Calling onLocationSelect with coordinates");
              onLocationSelect([lat, lng]);
            } else {
              console.log("No onLocationSelect handler provided");
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
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();
  }, [isClient, setMap, onLocationSelect, position, pickup, dropoff]);

  // Update map when position changes
  useEffect(() => {
    if (!mapRef.current || !position) return;

    try {
      const normalizedPosition = normalizeLocation(position);
      if (normalizedPosition) {
        mapRef.current.setView(
          [normalizedPosition.coords.lat, normalizedPosition.coords.lng],
          15
        );
      }
    } catch (error) {
      console.error("Error updating map view:", error);
    }
  }, [position]);

  return (
    <div
      id="map-container"
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        zIndex: 0,
      }}
    />
  );
};

export default MapComponent;
