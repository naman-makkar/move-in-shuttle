import { NextResponse } from 'next/server';

// Predefined locations for shuttles in Greater Noida
const stopLocations = {
  'Pari Chowk': { lat: 28.4651, lng: 77.503 },
  Depot: { lat: 28.4757, lng: 77.5047 },
  'Bennett University': { lat: 28.4496, lng: 77.5858 },
  'Delta 1': { lat: 28.4755, lng: 77.5044 }
};

// Sample routes data
const routes = [
  {
    id: '1',
    name: 'Bennett Express',
    from: 'Pari Chowk',
    to: 'Bennett University',
    shuttles: ['Shuttle A', 'Shuttle B'],
    price: 30,
    duration: '25 mins',
    distance: '12 km',
    schedule: [
      { departure: '07:30', arrival: '07:55' },
      { departure: '09:00', arrival: '09:25' },
      { departure: '12:30', arrival: '12:55' },
      { departure: '16:00', arrival: '16:25' }
    ]
  },
  // …other routes
];

export async function GET(_request, { params }) {
  try {
    // params.filter is an optional array from the URL path.
    // If the URL is e.g. /api/routes/Pari%20Chowk/Bennett%20University then:
    // params.filter = ['Pari Chowk', 'Bennett University']
    const filter = params.filter || [];
    let fromStopParam, toStopParam;
    if (filter.length === 2) {
      [fromStopParam, toStopParam] = filter;
    }
    let filteredRoutes = [...routes];
    if (fromStopParam) {
      filteredRoutes = filteredRoutes.filter(
        (route) => route.from.toLowerCase() === fromStopParam.toLowerCase()
      );
    }
    if (toStopParam) {
      filteredRoutes = filteredRoutes.filter(
        (route) => route.to.toLowerCase() === toStopParam.toLowerCase()
      );
    }
    const routesWithCoordinates = filteredRoutes.map((route) => ({
      ...route,
      fromCoordinates: stopLocations[route.from],
      toCoordinates: stopLocations[route.to]
    }));

    return NextResponse.json({
      routes: routesWithCoordinates,
      stops: Object.keys(stopLocations).map((name) => ({
        name,
        coordinates: stopLocations[name]
      }))
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routes data' },
      { status: 500 }
    );
  }
}
