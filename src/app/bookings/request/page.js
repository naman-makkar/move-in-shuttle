"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  MapPinIcon, 
  ClockIcon, 
  ArrowRightIcon, 
  Search, 
  X, 
  Navigation, 
  Info, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useBookingStore from "@/store/bookingStore";
import "leaflet/dist/leaflet.css";
import "../map.css";

// Toast notification component
function Toast({ message, type = "info", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const bgColor = type === "info" ? "bg-blue-500" : type === "success" ? "bg-green-500" : "bg-gray-700";
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm flex items-start animate-fade-in`}>
      {type === "info" ? <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" /> : <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />}
      <div>
        <div className="font-medium">{message.title}</div>
        {message.description && <div className="text-sm mt-1 text-white text-opacity-90">{message.description}</div>}
      </div>
      <button onClick={onClose} className="ml-3 flex-shrink-0">
        <X className="h-4 w-4 text-white text-opacity-70 hover:text-opacity-100" />
      </button>
    </div>
  );
}

// Dynamically import the map component with no SSR
const MapWithNoSSR = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center rounded-lg">
      <div className="loading-spinner"></div>
      <span className="ml-3 text-gray-600">Loading Map...</span>
    </div>
  )
});

export default function BookingRequestPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mapHint, setMapHint] = useState(true);
  const [toast, setToast] = useState(null);

  // Local states for form fields
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  const [shift, setShift] = useState("morning");
  const [day, setDay] = useState("weekday");
  const [stops, setStops] = useState([]);
  
  // Map related states
  const [mapInstance, setMapInstance] = useState(null);
  const [isSettingPickup, setIsSettingPickup] = useState(true);
  const isSettingPickupRef = useRef(true);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // References to the select elements for direct manipulation
  const fromSelectRef = useRef(null);
  const toSelectRef = useRef(null);

  // Helper to show toast notifications
  const showToast = (title, description, type = "info") => {
    setToast({ title, description, type });
  };

  // Handle closing the toast
  const closeToast = () => {
    setToast(null);
  };

  // Update the ref whenever the state changes
  useEffect(() => {
    isSettingPickupRef.current = isSettingPickup;
  }, [isSettingPickup]);

  // Helper function to update select value programmatically
  const updateSelectValue = (isPickup, stopId) => {
    console.log(`Attempting to update ${isPickup ? 'pickup' : 'dropoff'} select with value: ${stopId}`);
    
    // Update the state first
    if (isPickup) {
      setFromStop(stopId);
    } else {
      setToStop(stopId);
    }
    
    // Using a longer timeout to ensure component re-renders first
    setTimeout(() => {
      try {
        // For Radix UI Select, we can try to find the hidden input element
        const selector = isPickup ? '[name="fromStop"]' : '[name="toStop"]';
        const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
        console.log(`Found ${hiddenInputs.length} hidden inputs`);
        
        hiddenInputs.forEach(input => {
          console.log(`Checking input: ${input.name || 'unnamed'}`);
        });
        
        // Try to find trigger button for the select
        const selectTrigger = document.getElementById(isPickup ? 'fromStop' : 'toStop');
        if (selectTrigger) {
          console.log(`Found select trigger for ${isPickup ? 'fromStop' : 'toStop'}`);
          
          // For debugging: log all data attributes
          console.log('Data attributes:', Object.keys(selectTrigger.dataset));
          
          // For Radix, we might need to trigger a click and then select the item
          // This is just for debugging, not the actual solution
          console.log('Select trigger HTML:', selectTrigger.outerHTML);
        }
        
        // Third approach: create and dispatch a custom event that our component listens for
        const event = new CustomEvent('externalValueSet', { 
          bubbles: true, 
          detail: { isPickup, stopId } 
        });
        document.dispatchEvent(event);
        console.log(`Dispatched custom event for ${isPickup ? 'pickup' : 'dropoff'} with value ${stopId}`);
      } catch (err) {
        console.error('Error in updateSelectValue:', err);
      }
    }, 250);
  };

  // Listen for the custom event on both select components
  useEffect(() => {
    const handleExternalValueSet = (e) => {
      const { isPickup, stopId } = e.detail;
      console.log(`Custom event received: ${isPickup ? 'pickup' : 'dropoff'} = ${stopId}`);
      if (isPickup) {
        setFromStop(stopId);
      } else {
        setToStop(stopId);
      }
    };
    
    document.addEventListener('externalValueSet', handleExternalValueSet);
    
    return () => {
      document.removeEventListener('externalValueSet', handleExternalValueSet);
    };
  }, []);

  // Import the store function for updating criteria
  const { setSearchCriteria } = useBookingStore();

  // Fetch available stops from the stops API
  useEffect(() => {
    async function fetchStops() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/stops");
        if (res.ok) {
          const data = await res.json();
          
          // Validate all stops have proper location data
          const validatedStops = data.map(stop => {
            // If stop has no location data
            if (!stop.location) {
              console.warn(`Stop ${stop.stopName} (${stop.stopId}) is missing location data`);
              stop.location = { latitude: null, longitude: null };
            }
            
            // Convert string coordinates to numbers if needed
            if (stop.location && typeof stop.location.latitude === 'string') {
              stop.location.latitude = parseFloat(stop.location.latitude);
              console.log(`Converted string latitude to number for ${stop.stopName}`);
            }
            
            if (stop.location && typeof stop.location.longitude === 'string') {
              stop.location.longitude = parseFloat(stop.location.longitude);
              console.log(`Converted string longitude to number for ${stop.stopName}`);
            }
            
            return stop;
          });
          
          // Count stops with valid location data
          const validStops = validatedStops.filter(stop => 
            stop.location && 
            typeof stop.location.latitude === 'number' && 
            !isNaN(stop.location.latitude) &&
            typeof stop.location.longitude === 'number' && 
            !isNaN(stop.location.longitude)
          );
          
          console.log(`Fetched ${validatedStops.length} stops, ${validStops.length} with valid coordinates`);
          
          setStops(validatedStops);
        } else {
          setError("Failed to fetch college shuttle stops");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching campus shuttle stops");
      } finally {
        setLoading(false);
      }
    }
    fetchStops();
  }, []);
  
  // Debug: Log stops whenever they change
  useEffect(() => {
    if (stops && stops.length > 0) {
      console.log("Current stops with locations:");
      stops.forEach(stop => {
        console.log(`${stop.stopName}: ${stop.location?.latitude}, ${stop.location?.longitude}`);
      });
    }
  }, [stops]);

  // Find a stop that's near the clicked location
  const findNearbyStop = (clickedLocation) => {
    if (!stops || !stops.length) {
      console.log("No stops available to find nearby stop");
      return null;
    }
    
    const [clickedLat, clickedLng] = clickedLocation;
    console.log(`Finding nearby stop for location: ${clickedLat}, ${clickedLng}`);
    
    // Find the closest stop by calculating distance to each stop
    let closestStop = null;
    let minDistance = Infinity;
    
    // Filter out stops with invalid locations before calculating distances
    const validStops = stops.filter(stop => 
      stop && stop.location && 
      typeof stop.location.latitude === 'number' && 
      !isNaN(stop.location.latitude) &&
      typeof stop.location.longitude === 'number' && 
      !isNaN(stop.location.longitude)
    );
    
    console.log(`Found ${validStops.length} valid stops out of ${stops.length} total stops`);
    
    validStops.forEach(stop => {
      const distance = calculateDistance(
        clickedLat, 
        clickedLng, 
        stop.location.latitude, 
        stop.location.longitude
      );
      
      // Debug log to verify distances are being calculated correctly
      console.log(`Stop ${stop.stopName} (${stop.stopId}): distance = ${distance}m`);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestStop = stop;
      }
    });
    
    console.log(`Closest stop: ${closestStop ? `${closestStop.stopName} (${closestStop.stopId})` : 'none'} at ${minDistance}m`);
    return closestStop;
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // First, make sure all coordinates are valid numbers
    lat1 = Number(lat1);
    lon1 = Number(lon1);
    lat2 = Number(lat2);
    lon2 = Number(lon2);
    
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      console.error('Invalid coordinates:', { lat1, lon1, lat2, lon2 });
      return Infinity; // Return a large value to avoid selecting this stop
    }
    
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle map click to set pickup or dropoff location
  const handleMapClick = async (coordinates) => {
    setMapHint(false); // Hide the hint once user interacts with map
    const [lat, lng] = coordinates;
    
    console.log(`Map clicked at: ${lat}, ${lng}`);
    
    // Use the ref value instead of the state directly to ensure it's current
    const currentIsSettingPickup = isSettingPickupRef.current;
    console.log(`Current mode: ${currentIsSettingPickup ? 'setting pickup' : 'setting dropoff'}`);
    
    try {
      // Find the nearest stop to the clicked location FIRST
      // This ensures we have the stop data before updating any state
      const nearbyStop = findNearbyStop([lat, lng]);
      
      // Reverse geocoding to get address from coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      const location = {
        latitude: lat,
        longitude: lng,
        address: data.display_name || `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        type: currentIsSettingPickup ? 'pickup' : 'dropoff'
      };

      // Update pickup or dropoff based on current mode
      if (currentIsSettingPickup) {
        console.log("Setting pickup location:", location);
        setPickupLocation(location);
        
        // Auto-select the nearest stop in the dropdown if one was found
        if (nearbyStop) {
          console.log(`Setting fromStop to ${nearbyStop.stopId} (${nearbyStop.stopName})`);
          
          // Use the new helper function to update the select value
          updateSelectValue(true, nearbyStop.stopId);
          
          // Calculate the distance to show in the notification
          const distance = Math.round(calculateDistance(
            lat, lng, 
            nearbyStop.location.latitude, 
            nearbyStop.location.longitude
          ));
          
          // Show a message about the auto-selected stop
          showToast(
            `Nearest stop: ${nearbyStop.stopName}`,
            `Distance: ~${distance}m`
          );
        } else {
          console.warn("No nearby stop found for pickup location");
        }
      } else {
        console.log("Setting dropoff location:", location);
        setDropoffLocation(location);
        
        // Auto-select the nearest stop in the dropdown if one was found
        if (nearbyStop) {
          console.log(`Setting toStop to ${nearbyStop.stopId} (${nearbyStop.stopName})`);
          
          // Use the new helper function to update the select value
          updateSelectValue(false, nearbyStop.stopId);
          
          // Calculate the distance to show in the notification
          const distance = Math.round(calculateDistance(
            lat, lng, 
            nearbyStop.location.latitude, 
            nearbyStop.location.longitude
          ));
          
          // Show a message about the auto-selected stop
          showToast(
            `Nearest stop: ${nearbyStop.stopName}`,
            `Distance: ~${distance}m`
          );
        } else {
          console.warn("No nearby stop found for dropoff location");
        }
      }

      // Center the map on the selected location
      if (mapInstance) {
        mapInstance.flyTo([lat, lng], 16);
      }
    } catch (error) {
      console.error('Error setting location:', error);
      
      // Fallback in case of error
      const location = {
        latitude: lat,
        longitude: lng,
        address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        type: currentIsSettingPickup ? 'pickup' : 'dropoff'
      };
      
      // Still try to find the nearest stop
      const nearbyStop = findNearbyStop([lat, lng]);
      
      if (currentIsSettingPickup) {
        setPickupLocation(location);
        if (nearbyStop) {
          updateSelectValue(true, nearbyStop.stopId);
        }
      } else {
        setDropoffLocation(location);
        if (nearbyStop) {
          updateSelectValue(false, nearbyStop.stopId);
        }
      }
    }
  };

  // Handle search for locations
  const handleSearch = async () => {
    setMapHint(false);
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
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
      setIsSearching(false);
    }
  };

  // Handle selection of search result
  const handleSelectSearchResult = (result) => {
    // Use the ref value for consistency
    const currentIsSettingPickup = isSettingPickupRef.current;
    console.log(`Search result selected in mode: ${currentIsSettingPickup ? 'pickup' : 'dropoff'}`);
    console.log("Result:", result);
    
    const resultWithType = {
      ...result,
      type: currentIsSettingPickup ? 'pickup' : 'dropoff'
    };
    
    // Find the nearest stop to the selected location
    const nearbyStop = findNearbyStop([result.latitude, result.longitude]);
    
    if (currentIsSettingPickup) {
      setPickupLocation(resultWithType);
      
      // Auto-select the nearest stop if one was found
      if (nearbyStop) {
        console.log(`Setting fromStop to ${nearbyStop.stopId} (${nearbyStop.stopName})`);
        
        // Use the new helper function
        updateSelectValue(true, nearbyStop.stopId);
        
        // Calculate distance to show in notification
        const distance = Math.round(calculateDistance(
          result.latitude, 
          result.longitude, 
          nearbyStop.location.latitude, 
          nearbyStop.location.longitude
        ));
        
        // Show notification about auto-selected stop
        showToast(
          `Nearest stop: ${nearbyStop.stopName}`,
          `Distance: ~${distance}m`
        );
      } else {
        console.warn("No nearby stop found for search result (pickup)");
      }
    } else {
      setDropoffLocation(resultWithType);
      
      // Auto-select the nearest stop if one was found
      if (nearbyStop) {
        console.log(`Setting toStop to ${nearbyStop.stopId} (${nearbyStop.stopName})`);
        
        // Use the new helper function
        updateSelectValue(false, nearbyStop.stopId);
        
        // Calculate distance to show in notification
        const distance = Math.round(calculateDistance(
          result.latitude, 
          result.longitude, 
          nearbyStop.location.latitude, 
          nearbyStop.location.longitude
        ));
        
        // Show notification about auto-selected stop
        showToast(
          `Nearest stop: ${nearbyStop.stopName}`,
          `Distance: ~${distance}m`
        );
      } else {
        console.warn("No nearby stop found for search result (dropoff)");
      }
    }
    
    setSearchResults([]);
    setSearchQuery('');
    
    // Center the map on the selected location
    if (mapInstance) {
      mapInstance.flyTo([result.latitude, result.longitude], 16);
    }
  };

  // When selecting a stop from dropdown, update map with its location
  const handleFromStopChange = (stopId) => {
    console.log(`handleFromStopChange called with stopId: ${stopId}`);
    setFromStop(stopId);
    
    const selectedStop = stops.find(stop => stop.stopId === stopId);
    console.log("Selected pickup stop:", selectedStop);
    
    if (selectedStop && selectedStop.location && 
        typeof selectedStop.location.latitude === 'number' && 
        typeof selectedStop.location.longitude === 'number') {
      
      const location = {
        latitude: selectedStop.location.latitude,
        longitude: selectedStop.location.longitude,
        address: selectedStop.stopName,
        type: 'pickup'
      };
      
      console.log("Setting pickup location:", location);
      setPickupLocation(location);
      
      // Center map on selected location
      if (mapInstance) {
        console.log(`Centering map on: ${location.latitude}, ${location.longitude}`);
        mapInstance.flyTo(
          [location.latitude, location.longitude], 
          16
        );
      }
    } else {
      console.warn("Selected stop has invalid location data:", selectedStop);
    }
  };
  
  const handleToStopChange = (stopId) => {
    console.log(`handleToStopChange called with stopId: ${stopId}`);
    setToStop(stopId);
    
    const selectedStop = stops.find(stop => stop.stopId === stopId);
    console.log("Selected dropoff stop:", selectedStop);
    
    if (selectedStop && selectedStop.location && 
        typeof selectedStop.location.latitude === 'number' && 
        typeof selectedStop.location.longitude === 'number') {
      
      const location = {
        latitude: selectedStop.location.latitude,
        longitude: selectedStop.location.longitude,
        address: selectedStop.stopName,
        type: 'dropoff'
      };
      
      console.log("Setting dropoff location:", location);
      setDropoffLocation(location);
      
      // Center map on selected location
      if (mapInstance) {
        console.log(`Centering map on: ${location.latitude}, ${location.longitude}`);
        mapInstance.flyTo(
          [location.latitude, location.longitude], 
          16
        );
      }
    } else {
      console.warn("Selected stop has invalid location data:", selectedStop);
    }
  };

  // Clear pickup or dropoff location
  const clearLocation = (type) => {
    if (type === 'pickup') {
      setPickupLocation(null);
      setFromStop("");
    } else {
      setDropoffLocation(null);
      setToStop("");
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!fromStop || !toStop || fromStop === toStop) {
      setError("Please select different pickup and drop-off locations");
      return;
    }

    // Add location coordinates to search criteria if available
    const searchCriteria = { 
      fromStop, 
      toStop, 
      shift, 
      day,
      pickupLocation,
      dropoffLocation
    };

    // Save to Zustand store
    setSearchCriteria(searchCriteria);
    
    // Now go to the search page
    router.push("/bookings/search");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Book a Campus Shuttle
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="border-slate-200 shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle>Find Your Shuttle</CardTitle>
            <CardDescription>
              Select your pickup and drop-off locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fromStop" className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-green-600" />
                    Pickup Location {fromStop ? `(${fromStop})` : ""}
                  </Label>
                  <Select
                    value={fromStop}
                    onValueChange={handleFromStopChange}
                    disabled={loading}
                  >
                    <SelectTrigger id="fromStop" ref={fromSelectRef}>
                      <SelectValue placeholder="Select pickup location" />
                    </SelectTrigger>
                    <SelectContent>
                      {stops.map((stop) => (
                        <SelectItem key={stop.stopId} value={stop.stopId}>
                          {stop.stopName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toStop" className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-red-600" />
                    Drop-off Location {toStop ? `(${toStop})` : ""}
                  </Label>
                  <Select
                    value={toStop}
                    onValueChange={handleToStopChange}
                    disabled={loading}
                  >
                    <SelectTrigger id="toStop" ref={toSelectRef}>
                      <SelectValue placeholder="Select drop-off location" />
                    </SelectTrigger>
                    <SelectContent>
                      {stops.map((stop) => (
                        <SelectItem key={stop.stopId} value={stop.stopId}>
                          {stop.stopName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shift" className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    Time of Day
                  </Label>
                  <Select value={shift} onValueChange={setShift}>
                    <SelectTrigger id="shift">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">
                        Morning (6:30 AM - 12:00 PM)
                      </SelectItem>
                      <SelectItem value="afternoon">
                        Afternoon (12:00 PM - 5:00 PM)
                      </SelectItem>
                      <SelectItem value="evening">
                        Evening (5:00 PM - 11:30 PM)
                      </SelectItem>
                      <SelectItem value="latenight">
                        Late Night (11:30 PM - 2:00 AM)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day" className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    Day Type
                  </Label>
                  <Select value={day} onValueChange={setDay}>
                    <SelectTrigger id="day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekday">
                        Class Day (Mon-Fri)
                      </SelectItem>
                      <SelectItem value="weekend">
                        Weekend (Sat-Sun)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700"
              onClick={handleSubmit}
              disabled={loading || !fromStop || !toStop}
            >
              Find Shuttles
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col lg:col-span-2">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                <button
                  className={`btn-secondary flex-1 ${isSettingPickup ? 'bg-green-50 border-green-200 text-green-600' : ''}`}
                  onClick={() => setIsSettingPickup(true)}
                >
                  <MapPinIcon className="h-4 w-4 mr-2 inline-block" />
                  Set Pickup
                </button>
                <button
                  className={`btn-secondary flex-1 ${!isSettingPickup ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                  onClick={() => setIsSettingPickup(false)}
                >
                  <MapPinIcon className="h-4 w-4 mr-2 inline-block" />
                  Set Dropoff
                </button>
              </div>
            
              <div className="relative">
                <input
                  type="text"
                  className="modern-input"
                  placeholder={`Search for ${isSettingPickup ? 'pickup' : 'dropoff'} location...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                  onClick={handleSearch}
                >
                  {isSearching ? (
                    <div className="h-4 w-4 loading-spinner"></div>
                  ) : (
                    <Search className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
  
              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-1 max-h-[200px] overflow-y-auto rounded-md bg-white shadow-lg">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSelectSearchResult(result)}
                    >
                      {result.address}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative h-[400px] w-full mb-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <MapWithNoSSR
              pickup={pickupLocation}
              dropoff={dropoffLocation}
              stops={stops.filter(stop => 
                stop.location && 
                typeof stop.location.latitude === 'number' && 
                typeof stop.location.longitude === 'number'
              ).map(stop => ({
                latitude: stop.location.latitude,
                longitude: stop.location.longitude,
                name: stop.stopName,
                address: stop.stopName
              }))}
              setMap={setMapInstance}
              onLocationSelect={handleMapClick}
            />
            
            {mapHint && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
                  <div className="flex gap-2 items-center mb-2 text-blue-600">
                    <Info className="h-5 w-5" />
                    <h3 className="font-bold">How to use the map</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Select "Set Pickup" or "Set Dropoff" above, then click on the map to place your marker. 
                    You can also search for a location or select campus stops from the dropdown menu.
                  </p>
                  <button 
                    onClick={() => setMapHint(false)}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            {pickupLocation && (
              <div className="location-card flex-1 p-3 text-sm min-w-[200px]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="location-icon pickup">
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-2">
                      <div className="font-medium">Pickup Location</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{pickupLocation.address}</div>
                    </div>
                  </div>
                  <button onClick={() => clearLocation('pickup')} className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {dropoffLocation && (
              <div className="location-card flex-1 p-3 text-sm min-w-[200px]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="location-icon dropoff">
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-2">
                      <div className="font-medium">Dropoff Location</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{dropoffLocation.address}</div>
                    </div>
                  </div>
                  <button onClick={() => clearLocation('dropoff')} className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {!pickupLocation && !dropoffLocation && (
              <div className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                Select pickup and dropoff locations on the map or from the dropdown menu
              </div>
            )}
          </div>
        </div>
      </div>
      
      {toast && (
        <Toast 
          message={toast} 
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
}
